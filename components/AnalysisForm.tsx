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
        <div className="w-full min-h-screen flex flex-col items-center relative text-center">

            {/* Header / Progress */}
            {wizardStep < 6 && (
                <div className="absolute top-6 w-full px-6 flex justify-between items-center text-gray-500 z-50">
                    <button onClick={prevStep} className={wizardStep === 0 ? 'opacity-0' : ''}>
                        <ArrowLeft className="w-6 h-6 rotate-180" />
                    </button>
                    <span className="font-bold text-sm tracking-widest">{wizardStep + 1} / 6</span>
                    <div className="w-6"></div> {/* Spacer */}
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-md px-6 flex flex-col justify-center items-center wizard-step-container animate-wizard-enter" key={wizardStep}>

                {/* STEP 0: GENDER */}
                {wizardStep === 0 && (
                    <div className="w-full space-y-8">
                        <h1 className="text-3xl font-heading text-white">ما هو جنسك؟</h1>
                        <p className="text-gray-400">لتحليل الطاقة الأنثوية والذكورية</p>

                        <div className="space-y-4 w-full px-4">
                            <button
                                onClick={() => { setGender('female'); nextStep(); }}
                                className="w-full py-6 rounded-2xl bg-[#1F2937] border-2 border-transparent hover:border-indigo-500 active:bg-indigo-500/10 text-xl font-bold transition-all flex items-center justify-between px-8"
                            >
                                <span>أنثى</span>
                                <span className="text-2xl">♀</span>
                            </button>
                            <button
                                onClick={() => { setGender('male'); nextStep(); }}
                                className="w-full py-6 rounded-2xl bg-[#1F2937] border-2 border-transparent hover:border-indigo-500 active:bg-indigo-500/10 text-xl font-bold transition-all flex items-center justify-between px-8"
                            >
                                <span>ذكر</span>
                                <span className="text-2xl">♂</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1: NAME */}
                {wizardStep === 1 && (
                    <div className="w-full space-y-8">
                        <h1 className="text-3xl font-heading text-white">اسمك الكامل</h1>
                        <div className="relative w-full">
                            <input
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-magical"
                                placeholder="اكتب اسمك..."
                            />
                        </div>
                        <button
                            disabled={name.length < 2}
                            onClick={nextStep}
                            className="btn-primary w-full mt-8 disabled:opacity-50 disabled:scale-100"
                        >
                            استمرار
                        </button>
                    </div>
                )}

                {/* STEP 2: DATE OF BIRTH */}
                {wizardStep === 2 && (
                    <div className="w-full space-y-8">
                        <h1 className="text-3xl font-heading text-white">تاريخ الميلاد</h1>
                        <p className="text-gray-400">نستخدم هذا لتحديد مواقع النجوم</p>

                        <div className="flex justify-center gap-2 bg-[#1F2937]/50 rounded-3xl p-6 backdrop-blur-sm border border-white/5">
                            <ScrollPicker items={days} value={birthDay} onChange={(v) => setBirthDay(v as number)} label="اليوم" />
                            <ScrollPicker items={months} value={birthMonth} onChange={(v) => setBirthMonth(v as string)} label="الشهر" />
                            <ScrollPicker items={years} value={birthYear} onChange={(v) => setBirthYear(v as number)} label="السنة" />
                        </div>

                        <button onClick={nextStep} className="btn-primary w-full mt-4">
                            استمرار
                        </button>
                    </div>
                )}

                {/* STEP 3: TIME OF BIRTH */}
                {wizardStep === 3 && (
                    <div className="w-full space-y-8">
                        <h1 className="text-3xl font-heading text-white">وقت الولادة</h1>
                        <p className="text-gray-400">الدقة مهمة جداً للطالع</p>

                        {!unknownTime ? (
                            <div className="flex justify-center gap-2 bg-[#1F2937]/50 rounded-3xl p-6 backdrop-blur-sm border border-white/5">
                                <ScrollPicker items={hours} value={birthHour} onChange={(v) => setBirthHour(v as number)} label="ساعة" />
                                <ScrollPicker items={minutes} value={birthMinute} onChange={(v) => setBirthMinute(v as string)} label="دقيقة" />
                                <ScrollPicker items={periods} value={birthPeriod} onChange={(v) => setBirthPeriod(v as string)} label="م/ص" />
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-gray-500 italic border border-dashed border-gray-700 rounded-3xl">
                                وقت غير معروف (سيتم استخدام 12:00 م)
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-3 mt-2">
                            <input
                                type="checkbox"
                                id="unknownTime"
                                checked={unknownTime}
                                onChange={(e) => setUnknownTime(e.target.checked)}
                                className="w-5 h-5 accent-indigo-500 rounded"
                            />
                            <label htmlFor="unknownTime" className="text-sm text-gray-300">لا أعرف وقت ولادتي بدقة</label>
                        </div>

                        <button onClick={nextStep} className="btn-primary w-full mt-4">
                            استمرار
                        </button>
                    </div>
                )}

                {/* STEP 4: PLACE */}
                {wizardStep === 4 && (
                    <div className="w-full space-y-8">
                        <h1 className="text-3xl font-heading text-white">مكان الولادة</h1>
                        <div className="relative w-full">
                            <MapPin className="absolute top-4 left-4 text-indigo-500" />
                            <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="input-magical"
                                placeholder="المدينة، الدولة"
                            />
                        </div>
                        <button
                            disabled={city.length < 2}
                            onClick={nextStep}
                            className="btn-primary w-full mt-8 disabled:opacity-50"
                        >
                            تحليل الخريطة
                        </button>
                    </div>
                )}

                {/* STEP 5: UPLOAD PALM */}
                {wizardStep === 5 && (
                    <div className="w-full space-y-8">
                        <h1 className="text-3xl font-heading text-white">صورة الكف</h1>
                        <p className="text-gray-400">لدمج قراءة الكف مع الخريطة الفلكية</p>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-[#1F2937] hover:bg-[#374151] transition-colors border-2 border-dashed border-gray-600 hover:border-indigo-500 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
                        >
                            {palmImage ? (
                                <img src={palmImage} className="w-full h-full object-cover opacity-80" />
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <span className="text-gray-300 font-bold">اضغط لرفع صورة</span>
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
                            className="btn-primary w-full mt-4 disabled:opacity-50"
                        >
                            بدء التحليل الشامل
                        </button>
                    </div>
                )}

                {/* STEP 6: PROCESSING */}
                {wizardStep === 6 && (
                    <div className="w-full space-y-8 flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                            <div className="w-32 h-32 border-4 border-t-indigo-500 border-white/10 rounded-full animate-spin mx-auto"></div>
                            <Sparkles className="absolute inset-0 w-8 h-8 text-indigo-400 m-auto animate-bounce" />
                        </div>

                        <h2 className="text-2xl font-bold text-white animate-pulse mt-8">
                            {stages[Math.min(processingStage, stages.length - 1)]}
                        </h2>

                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-8 max-w-xs">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-300"
                                style={{ width: `${((Math.min(processingStage, stages.length - 1) + 1) / stages.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
