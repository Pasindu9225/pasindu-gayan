"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Edit, Plus, X, Upload, ExternalLink } from "lucide-react";

type Certificate = {
    id: string;
    title: string;
    issuer: string;
    imageUrl: string;
    verifyLink?: string;
    description?: string;
    issuedAt: string;
};

export default function CertificateManager() {
    const [certs, setCerts] = useState<Certificate[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form Data
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        issuer: "",
        verifyLink: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
    });

    // Image State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(""); // Shows either old image or new file preview
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchCerts();
    }, []);

    const fetchCerts = async () => {
        const res = await fetch("/api/certificates");
        if (res.ok) setCerts(await res.json());
    };

    // --- ACTIONS ---

    const handleEdit = (cert: Certificate) => {
        setEditingId(cert.id);
        setFormData({
            title: cert.title,
            issuer: cert.issuer,
            verifyLink: cert.verifyLink || "",
            description: cert.description || "",
            date: cert.issuedAt ? new Date(cert.issuedAt).toISOString().split('T')[0] : ""
        });
        setPreviewUrl(cert.imageUrl); // Show existing image
        setSelectedFile(null); // Clear any previous file selection
        setIsModalOpen(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Preview new file
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageUrl = previewUrl; // Default to existing URL if no new file

            // 1. Upload New Image (if selected)
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append("file", selectedFile);

                const res = await fetch("/api/certificates/upload", {
                    method: "POST", body: uploadData
                });
                const data = await res.json();
                if (!res.ok) throw new Error("Image upload failed");
                imageUrl = data.url;
            }

            // 2. Save Data
            const payload = {
                id: editingId,
                title: formData.title,
                issuer: formData.issuer,
                imageUrl, // New or Old URL
                verifyLink: formData.verifyLink,
                description: formData.description,
                issuedAt: formData.date
            };

            const method = editingId ? "PUT" : "POST";
            const res = await fetch("/api/certificates", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save");

            fetchCerts();
            closeModal();
            alert(editingId ? "Certificate updated!" : "Certificate added!");

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this certificate?")) return;
        await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
        fetchCerts();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ title: "", issuer: "", verifyLink: "", description: "", date: "" });
        setSelectedFile(null);
        setPreviewUrl("");
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-stone-800">Certificates</h2>
                <button onClick={() => { setIsModalOpen(true); setEditingId(null); setPreviewUrl(""); }} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
                    <Plus size={18} /> Add Certificate
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certs.map((cert) => (
                    <div key={cert.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition bg-stone-50">
                        <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-white border">
                            <img src={cert.imageUrl} alt={cert.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-stone-800 truncate">{cert.title}</h3>
                            <p className="text-sm text-stone-500">{cert.issuer}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button onClick={() => handleEdit(cert)} className="text-blue-500 hover:text-blue-700" title="Edit">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(cert.id)} className="text-stone-400 hover:text-red-500" title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingId ? "Edit Certificate" : "Add Certificate"}</h3>
                            <button onClick={closeModal}><X className="text-stone-400 hover:text-red-500" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center cursor-pointer hover:bg-stone-50 transition" onClick={() => fileInputRef.current?.click()}>
                                {previewUrl ? (
                                    <div className="flex flex-col items-center">
                                        <img src={previewUrl} className="h-32 object-contain mb-2 rounded" />
                                        <span className="text-emerald-600 text-sm font-medium">Click to Change Image</span>
                                    </div>
                                ) : (
                                    <div className="text-stone-500">
                                        <Upload className="mx-auto mb-2 opacity-50" />
                                        <span className="text-sm">Click to upload Image</span>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input required type="text" className="w-full p-2 border rounded-lg" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Issuer</label>
                                    <input required type="text" className="w-full p-2 border rounded-lg" value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input type="date" className="w-full p-2 border rounded-lg" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Verify Link</label>
                                <input type="url" className="w-full p-2 border rounded-lg" value={formData.verifyLink} onChange={e => setFormData({ ...formData, verifyLink: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea rows={3} className="w-full p-2 border rounded-lg" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <button disabled={isLoading} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50">
                                {isLoading ? "Saving..." : (editingId ? "Update Certificate" : "Save Certificate")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}