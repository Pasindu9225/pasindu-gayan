"use client";

import { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import {
    LogOut,
    FileText,
    Briefcase,
    Award,
    Upload,
    CheckCircle,
    Loader2,
    MessageSquare
} from "lucide-react";

import ProjectManager from "../../../components/ProjectManager";
import CertificateManager from "../../../components/CertificateManager";
import MessageManager from "../../../components/MessageManager"; // <--- IMPORT NEW COMPONENT

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("resume");

    // --- RESUME UPLOAD LOGIC ---
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/resume/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setUploadStatus("Success! Resume updated successfully.");
            } else {
                setUploadStatus("Upload failed. Please try again.");
            }
        } catch (error) {
            setUploadStatus("Error uploading file.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream flex font-sans text-brand-dark">

            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-stone-200 p-6 flex flex-col fixed h-full z-20">
                <h2 className="text-2xl font-bold text-brand-dark mb-10 tracking-tight">
                    Admin<span className="text-brand-gold">.</span>
                </h2>

                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab("resume")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "resume" ? "bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20" : "text-stone-500 hover:bg-stone-50"}`}
                    >
                        <FileText size={18} /> Resume
                    </button>
                    <button
                        onClick={() => setActiveTab("projects")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "projects" ? "bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20" : "text-stone-500 hover:bg-stone-50"}`}
                    >
                        <Briefcase size={18} /> Projects
                    </button>
                    <button
                        onClick={() => setActiveTab("certificates")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "certificates" ? "bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20" : "text-stone-500 hover:bg-stone-50"}`}
                    >
                        <Award size={18} /> Certificates
                    </button>
                    <button
                        onClick={() => setActiveTab("messages")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "messages" ? "bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20" : "text-stone-500 hover:bg-stone-50"}`}
                    >
                        <MessageSquare size={18} /> Messages
                    </button>
                </nav>

                {/* Logout Button */}
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors mt-auto"
                >
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 ml-64 p-10 relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-brand-gold/5 to-transparent -z-10" />

                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-brand-dark capitalize mb-2">{activeTab} Management</h1>
                        <p className="text-stone-500 text-sm">Manage your portfolio content from here.</p>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 min-h-[500px] p-8 relative overflow-hidden">

                    {/* 1. RESUME MANAGER */}
                    {activeTab === "resume" && (
                        <div className="max-w-2xl mx-auto space-y-8 mt-10">
                            {/* Hidden Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="application/pdf"
                                className="hidden"
                            />

                            {/* Upload Box */}
                            <div
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className={`group p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${isUploading ? "border-brand-emerald bg-brand-emerald/5 cursor-wait" : "border-stone-300 hover:border-brand-emerald hover:bg-brand-emerald/5"}`}
                            >
                                {isUploading ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <Loader2 size={32} className="text-brand-emerald animate-spin mb-4" />
                                        <p className="text-brand-emerald font-medium">Uploading to Cloud...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-4 bg-stone-50 rounded-full group-hover:bg-white group-hover:shadow-md transition-all mb-4">
                                            <Upload size={32} className="group-hover:text-brand-emerald transition-colors text-stone-400" />
                                        </div>
                                        <p className="font-medium text-stone-600">Click to upload new CV (PDF)</p>
                                        <p className="text-sm opacity-60 mt-1">Max file size: 5MB</p>
                                    </>
                                )}
                            </div>

                            {/* Status Message */}
                            {uploadStatus && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 ${uploadStatus.includes("Success") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                                    <CheckCircle size={18} />
                                    <span className="font-medium">{uploadStatus}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. PROJECT MANAGER */}
                    {activeTab === "projects" && (
                        <ProjectManager />
                    )}

                    {/* 3. CERTIFICATE MANAGER */}
                    {activeTab === "certificates" && (
                        <CertificateManager />
                    )}

                    {/* 4. MESSAGE MANAGER (NEW) */}
                    {activeTab === "messages" && (
                        <MessageManager />
                    )}

                </div>
            </main>
        </div>
    );
}