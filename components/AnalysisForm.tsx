"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Calendar, MapPin, User, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

type Step = 'input' | 'upload' | 'processing';

export default function AnalysisForm() {
    const [step, setStep] = useState<Step>('input');
    const [formData, setFormData] = useState({
        name: '',
        gender: 'female',
        birthDate: '',
        birthTime: '',
        birthCity: ''
    });
    const [palmImage, setPalmImage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPalmImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitInput = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('upload');
    };

    const [processingStage, setProcessingStage] = useState(0);
    const stages = [
        "جاري محاذاة الخرائط الفلكية...",
        "تحليل خطوط اليد بالذكاء الاصطناعي...",
        "ربط الطاقات الكونية...",
        "تم اكتشاف المسار!"
    ];

    const router = useRouter();

    const handleStartAnalysis = () => {
        setStep('processing');

        // Haptic feedback start
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Sequence of "Fake" Analysis Stages
        let currentStage = 0;
        const interval = setInterval(() => {
            currentStage++;
            setProcessingStage(currentStage);

            // Haptic on stage change
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(30);
            }

            if (currentStage >= stages.length) {
                clearInterval(interval);
                finalizeAnalysis();
            }
        }, 1200);
    };

    const finalizeAnalysis = () => {
        // Success haptic
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }

        // Save to local storage for the preview page
        const dataToSave = {
            ...formData,
            palmImage,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('userAnalysisData', JSON.stringify(dataToSave));

        router.push('/analysis/preview');
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Progress Steps */}
            {step !== 'processing' && (
                <div className="flex items-center justify-between mb-8 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 transition-colors duration-300`}
                        style={{
                            background: 'var(--gradient-gold)',
                            color: 'var(--bg-deep)'
                        }}>
                        1
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-gray-800 rounded-full overflow-hidden absolute w-full left-0 -z-0">
                        <div className="h-full bg-yellow-500 transition-all duration-700"
                            style={{
                                width: step === 'input' ? '50%' : '100%',
                                background: 'var(--primary-gold)'
                            }}></div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 transition-colors duration-300`}
                        style={{
                            background: step !== 'input' ? 'var(--gradient-gold)' : 'var(--bg-card)',
                            color: step !== 'input' ? 'var(--bg-deep)' : 'var(--text-muted)'
                        }}>
                        2
                    </div>
                </div>
            )}

            <div className="glass-panel p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-center">

                {step === 'input' && (
                    <form onSubmit={handleSubmitInput} className="space-y-6 fade-in w-full">
                        <h2 className="text-2xl font-bold text-center mb-6 text-gold">بيانات الخريطة الفلكية</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">الاسم الكامل</label>
                                <div className="relative">
                                    <User className="absolute right-3 top-3 text-gold w-5 h-5" />
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        type="text"
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pr-10 pl-4 focus:border-yellow-500 focus:outline-none transition-colors text-white"
                                        placeholder="الاسم"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">تاريخ الميلاد</label>
                                    <input
                                        required
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        type="date"
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 px-4 focus:border-yellow-500 focus:outline-none transition-colors text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">وقت الولادة</label>
                                    <input
                                        required
                                        name="birthTime"
                                        value={formData.birthTime}
                                        onChange={handleInputChange}
                                        type="time"
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 px-4 focus:border-yellow-500 focus:outline-none transition-colors text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">مكان الولادة</label>
                                <div className="relative">
                                    <MapPin className="absolute right-3 top-3 text-gold w-5 h-5" />
                                    <input
                                        required
                                        name="birthCity"
                                        value={formData.birthCity}
                                        onChange={handleInputChange}
                                        type="text"
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pr-10 pl-4 focus:border-yellow-500 focus:outline-none transition-colors text-white"
                                        placeholder="مثال: الرياض، السعودية"
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2 mt-6">
                            التالي
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </form>
                )}

                {step === 'upload' && (
                    <div className="space-y-6 fade-in text-center w-full">
                        <h2 className="text-2xl font-bold mb-2 text-gold">تحليل الكف بالذكاء الاصطناعي</h2>
                        <p className="text-gray-400 text-sm mb-6">قم برفع صورة واضحة ليدك للحصول على أدق النتائج</p>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-700 rounded-2xl p-10 cursor-pointer hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center"
                        >
                            {palmImage ? (
                                <img src={palmImage} alt="Palm Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-gold" />
                                    </div>
                                    <p className="text-gray-300 font-medium">اضغط لرفع صورة</p>
                                    <p className="text-gray-500 text-sm mt-2">أو التقط صورة مباشرة</p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setStep('input')}
                                className="flex-1 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                رجوع
                            </button>
                            <button
                                disabled={!palmImage}
                                onClick={handleStartAnalysis}
                                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                تحليل الآن
                            </button>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center text-center fade-in w-full h-full">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-gold blur-3xl opacity-30 animate-pulse"></div>
                            {/* Custom animated loader */}
                            <div className="w-24 h-24 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-gold animate-bounce" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-white animate-pulse">
                            {stages[Math.min(processingStage, stages.length - 1)]}
                        </h3>

                        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mt-4">
                            <div
                                className="h-full bg-gold transition-all duration-300"
                                style={{
                                    width: `${((Math.min(processingStage, stages.length - 1) + 1) / stages.length) * 100}%`,
                                    background: 'var(--primary-gold)'
                                }}
                            ></div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
