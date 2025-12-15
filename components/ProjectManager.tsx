"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Edit, Plus, X, Upload } from "lucide-react";

type Project = {
    id: string;
    title: string;
    description: string;
    imageUrls: string[];
    techStack: string[];
    liveLink: string;
    githubLink: string;
};

export default function ProjectManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        techStack: [] as string[],
        liveLink: "",
        githubLink: "",
    });

    // Image State
    const [existingImages, setExistingImages] = useState<string[]>([]); // URLs already in DB
    const [newFiles, setNewFiles] = useState<File[]>([]); // New files to upload

    const [tagInput, setTagInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const res = await fetch("/api/projects");
        if (res.ok) setProjects(await res.json());
    };

    // --- ACTIONS ---

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setFormData({
            title: project.title,
            description: project.description,
            techStack: project.techStack,
            liveLink: project.liveLink || "",
            githubLink: project.githubLink || "",
        });
        setExistingImages(project.imageUrls || []);
        setNewFiles([]);
        setIsModalOpen(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selected = Array.from(e.target.files);
            if (existingImages.length + newFiles.length + selected.length > 5) {
                alert("Maximum 5 images allowed.");
                return;
            }
            setNewFiles([...newFiles, ...selected]);
        }
    };

    const removeExistingImage = (urlToRemove: string) => {
        setExistingImages(existingImages.filter(url => url !== urlToRemove));
    };

    const removeNewFile = (index: number) => {
        setNewFiles(newFiles.filter((_, i) => i !== index));
    };

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let uploadedUrls: string[] = [];

            // 1. Upload NEW images if any
            if (newFiles.length > 0) {
                const uploadData = new FormData();
                newFiles.forEach((file) => uploadData.append("file", file));

                const uploadRes = await fetch("/api/projects/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (!uploadRes.ok) throw new Error("Image upload failed");
                const data = await uploadRes.json();
                uploadedUrls = data.urls;
            }

            // 2. Combine Old + New Images
            const finalImageUrls = [...existingImages, ...uploadedUrls];

            // 3. Prepare Payload
            const payload = {
                ...formData,
                imageUrls: finalImageUrls,
                id: editingId, // Included for PUT
            };

            // 4. Send Request (POST or PUT)
            const method = editingId ? "PUT" : "POST";
            const res = await fetch("/api/projects", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save project");

            await fetchProjects();
            closeModal();
            alert(editingId ? "Project updated!" : "Project created!");

        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- TAGS ---
    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!formData.techStack.includes(tagInput.trim())) {
                setFormData({ ...formData, techStack: [...formData.techStack, tagInput.trim()] });
            }
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== tag) });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
        fetchProjects();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ title: "", description: "", techStack: [], liveLink: "", githubLink: "" });
        setExistingImages([]);
        setNewFiles([]);
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-stone-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-stone-800">Projects</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
                    <Plus size={18} /> Add Project
                </button>
            </div>

            <div className="grid gap-4">
                {projects.map((project) => (
                    <div key={project.id} className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition bg-stone-50/50">
                        <div>
                            <h3 className="font-bold text-lg">{project.title}</h3>
                            <p className="text-sm text-stone-500 line-clamp-1">{project.description}</p>
                            <div className="flex gap-2 mt-2">
                                {project.techStack.map(t => <span key={t} className="text-xs bg-white border px-2 py-1 rounded text-stone-600">{t}</span>)}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(project)} className="p-2 text-blue-500 hover:bg-blue-50 rounded" title="Edit">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-50 rounded" title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingId ? "Edit Project" : "Add New Project"}</h3>
                            <button onClick={closeModal}><X className="text-stone-400 hover:text-red-500" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Project Title</label>
                                <input required type="text" className="w-full p-2 border rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea required rows={3} className="w-full p-2 border rounded-lg" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Tech Stack</label>
                                <input type="text" className="w-full p-2 border rounded-lg" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Type and press Enter" />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.techStack.map((tag) => (
                                        <span key={tag} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                                            {tag} <button type="button" onClick={() => removeTag(tag)}><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Live Link</label>
                                    <input type="url" className="w-full p-2 border rounded-lg" value={formData.liveLink} onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">GitHub Link</label>
                                    <input type="url" className="w-full p-2 border rounded-lg" value={formData.githubLink} onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })} />
                                </div>
                            </div>

                            {/* IMAGE MANAGER */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Images</label>

                                <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
                                    {/* Existing Images */}
                                    {existingImages.map((url) => (
                                        <div key={url} className="relative w-20 h-20 flex-shrink-0 border rounded overflow-hidden">
                                            <img src={url} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"><X size={12} /></button>
                                        </div>
                                    ))}
                                    {/* New Files */}
                                    {newFiles.map((file, i) => (
                                        <div key={i} className="relative w-20 h-20 flex-shrink-0 border rounded overflow-hidden opacity-80">
                                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeNewFile(i)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"><X size={12} /></button>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center cursor-pointer hover:bg-stone-50" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="mx-auto text-stone-400 mb-1" size={20} />
                                    <p className="text-xs text-stone-500">Upload new images</p>
                                    <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50">
                                {isLoading ? "Saving..." : (editingId ? "Update Project" : "Create Project")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}