"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, MapPin, ArrowLeft, Loader2, Sparkles, User, Calendar, Clock } from 'lucide-react';
import ScrollPicker from './ScrollPicker';

type Step = 'gender' | 'name' | 'birth' | 'time' | 'city' | 'upload' | 'processing';

export default function AnalysisForm() {
    // State
    const [wizardStep, setWizardStep] = useState(0); // Index for simplified flow logic
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form Data
    const [gender, setGender] = useState('female');
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [palmImage, setPalmImage] = useState<string | null>(null);

    // Date Picker State
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const [birthDay, setBirthDay] = useState(15);
    const [birthMonth, setBirthMonth] = useState('يونيو');
    const [birthYear, setBirthYear] = useState(1995);

    // Time Picker State
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];

    const [birthHour, setBirthHour] = useState(9);
    const [birthMinute, setBirthMinute] = useState('00');
    const [birthPeriod, setBirthPeriod] = useState('AM');
    const [unknownTime, setUnknownTime] = useState(false);

    // Processing State
    const [processingStage, setProcessingStage] = useState(0);
    const stages = [
        "جاري تحليل الخريطة الفلكية...",
        "تحديد مواقع الكواكب...",
        "قراءة خطوط اليد...",
        "تم تجهيز تقريرك!"
    ];

    // Haptics
    const vibrate = (pattern: number | number[] = 50) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
    };

    // Navigation
    const nextStep = () => {
        vibrate();
        setWizardStep(prev => prev + 1);
    };

    const prevStep = () => {
        vibrate(30);
        setWizardStep(prev => prev - 1);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPalmImage(reader.result as string);
                vibrate([30, 30]);
            };
            reader.readAsDataURL(file);
        }
    };

    const startProcessing = () => {
        setWizardStep(6); // To Processing
        vibrate(100);
        let current = 0;
        const interval = setInterval(() => {
            current++;
            setProcessingStage(current);
            vibrate(20);
            if (current >= stages.length) {
                clearInterval(interval);
                finalizeAnalysis();
            }
        }, 1500);
    };

    const finalizeAnalysis = () => {
        vibrate([50, 100]);
        // Construct final data
        const monthIndex = months.indexOf(birthMonth) + 1;
        const finalDate = `${birthYear}-${monthIndex.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
        const finalTime = unknownTime ? '12:00' : `${birthHour}:${birthMinute} ${birthPeriod}`;

        const data = {
            name,
            gender,
            birthDate: finalDate,
            birthTime: finalTime,
            birthCity: city,
            palmImage,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('userAnalysisData', JSON.stringify(data));
        router.push('/analysis/preview');
    };

    // Render Steps
    // 0: Gender, 1: Name, 2: BirthDate, 3: BirthTime, 4: Place, 5: Upload, 6: Processing

    return (
        <div className="w-full h-[100dvh] flex flex-col items-center justify-center relative text-center overflow-hidden">

            {/* Header / Progress */}
            {wizardStep < 6 && (
                <div className="absolute top-8 w-full px-6 flex justify-between items-center text-gray-500 z-50 px-4 md:px-8">
                    <button onClick={prevStep} className={`p-4 ${wizardStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
                        <ArrowLeft className="w-8 h-8 rotate-180 text-white" />
                    </button>
                    <span className="font-heading font-bold text-xl tracking-widest text-[#5671ff]">{wizardStep + 1} / 6</span>
                    <div className="w-12"></div> {/* Spacer to balance Back button */}
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-md px-6 flex flex-col justify-center items-center wizard-step-container animate-wizard-enter z-40" key={wizardStep}>

                {/* STEP 0: GENDER */}
                {wizardStep === 0 && (
                    <div className="w-full space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-heading text-white leading-tight">ما هو جنسك؟</h1>
                            <p className="text-gray-400 text-lg">لتحليل الطاقة الأنثوية والذكورية</p>
                        </div>

                        <div className="flex flex-col gap-6 w-full px-2">
                            <button
                                onClick={() => { setGender('female'); nextStep(); }}
                                className="group w-full py-8 md:py-10 rounded-3xl bg-[#1F2937]/80 backdrop-blur-md border border-white/10 hover:border-[#5671ff] hover:bg-[#5671ff]/10 active:scale-95 transition-all duration-300 flex items-center justify-between px-8 md:px-12"
                            >
                                <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#5671ff] transition-colors">أنثى</span>
                                <span className="text-4xl md:text-5xl">♀</span>
                            </button>
                            <button
                                onClick={() => { setGender('male'); nextStep(); }}
                                className="group w-full py-8 md:py-10 rounded-3xl bg-[#1F2937]/80 backdrop-blur-md border border-white/10 hover:border-[#5671ff] hover:bg-[#5671ff]/10 active:scale-95 transition-all duration-300 flex items-center justify-between px-8 md:px-12"
                            >
                                <span className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#5671ff] transition-colors">ذكر</span>
                                <span className="text-4xl md:text-5xl">♂</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1: NAME */}
                {wizardStep === 1 && (
                    <div className="w-full space-y-12">
                        <h1 className="text-4xl md:text-5xl font-heading text-white">اسمك الكامل</h1>
                        <div className="relative w-full">
                            <input
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-magical text-3xl md:text-4xl py-4"
                                placeholder="اكتب اسمك..."
                            />
                        </div>
                        <button
                            disabled={name.length < 2}
                            onClick={nextStep}
                            className="btn-primary w-full py-4 text-xl mt-12 disabled:opacity-50 disabled:scale-100 shadow-[0_4px_20px_rgba(86,113,255,0.4)]"
                        >
                            استمرار
                        </button>
                    </div>
                )}

                {/* STEP 2: DATE OF BIRTH */}
                {wizardStep === 2 && (
                    <div className="w-full space-y-10">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-heading text-white">تاريخ الميلاد</h1>
                            <p className="text-gray-400">نستخدم هذا لتحديد مواقع النجوم</p>
                        </div>

                        <div className="flex justify-center gap-1 md:gap-4 w-full">
                            <div className="flex-1 min-w-0 bg-[#1F2937]/50 rounded-2xl p-1 md:p-2 backdrop-blur-sm border border-white/5">
                                <ScrollPicker items={days} value={birthDay} onChange={(v) => setBirthDay(v as number)} label="اليوم" />
                            </div>
                            <div className="flex-[1.5] min-w-0 bg-[#1F2937]/50 rounded-2xl p-1 md:p-2 backdrop-blur-sm border border-white/5">
                                <ScrollPicker items={months} value={birthMonth} onChange={(v) => setBirthMonth(v as string)} label="الشهر" />
                            </div>
                            <div className="flex-1 min-w-0 bg-[#1F2937]/50 rounded-2xl p-1 md:p-2 backdrop-blur-sm border border-white/5">
                                <ScrollPicker items={years} value={birthYear} onChange={(v) => setBirthYear(v as number)} label="السنة" />
                            </div>
                        </div>

                        <button onClick={nextStep} className="btn-primary w-full py-4 text-xl mt-8 shadow-[0_4px_20px_rgba(86,113,255,0.4)]">
                            استمرار
                        </button>
                    </div>
                )}

                {/* STEP 3: TIME OF BIRTH */}
                {wizardStep === 3 && (
                    <div className="w-full space-y-10">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-heading text-white">وقت الولادة</h1>
                            <p className="text-gray-400">الدقة مهمة جداً للطالع</p>
                        </div>

                        {!unknownTime ? (
                            <div className="flex justify-center gap-2 w-full">
                                <div className="flex-1 bg-[#1F2937]/50 rounded-2xl p-2 backdrop-blur-sm border border-white/5">
                                    <ScrollPicker items={hours} value={birthHour} onChange={(v) => setBirthHour(v as number)} label="ساعة" />
                                </div>
                                <div className="flex-1 bg-[#1F2937]/50 rounded-2xl p-2 backdrop-blur-sm border border-white/5">
                                    <ScrollPicker items={minutes} value={birthMinute} onChange={(v) => setBirthMinute(v as string)} label="دقيقة" />
                                </div>
                                <div className="flex-1 bg-[#1F2937]/50 rounded-2xl p-2 backdrop-blur-sm border border-white/5">
                                    <ScrollPicker items={periods} value={birthPeriod} onChange={(v) => setBirthPeriod(v as string)} label="م/ص" />
                                </div>
                            </div>
                        ) : (
                            <div className="h-[200px] w-full flex items-center justify-center text-gray-400 italic border-2 border-dashed border-gray-700 rounded-3xl bg-black/20 text-lg">
                                وقت غير معروف (12:00 م)
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-4 mt-6 p-4 rounded-xl bg-white/5 w-full cursor-pointer" onClick={() => setUnknownTime(!unknownTime)}>
                            <input
                                type="checkbox"
                                id="unknownTime"
                                checked={unknownTime}
                                readOnly
                                className="w-6 h-6 rounded border-gray-500 text-indigo-500 focus:ring-indigo-500"
                            />
                            <label htmlFor="unknownTime" className="text-lg text-gray-200 pointer-events-none">لا أعرف وقت ولادتي بدقة</label>
                        </div>

                        <button onClick={nextStep} className="btn-primary w-full py-4 text-xl mt-4 shadow-[0_4px_20px_rgba(86,113,255,0.4)]">
                            استمرار
                        </button>
                    </div>
                )}

                {/* STEP 4: PLACE */}
                {wizardStep === 4 && (
                    <div className="w-full space-y-12">
                        <h1 className="text-4xl md:text-5xl font-heading text-white">مكان الولادة</h1>
                        <div className="relative w-full">
                            <MapPin className="absolute top-1/2 -translate-y-1/2 left-4 text-[#5671ff] w-8 h-8" />
                            <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="input-magical text-3xl md:text-4xl py-6 pl-16"
                                placeholder="المدينة، الدولة"
                            />
                        </div>
                        <button
                            disabled={city.length < 2}
                            onClick={nextStep}
                            className="btn-primary w-full py-4 text-xl mt-12 disabled:opacity-50 shadow-[0_4px_20px_rgba(86,113,255,0.4)]"
                        >
                            تحليل الخريطة
                        </button>
                    </div>
                )}

                {/* STEP 5: UPLOAD PALM */}
                {wizardStep === 5 && (
                    <div className="w-full space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-heading text-white">صورة الكف</h1>
                            <p className="text-gray-400">لدمج قراءة الكف مع الخريطة الفلكية</p>
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-[#1F2937]/80 hover:bg-[#374151] transition-colors border-2 border-dashed border-gray-600 hover:border-[#5671ff] rounded-[2rem] h-80 w-full flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group shadow-2xl"
                        >
                            {palmImage ? (
                                <img src={palmImage} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <>
                                    <div className="w-24 h-24 bg-[#5671ff]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-[#5671ff]/20">
                                        <Upload className="w-10 h-10 text-[#5671ff]" />
                                    </div>
                                    <span className="text-white text-xl font-bold mb-2">اضغط لرفع صورة</span>
                                    <span className="text-sm text-gray-500">أو اسحب وأفلت هنا</span>
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

                        <button
                            disabled={!palmImage}
                            onClick={startProcessing}
                            className="btn-primary w-full py-4 text-xl mt-6 disabled:opacity-50 shadow-[0_4px_20px_rgba(86,113,255,0.4)]"
                        >
                            بدء التحليل الشامل
                        </button>
                    </div>
                )}

                {/* STEP 6: PROCESSING */}
                {wizardStep === 6 && (
                    <div className="w-full space-y-12 flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#5671ff] blur-3xl opacity-30 animate-pulse"></div>
                            <div className="w-40 h-40 border-4 border-t-[#5671ff] border-white/5 rounded-full animate-spin mx-auto"></div>
                            <Sparkles className="absolute inset-0 w-12 h-12 text-[#5671ff] m-auto animate-bounce" />
                        </div>

                        <h2 className="text-3xl font-heading text-white animate-pulse mt-8">
                            {stages[Math.min(processingStage, stages.length - 1)]}
                        </h2>

                        <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden mt-8 max-w-sm border border-white/5">
                            <div
                                className="h-full bg-[#5671ff] transition-all duration-300 shadow-[0_0_10px_#5671ff]"
                                style={{ width: `${((Math.min(processingStage, stages.length - 1) + 1) / stages.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
