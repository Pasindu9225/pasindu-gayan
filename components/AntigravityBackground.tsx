"use client";

import { useEffect, useRef } from "react";

export default function AntigravityBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // --- CONFIGURATION ---
        const PARTICLE_COLOR = "#94a3b8"; // Slate-400 (Cool Gray)
        const PARTICLE_COUNT = 100;       // Number of floating items
        const MOUSE_RADIUS = 200;         // Interaction range
        const REPEL_FORCE = 2;            // Strong push
        const FLOAT_SPEED = 0.5;          // Speed of "Antigravity" rise
        // ---------------------

        let width = window.innerWidth;
        let height = window.innerHeight;

        const mouse = { x: -1000, y: -1000 };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        type ShapeType = "circle" | "square" | "triangle" | "cross";

        class Particle {
            x: number;
            y: number;
            baseX: number; // We won't strictly return to base, but keep it for reference
            baseY: number;
            vx: number;
            vy: number;
            size: number;
            shape: ShapeType;
            angle: number;
            spinSpeed: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.vx = (Math.random() - 0.5) * 0.5; // Slight drift X
                this.vy = -(Math.random() * FLOAT_SPEED + 0.2); // FLOAT UPWARD (Antigravity)
                this.size = Math.random() * 4 + 2;
                this.angle = Math.random() * Math.PI * 2;
                this.spinSpeed = (Math.random() - 0.5) * 0.02;

                // Randomize Shape
                const shapes: ShapeType[] = ["circle", "square", "triangle", "cross"];
                this.shape = shapes[Math.floor(Math.random() * shapes.length)];
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                ctx.fillStyle = PARTICLE_COLOR;
                ctx.strokeStyle = PARTICLE_COLOR;
                ctx.globalAlpha = 0.4;
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                if (this.shape === "circle") {
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (this.shape === "square") {
                    ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                    ctx.fill();
                } else if (this.shape === "triangle") {
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(this.size / 2, this.size / 2);
                    ctx.lineTo(-this.size / 2, this.size / 2);
                    ctx.closePath();
                    ctx.fill();
                } else if (this.shape === "cross") {
                    ctx.moveTo(-this.size / 2, 0);
                    ctx.lineTo(this.size / 2, 0);
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(0, this.size / 2);
                    ctx.stroke(); // Crosses are outlined
                }

                ctx.restore();
            }

            update() {
                // 1. Mouse Interaction (Repel)
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MOUSE_RADIUS) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;

                    // Push away strongly
                    this.vx -= forceDirectionX * force * REPEL_FORCE * 0.5;
                    this.vy -= forceDirectionY * force * REPEL_FORCE * 0.5;
                }

                // 2. Constant Antigravity Float (Upward)
                // We apply a gentle upward force constantly to counteract gravity
                this.vy -= 0.01;

                // Speed limit
                const maxSpeed = 2;
                if (this.vx > maxSpeed) this.vx = maxSpeed;
                if (this.vx < -maxSpeed) this.vx = -maxSpeed;
                if (this.vy > maxSpeed) this.vy = maxSpeed;
                if (this.vy < -maxSpeed) this.vy = -maxSpeed;

                // Friction (Air resistance)
                this.vx *= 0.96;
                this.vy *= 0.96;

                // Update Position
                this.x += this.vx;
                this.y += this.vy;
                this.angle += this.spinSpeed;

                // 3. Screen Wrap (Infinite Loop)
                // If it floats off the top, reset to bottom
                if (this.y < -50) {
                    this.y = height + 50;
                    this.x = Math.random() * width;
                }
                // If it goes off sides
                if (this.x > width + 50) this.x = -50;
                if (this.x < -50) this.x = width + 50;

                this.draw();
            }
        }

        let particles: Particle[] = [];

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                particles.push(new Particle(x, y));
            }
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => p.update());
            requestAnimationFrame(animate);
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        handleResize();
        initParticles(); // Ensure particles are created immediately
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 h-full w-full bg-brand-cream pointer-events-none"
        />
    );
}