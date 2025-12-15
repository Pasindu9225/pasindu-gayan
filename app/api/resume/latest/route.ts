import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const resume = await prisma.resume.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' }
        });

        if (!resume) {
            return NextResponse.json({ url: null });
        }

        // FIX: Just return the original URL (Don't modify it!)
        return NextResponse.json({ url: resume.fileUrl });

    } catch (error) {
        console.error("Error fetching resume:", error);
        return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
    }
}