import { useRef, useEffect, useState } from 'react';

interface ScrollPickerProps {
    items: string[] | number[];
    value: string | number;
    onChange: (value: string | number) => void;
    label?: string;
}

export default function ScrollPicker({ items, value, onChange, label }: ScrollPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemHeight = 50;

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
        <div className="flex flex-col items-center">
            {label && <span className="mb-2 text-sm text-gray-500 uppercase tracking-widest">{label}</span>}
            <div className="relative h-[150px] w-full max-w-[100px] overflow-hidden">
                {/* Selection Highlight / Overlay */}
                <div className="absolute top-[50px] left-0 right-0 h-[50px] border-t border-b border-indigo-500/30 bg-indigo-500/10 pointer-events-none z-10"></div>

                {/* Scroll Container */}
                <div
                    ref={containerRef}
                    className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={handleScroll}
                >
                    {/* Padding top/bottom to allow first/last item to reach center */}
                    <div style={{ height: '50px' }}></div>

                    {items.map((item) => (
                        <div
                            key={item}
                            className={`h-[50px] flex items-center justify-center snap-center transition-all duration-200 ${item === value ? 'text-white font-bold scale-110' : 'text-gray-500 scale-90'}`}
                        >
                            {item}
                        </div>
                    ))}

                    <div style={{ height: '50px' }}></div>
                </div>
            </div>
        </div>
    );
}
