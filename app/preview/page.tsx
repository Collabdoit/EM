"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Map, Star, ArrowLeft } from 'lucide-react';
import { calculateAstroMap, AstroLocation } from '@/lib/astro-logic';
import { analyzePalmImage, PalmAnalysisResult } from '@/lib/palm-analysis';

export default function PreviewPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [locations, setLocations] = useState<AstroLocation[]>([]);
    const [palmAnalysis, setPalmAnalysis] = useState<PalmAnalysisResult | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('userAnalysisData');
        if (saved) {
            const parsed = JSON.parse(saved);
            setData(parsed);

            // Run Mock Analysis
            setLocations(calculateAstroMap(parsed.birthDate, parsed.birthTime, parsed.birthCity));
            analyzePalmImage(parsed.palmImage).then(setPalmAnalysis);
        } else {
            router.push('/');
        }
    }, [router]);

    if (!data || !palmAnalysis) return (
        <div className="min-h-screen flex items-center justify-center text-gold">
            جاري تحضير تقريرك...
        </div>
    );

    return (
        <main className="min-h-screen py-10 px-4">
            <div className="container max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <header className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                        أهلاً {data.name}، اكتشافاتك جاهزة
                    </h1>
                    <p className="text-gray-400">لقد قمنا بتحليل خريطتك الفلكية وخطوط كفك. إليك لمحة عما وجدناه.</p>
                </header>

                {/* Teaser 1: Astro Map (Blurred) */}
                <section className="glass-panel p-6 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gold flex items-center gap-2">
                            <Map className="w-5 h-5" />
                            أماكن القوة الخاصة بك
                        </h2>
                        <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">نسخة أولية</span>
                    </div>

                    <div className="relative h-64 bg-slate-900 rounded-xl overflow-hidden mb-4">
                        {/* Fake Map Background */}
                        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] opacity-20 bg-center bg-cover"></div>

                        {/* Blurred Overlay */}
                        <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center bg-black/40 z-10">
                            <div className="text-center">
                                <Lock className="w-10 h-10 text-gold mx-auto mb-2" />
                                <p className="text-white font-bold">الخريطة الكاملة مقفلة</p>
                            </div>
                        </div>

                        {/* Teaser Dots */}
                        {locations.slice(0, 2).map((loc, i) => (
                            <div key={i} className="absolute w-4 h-4 bg-yellow-500 rounded-full animate-pulse z-0"
                                style={{ top: `${(loc.coordinates.lat + 90) / 1.8}%`, left: `${(loc.coordinates.lng + 180) / 3.6}%` }}>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg border-r-4 border-yellow-500">
                        <p className="text-sm text-gray-300">
                            وجدنا <strong>{locations.length} مدن</strong> تؤثر بشكل إيجابي على مسارك المهني والعاطفي.
                            واحدة منهم هي <span className="text-gold font-bold">{locations[0].city}</span>!
                        </p>
                    </div>
                </section>

                {/* Teaser 2: Palm Reading (Partial) */}
                <section className="glass-panel p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gold flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            تحليل شخصية الكف
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative rounded-xl overflow-hidden border border-gray-700 h-64">
                            <img src={data.palmImage} alt="Your Palm" className="w-full h-full object-cover opacity-60" />
                            {/* Overlay Lines Drawing SVG - Simplified Mock */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-yellow-500 stroke-2 fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M 20,80 Q 40,50 60,30" className="drop-shadow-glow animate-draw" />
                                <path d="M 25,75 Q 50,60 80,60" className="drop-shadow-glow animate-draw delay-100" />
                                <path d="M 30,60 Q 50,40 70,20" className="drop-shadow-glow animate-draw delay-200" />
                            </svg>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/5 p-3 rounded-lg">
                                <h4 className="text-gold font-bold text-sm mb-1">{palmAnalysis.heartLine.line}</h4>
                                <p className="text-xs text-gray-400">{palmAnalysis.heartLine.meaning}</p>
                            </div>
                            {/* BLURRED INSIGHTS */}
                            <div className="bg-white/5 p-3 rounded-lg relative overflow-hidden">
                                <h4 className="text-gray-500 font-bold text-sm mb-1">خط الحياة والمصير</h4>
                                <p className="text-xs text-gray-400 blur-sm select-none">هذا النص غير متاح في النسخة المجانية. قم بالترقية لرؤية التحليل الكامل لمستقبلك</p>
                                <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg relative overflow-hidden">
                                <h4 className="text-gray-500 font-bold text-sm mb-1">نقاط القوة الخفية</h4>
                                <p className="text-xs text-gray-400 blur-sm select-none">هذا النص غير متاح في النسخة المجانية. قم بالترقية لرؤية التحليل الكامل لمستقبلك</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="text-center pt-8 pb-20">
                    <button
                        onClick={() => router.push('/payment')}
                        className="btn-primary w-full max-w-md mx-auto text-lg animate-bounce-slow"
                    >
                        افتح التقرير الكامل الآن
                        <span className="block text-sm font-normal opacity-80 mt-1"> 49 ر.س فقط - لمرة واحدة</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-4">ضمان استرداد الأموال لمدة 14 يوم</p>
                </div>

            </div>
        </main>
    );
}
