import { useRef, useEffect, useState } from 'react';

interface ScrollPickerProps {
    items: string[] | number[];
    value: string | number;
    onChange: (value: string | number) => void;
    label?: string;
}

export default function ScrollPicker({ items, value, onChange, label }: ScrollPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemHeight = 60; // Increased touch target

    useEffect(() => {
        if (containerRef.current) {
            const index = items.indexOf(value as never);
            if (index !== -1) {
                containerRef.current.scrollTop = index * itemHeight;
            }
        }
    }, []);

    const handleScroll = () => {
        if (containerRef.current) {
            const scrollTop = containerRef.current.scrollTop;
            const index = Math.round(scrollTop / itemHeight);
            if (items[index] !== undefined && items[index] !== value) {
                // Determine if we are "close enough" to snap and trigger change
                // For smoother performance, you might debounce this in a real large app
                if (items[index] !== value) {
                    // Using a timeout to wait for scroll to settle slightly effectively
                    // But for direct feedback we can just set it
                    onChange(items[index]);
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full" dir="ltr">
            {label && <span className="mb-2 text-sm text-[#5671ff] uppercase tracking-widest font-bold font-body">{label}</span>}
            <div
                className="relative w-full max-w-[120px] bg-transparent"
                style={{
                    height: '180px',
                    maxHeight: '180px',
                    overflow: 'hidden',
                    maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
                }}
            >
                {/* Selection Highlight / Overlay */}
                <div className="absolute top-[60px] left-0 right-0 h-[60px] border-t-2 border-b-2 border-[#5671ff]/50 bg-[#5671ff]/10 pointer-events-none z-10 rounded-lg"></div>

                {/* Scroll Container */}
                <div
                    ref={containerRef}
                    className="h-full w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
                    style={{ height: '180px', overflowY: 'auto' }}
                    onScroll={handleScroll}
                >
                    {/* Padding to center first/last items */}
                    <div style={{ minHeight: '60px', height: '60px' }}></div>

                    {items.map((item, i) => (
                        <div
                            key={`${item}-${i}`}
                            className={`h-[60px] min-h-[60px] flex items-center justify-center snap-center transition-all duration-200 cursor-pointer ${item === value ? 'text-white font-bold scale-110 text-xl' : 'text-gray-500 scale-90 text-lg'} select-none`}
                            onClick={() => {
                                if (containerRef.current) {
                                    containerRef.current.scrollTo({
                                        top: i * 60,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                        >
                            {item}
                        </div>
                    ))}

                    <div style={{ minHeight: '60px', height: '60px' }}></div>
                </div>
            </div>
        </div>
    );
}
