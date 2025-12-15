"use client";

import { useEffect, useRef, useState } from "react";

export default function MouseSpotlight() {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="fixed inset-0 -z-10 h-full w-full bg-brand-cream overflow-hidden"
        >
            {/* 1. Base Dot Pattern (Faint) */}
            <div
                className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"
            />

            {/* 2. The Moving Spotlight */}
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(197, 160, 89, 0.15), transparent 40%)`,
                }}
            />

            {/* 3. Highlighted Dots (Only visible inside spotlight) */}
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#064E3B_1px,transparent_1px)] [background-size:16px_16px] transition-opacity duration-300"
                style={{
                    opacity,
                    maskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent)`,
                    WebkitMaskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent)`,
                }}
            />
        </div>
    );
}