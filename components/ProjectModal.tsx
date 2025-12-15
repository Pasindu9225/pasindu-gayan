"use client";

import { useEffect, useState } from "react";
import { X, Github, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "./ProjectCard";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Reset slider to the first image whenever the modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentImageIndex(0);
        }
    }, [isOpen, project]);

    if (!isOpen || !project) return null;

    // Use the array from DB, or fallback to the single imageUrl if that's all that exists
    // We handle both cases to be safe.
    const images = project.imageUrls && project.imageUrls.length > 0
        ? project.imageUrls
        : (project.imageUrl ? [project.imageUrl] : []);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* --- IMAGE SLIDER SECTION --- */}
                <div className="relative w-full h-64 sm:h-96 bg-stone-100 flex items-center justify-center">
                    {images.length > 0 ? (
                        <>
                            <img
                                src={images[currentImageIndex]}
                                alt={project.title}
                                className="w-full h-full object-contain"
                            />

                            {/* Slider Controls (Only show if more than 1 image) */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 p-2 bg-white/80 rounded-full hover:bg-white text-stone-800 shadow-md transition-all hover:scale-110"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 p-2 bg-white/80 rounded-full hover:bg-white text-stone-800 shadow-md transition-all hover:scale-110"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Dots Indicator */}
                                    <div className="absolute bottom-4 flex gap-2">
                                        {images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-2 w-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-stone-400 font-medium">No preview available</div>
                    )}
                </div>

                {/* --- CONTENT SECTION --- */}
                <div className="p-8 overflow-y-auto">
                    <h2 className="text-3xl font-bold text-brand-dark mb-4">{project.title}</h2>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1 bg-brand-emerald/10 text-brand-emerald text-sm font-semibold rounded-full border border-brand-emerald/20"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <p className="text-stone-600 leading-relaxed mb-8 text-lg">
                        {project.description}
                    </p>

                    <div className="flex gap-4">
                        {project.liveLink && (
                            <a
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-transform hover:-translate-y-1"
                            >
                                <ExternalLink size={18} /> Live Demo
                            </a>
                        )}

                        {project.githubLink && (
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 border border-stone-300 text-stone-700 px-6 py-3 rounded-lg font-medium hover:border-brand-dark hover:text-brand-dark transition-all"
                            >
                                <Github size={18} /> View Code
                            </a>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}