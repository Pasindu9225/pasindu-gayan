import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET: Fetch all projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

// POST: Create a new project
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, imageUrls, techStack, liveLink, githubLink } = body;

        const newProject = await prisma.project.create({
            data: {
                title,
                description,
                imageUrls: imageUrls || [],
                techStack: techStack || [],
                liveLink: liveLink || "",
                githubLink: githubLink || "",
            },
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}

// PUT: Update an existing project
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, description, imageUrls, techStack, liveLink, githubLink } = body;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                title,
                description,
                imageUrls: imageUrls,
                techStack,
                liveLink,
                githubLink,
            },
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

// DELETE: Remove a project
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.project.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}