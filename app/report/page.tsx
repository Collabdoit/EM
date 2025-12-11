"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Map, Star, Download, Share2, Sparkles, Check } from 'lucide-react';
import { calculateAstroMap, AstroLocation } from '@/lib/astro-logic';
import { analyzePalmImage, PalmAnalysisResult } from '@/lib/palm-analysis';

export default function ReportPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [locations, setLocations] = useState<AstroLocation[]>([]);
    const [palmAnalysis, setPalmAnalysis] = useState<PalmAnalysisResult | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('userAnalysisData');
        if (saved) {
            const parsed = JSON.parse(saved);
            setData(parsed);

            // Re-run or persist analysis. For MVP just re-run deterministic mocks
            setLocations(calculateAstroMap(parsed.birthDate, parsed.birthTime, parsed.birthCity));
            analyzePalmImage(parsed.palmImage).then(setPalmAnalysis);
        } else {
            router.push('/');
        }
    }, [router]);

    if (!data || !palmAnalysis) return (
        <div className="min-h-screen flex items-center justify-center text-gold">
            جاري بناء تقريرك النهائي...
        </div>
    );

    return (
        <main className="min-h-screen py-10 px-4">
            <div className="container max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <header className="text-center space-y-4 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl -z-10"></div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-600">
                        تقرير القدر والشخصية
                    </h1>
                    <p className="text-gray-400">تحليل شامل خاص بـ {data.name}</p>
                    <div className="flex justify-center gap-4 pt-4">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-full hover:bg-white/5 transition-colors text-sm">
                            <Download className="w-4 h-4" />
                            تحميل PDF
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-full hover:bg-white/5 transition-colors text-sm">
                            <Share2 className="w-4 h-4" />
                            مشاركة
                        </button>
                    </div>
                </header>

                {/* Section 1: Astro Cartography */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Map className="w-6 h-6 text-gold" />
                        </div>
                        <h2 className="text-2xl font-bold">خريطتك الفلكية الجغرافية</h2>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Map View */}
                        <div className="lg:col-span-2 h-[400px] bg-slate-900 rounded-2xl overflow-hidden relative border border-gray-800">
                            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] opacity-30 bg-center bg-cover grayscale hover:grayscale-0 transition-all duration-1000"></div>

                            {locations.map((loc, i) => (
                                <div key={i} className="absolute group cursor-pointer"
                                    style={{ top: `${(loc.coordinates.lat + 90) / 1.8}%`, left: `${(loc.coordinates.lng + 180) / 3.6}%` }}>
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.6)] animate-pulse"></div>
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-yellow-500/30">
                                        {loc.city}
                                    </div>
                                </div>
                            ))}

                            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-4 py-2 rounded-lg text-xs text-gray-300 border border-white/10">
                                تم تحليل 4 مواقع رئيسية
                            </div>
                        </div>

                        {/* Locations List */}
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {locations.map((loc, i) => (
                                <div key={i} className="glass-panel p-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg group-hover:text-gold transition-colors">{loc.city}</h3>
                                        <span className="text-xs bg-white/10 px-2 py-1 rounded">{loc.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-yellow-500 text-sm mb-2">
                                        <Sparkles className="w-3 h-3" />
                                        <span>خطوط: {loc.lines.join(" + ")}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">{loc.benefit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 2: Palm Reading */}
                <section className="space-y-6 pt-10 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Star className="w-6 h-6 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold">تحليل شخصية الكف</h2>
                    </div>

                    <div className="glass-panel p-8 grid md:grid-cols-2 gap-10 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-2xl"></div>
                            <img src={data.palmImage} alt="Your Palm" className="rounded-2xl w-full object-cover shadow-2xl border border-white/5" />

                            {/* Detailed Analysis Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-full h-full relative">
                                    {/* Mock Lines overlay */}
                                    <svg className="absolute inset-0 w-full h-full stroke-purple-400 stroke-2 fill-none opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <path d="M 20,80 Q 40,50 60,30" />
                                        <path d="M 25,75 Q 50,60 80,60" />
                                        <path d="M 30,60 Q 50,40 70,20" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-purple-400">الملخص العام</h3>
                                <p className="text-gray-300 leading-relaxed border-r-2 border-purple-500 pr-4">
                                    {palmAnalysis.summary}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[palmAnalysis.heartLine, palmAnalysis.headLine, palmAnalysis.lifeLine].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="mt-1">
                                            <Check className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.line}</h4>
                                            <p className="text-sm text-gray-400">{item.meaning} ({item.quality})</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Closing */}
                <div className="text-center pt-10 pb-20 text-gray-500">
                    <p>تم إنشاء هذا التقرير بتاريخ {new Date().toLocaleDateString('ar-SA')}</p>
                </div>

            </div>
        </main>
    );
}
