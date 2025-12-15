import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("file") as File[]; // Get all files

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files received" }, { status: 400 });
        }

        // Upload all files to Cloudinary in parallel
        const uploadPromises = files.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            return new Promise<string>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "portfolio_projects" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result!.secure_url);
                    }
                ).end(buffer);
            });
        });

        const imageUrls = await Promise.all(uploadPromises);

        return NextResponse.json({ urls: imageUrls });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}