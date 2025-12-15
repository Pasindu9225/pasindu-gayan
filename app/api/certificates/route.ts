import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET: Fetch all certificates
export async function GET() {
    try {
        const certs = await prisma.certificate.findMany({ orderBy: { issuedAt: 'desc' } });
        return NextResponse.json(certs);
    } catch (error) {
        return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }
}

// POST: Create a new certificate
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, issuer, imageUrl, verifyLink, description, issuedAt } = body;

        const newCert = await prisma.certificate.create({
            data: {
                title,
                issuer,
                imageUrl,
                verifyLink: verifyLink || "",
                description: description || "",
                issuedAt: issuedAt ? new Date(issuedAt) : new Date(),
            },
        });

        return NextResponse.json(newCert, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Creation failed" }, { status: 500 });
    }
}

// PUT: Update a certificate
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, issuer, imageUrl, verifyLink, description, issuedAt } = body;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const updatedCert = await prisma.certificate.update({
            where: { id },
            data: {
                title,
                issuer,
                imageUrl,
                verifyLink,
                description,
                issuedAt: issuedAt ? new Date(issuedAt) : undefined,
            },
        });

        return NextResponse.json(updatedCert);
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

// DELETE: Remove a certificate
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.certificate.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}