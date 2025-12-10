"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Calendar, MapPin, User, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

type Step = 'input' | 'upload' | 'processing';

export default function AnalysisForm() {
    const [wizardStep, setWizardStep] = useState(0); // 0: Intro, 1: Name, 2: BirthDate, 3: BirthTime, 4: City, 5: Upload, 6: Processing

    // Form Data State
    const [formData, setFormData] = useState({
        name: '',
        gender: 'female',
        birthDate: '',
        birthTime: '',
        birthCity: ''
    });
    const [palmImage, setPalmImage] = useState<string | null>(null);

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Haptics Helper
    const vibrate = (pattern: number | number[]) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    const nextStep = () => {
        vibrate(50);
        setWizardStep(prev => prev + 1);
    };

    const prevStep = () => {
        vibrate(30);
        setWizardStep(prev => prev - 1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPalmImage(reader.result as string);
                vibrate([30, 30]); // Double tap confirm
            };
            reader.readAsDataURL(file);
        }
    };

    // Processing Logic
    const [processingStage, setProcessingStage] = useState(0);
    const stages = [
        "جاري محاذاة الخرائط الفلكية...",
        "تحليل خطوط اليد بالذكاء الاصطناعي...",
        "ربط الطاقات الكونية...",
        "تم اكتشاف المسار!"
    ];

    const startProcessing = () => {
        setWizardStep(6);
        vibrate(100);

        let currentStage = 0;
        const interval = setInterval(() => {
            currentStage++;
            setProcessingStage(currentStage);
            vibrate(20);

            if (currentStage >= stages.length) {
                clearInterval(interval);
                finalizeAnalysis();
            }
        }, 1200);
    };

    const finalizeAnalysis = () => {
        vibrate([50, 50, 100]);
        const dataToSave = {
            ...formData,
            palmImage,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('userAnalysisData', JSON.stringify(dataToSave));
        router.push('/analysis/preview');
    };

    // Render Helpers
    const isStepValid = () => {
        switch (wizardStep) {
            case 1: return formData.name.length > 2;
            case 2: return formData.birthDate !== '';
            case 3: return formData.birthTime !== '';
            case 4: return formData.birthCity.length > 2;
            case 5: return palmImage !== null;
            default: return true;
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center text-center relative z-20">

            {/* Progress Dots (Constellation style) */}
            {wizardStep > 0 && wizardStep < 6 && (
                <div className="absolute top-10 flex gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-3 h-3 rounded-full transition-all duration-500 ${i <= wizardStep ? 'bg-gold shadow-[0_0_10px_#D4AF37]' : 'bg-white/10'}`} />
                    ))}
                </div>
            )}

            {/* WIZARD CONTENT */}
            <div className="w-full max-w-md px-6 wizard-step-container animate-wizard-enter" key={wizardStep}>

                {/* 0. INTRO */}
                {wizardStep === 0 && (
                    <div className="space-y-8">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-gold blur-3xl opacity-20 animate-pulse"></div>
                            <Sparkles className="w-20 h-20 text-gold mx-auto relative z-10 animate-bounce-slow" />
                        </div>
                        <h1 className="text-4xl font-bold text-white leading-tight">
                            رحلتك الكونية <br />
                            <span className="text-gold">تبدأ الآن</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            دعنا نكتشف أسرار خريطتك الفلكية ومصيرك المكتوب.
                        </p>
                        <button onClick={nextStep} className="btn-primary w-full mt-8">
                            ابدأ الرحلة
                        </button>
                    </div>
                )}

                {/* 1. NAME */}
                {wizardStep === 1 && (
                    <div className="space-y-8 w-full">
                        <h2 className="text-3xl font-bold text-gold mb-2">ما هو اسمك الكوني؟</h2>
                        <input
                            autoFocus
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="input-magical"
                            placeholder="اكتب اسمك هنا..."
                            autoComplete="off"
                        />
                    </div>
                )}

                {/* 2. DATE */}
                {wizardStep === 2 && (
                    <div className="space-y-8 w-full">
                        <h2 className="text-3xl font-bold text-gold mb-2">متى هبطت إلى الأرض؟</h2>
                        <div className="relative">
                            <Calendar className="w-8 h-8 text-gold mx-auto mb-4" />
                            <input
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                type="date"
                                className="input-magical"
                            />
                        </div>
                    </div>
                )}

                {/* 3. TIME */}
                {wizardStep === 3 && (
                    <div className="space-y-8 w-full">
                        <h2 className="text-3xl font-bold text-gold mb-2">في أي ساعة وتجهت النجوم؟</h2>
                        <p className="text-gray-400 text-sm">الوقت الدقيق مهم جداً لدقة الحسابات</p>
                        <input
                            name="birthTime"
                            value={formData.birthTime}
                            onChange={handleInputChange}
                            type="time"
                            className="input-magical"
                        />
                    </div>
                )}

                {/* 4. CITY */}
                {wizardStep === 4 && (
                    <div className="space-y-8 w-full">
                        <h2 className="text-3xl font-bold text-gold mb-2">أين كانت بدايتك؟</h2>
                        <div className="relative">
                            <MapPin className="w-8 h-8 text-gold mx-auto mb-4" />
                            <input
                                name="birthCity"
                                value={formData.birthCity}
                                onChange={handleInputChange}
                                className="input-magical"
                                placeholder="المدينة، الدولة"
                            />
                        </div>
                    </div>
                )}

                {/* 5. UPLOAD */}
                {wizardStep === 5 && (
                    <div className="space-y-8 w-full">
                        <h2 className="text-3xl font-bold text-gold mb-2">اكشف عن خطوط قدرك</h2>
                        <p className="text-gray-400">صورة كفك تحمل مفاتيح شخصيتك</p>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-64 h-64 mx-auto border-2 border-dashed border-gold/30 rounded-full flex items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/10 transition-all overflow-hidden"
                        >
                            {palmImage ? (
                                <img src={palmImage} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Upload className="w-10 h-10 text-gold mx-auto mb-2" />
                                    <span className="text-sm text-gold">اضغط للرفع</span>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </div>
                )}

                {/* 6. PROCESSING */}
                {wizardStep === 6 && (
                    <div className="space-y-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gold blur-3xl opacity-30 animate-pulse"></div>
                            <div className="w-32 h-32 border-4 border-t-gold border-white/10 rounded-full animate-spin mx-auto"></div>
                            <Sparkles className="absolute inset-0 w-10 h-10 text-gold m-auto animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-bold text-white animate-pulse">
                            {stages[Math.min(processingStage, stages.length - 1)]}
                        </h2>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gold transition-all duration-300"
                                style={{ width: `${((Math.min(processingStage, stages.length - 1) + 1) / stages.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* NAVIGATION BUTTONS */}
                {wizardStep > 0 && wizardStep < 6 && (
                    <div className="fixed bottom-10 left-0 right-0 px-6 flex justify-between items-center max-w-md mx-auto">
                        <button
                            onClick={prevStep}
                            className="p-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 rotate-180" /> {/* Back arrow */}
                        </button>

                        <button
                            onClick={wizardStep === 5 ? startProcessing : nextStep}
                            disabled={!isStepValid()}
                            className="bg-gold text-black rounded-full p-4 shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:shadow-none transition-all hover:scale-110 active:scale-95"
                        >
                            {wizardStep === 5 ? <Sparkles className="w-8 h-8" /> : <ArrowLeft className="w-8 h-8" />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
