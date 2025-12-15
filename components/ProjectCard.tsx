"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";

export type Project = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    imageUrls?: string[];
    techStack: string[];
    liveLink?: string;
    githubLink?: string;
};

interface ProjectCardProps {
    project: Project;
    onClick: (project: Project) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
    // Combine single image and array into one list for the slider
    const images = project.imageUrls && project.imageUrls.length > 0
        ? project.imageUrls
        : (project.imageUrl ? [project.imageUrl] : []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Dragging State
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const touchStartX = useRef(0);

    // --- AUTOMATIC LOOP ---
    useEffect(() => {
        if (images.length <= 1 || isHovered || isDragging) return;

        const interval = setInterval(() => {
            nextImage();
        }, 4000); // 4 Seconds

        return () => clearInterval(interval);
    }, [currentIndex, isHovered, isDragging, images.length]);

    // --- NAVIGATION HELPERS ---
    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // --- MOUSE DRAG HANDLERS ---
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        // Optional: You could add "preview" dragging logic here
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const endX = e.clientX;
        const diff = startX - endX;

        if (diff > 50) nextImage(); // Dragged Left -> Next
        else if (diff < -50) prevImage(); // Dragged Right -> Prev

        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setIsHovered(false);
    };

    // Prevent clicking the card when strictly dragging
    const handleCardClick = (e: React.MouseEvent) => {
        // If the mouse moved significantly, don't trigger the modal click
        // (This simple check assumes a click is instantaneous vs a drag)
        if (!isDragging) {
            onClick(project);
        }
    };

    return (
        <div
            className="group bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden flex flex-col h-full select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {/* --- SLIDER SECTION --- */}
            <div
                className="h-48 w-full bg-stone-100 relative overflow-hidden border-b border-stone-100 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {images.length > 0 ? (
                    <>
                        {/* Image Display */}
                        <div className="w-full h-full relative">
                            <img
                                src={images[currentIndex]}
                                alt={project.title}
                                className="w-full h-full object-cover pointer-events-none animate-fadeIn" // pointer-events-none prevents ghost image dragging
                                key={currentIndex} // Forces re-render for animation if you add CSS animations
                            />
                        </div>

                        {/* Dots Indicator (Only shows on hover) */}
                        {images.length > 1 && (
                            <div className={`absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 rounded-full transition-all shadow-sm ${idx === currentIndex ? "bg-white w-4" : "bg-white/60 w-1.5"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Arrows (Optional - uncomment if you want explicit buttons too) */}
                        {/* {isHovered && images.length > 1 && (
               <>
                 <button onClick={(e) => {e.stopPropagation(); prevImage()}} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50"><ChevronLeft size={16}/></button>
                 <button onClick={(e) => {e.stopPropagation(); nextImage()}} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50"><ChevronRight size={16}/></button>
               </>
            )} */}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-50">
                        <FolderGit2 size={48} strokeWidth={1.5} />
                    </div>
                )}
            </div>

            {/* --- CONTENT SECTION --- */}
            {/* Added onClick here specifically so dragging the image doesn't open the modal */}
            <div className="p-6 relative flex-1 flex flex-col cursor-pointer" onClick={() => onClick(project)}>

                <div className="absolute top-6 right-6 text-stone-300 group-hover:text-brand-emerald transition-colors">
                    <ArrowUpRight size={24} />
                </div>

                <h3 className="text-xl font-bold text-brand-dark mb-3 line-clamp-1 pr-8">
                    {project.title}
                </h3>

                <p className="text-stone-600 mb-6 line-clamp-2 text-sm flex-1">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {project.techStack.slice(0, 3).map((tech, index) => (
                        <span
                            key={index}
                            className="px-2.5 py-1 bg-stone-50 text-stone-600 text-xs font-semibold rounded-md border border-stone-100 uppercase tracking-wider"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.techStack.length > 3 && (
                        <span className="px-2.5 py-1 text-stone-500 text-xs font-semibold rounded-md border border-stone-100">
                            +{project.techStack.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}