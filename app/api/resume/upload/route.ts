import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
// FIX: Import the shared 'prisma' instance, NOT the class
import prisma from "@/lib/db";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "portfolio_resume",
                    public_id: `resume_${Date.now()}`,
                    format: "pdf"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        // Database Operations using the shared 'prisma'
        await prisma.resume.updateMany({
            where: { isActive: true },
            data: { isActive: false }
        });

        const newResume = await prisma.resume.create({
            data: {
                fileUrl: result.secure_url,
                isActive: true
            }
        });

        return NextResponse.json({ success: true, url: result.secure_url });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}