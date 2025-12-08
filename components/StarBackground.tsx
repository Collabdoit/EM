"use client";

import { useEffect, useRef } from 'react';

// Star logic outside component to satisfy linter
class Star {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    brightness: number;
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.brightness = Math.random();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x < 0) this.x = this.width;
        if (this.x > this.width) this.x = 0;
        if (this.y < 0) this.y = this.height;
        if (this.y > this.height) this.y = 0;

        // Twinkle effect
        this.brightness += (Math.random() - 0.5) * 0.05;
        if (this.brightness < 0) this.brightness = 0;
        if (this.brightness > 1) this.brightness = 1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default function StarBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Interaction tracking
        let mouseX = -1000;
        let mouseY = -1000;

        // Gyroscope tracking
        let tiltX = 0;
        let tiltY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.beta !== null && e.gamma !== null) {
                // beta: x-axis (-180 to 180), gamma: y-axis (-90 to 90)
                // Normalize somewhat
                tiltX = e.gamma * 2; // exaggerated movement
                tiltY = e.beta * 2;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('deviceorientation', handleOrientation);

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            stars = [];
            const starCount = Math.floor((width * height) / 6000);

            for (let i = 0; i < starCount; i++) {
                stars.push(new Star(width, height));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw Stars
            stars.forEach(star => {
                star.update();

                // Apply Gyroscope Offset for 3D/Parallax feel
                // Calculate offset based on star depth (size/speed) 
                // Larger/faster stars move more
                const depth = star.size; // 0 to 2
                const offsetX = tiltX * depth;
                const offsetY = tiltY * depth;

                // Save context to apply transform
                ctx.save();
                ctx.translate(offsetX, offsetY);
                star.draw(ctx);
                ctx.restore();

                // Connect to mouse if close (Desktop fallback/enhancement)
                // Adjust mouse tracking for parallax? Maybe too complex, keep simple for lines
                const dx = mouseX - star.x;
                const dy = mouseY - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(212, 175, 55, ${1 - distance / 150})`; // Gold connections
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(star.x + offsetX, star.y + offsetY); // Connect visible positions
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleOrientation);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)' }}
        />
    );
}
