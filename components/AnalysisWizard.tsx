"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, MapPin, ArrowLeft, Loader2, Sparkles, User, Calendar, Clock } from 'lucide-react';
import ScrollPicker from './ScrollPicker';

type Step = 'gender' | 'name' | 'birth' | 'time' | 'city' | 'upload' | 'processing';

export default function AnalysisWizard() {
    // State
    const [wizardStep, setWizardStep] = useState(0);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form Data
    const [gender, setGender] = useState('female');
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [goals, setGoals] = useState<string[]>([]);
    const [element, setElement] = useState('');
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

    // Options Data
    const relationshipOptions = [
        { label: 'في علاقة', icon: '💑', id: 'relationship' },
        { label: 'انفصلت مؤخراً', icon: '💔', id: 'breakup' },
        { label: 'مخطوب/ة', icon: '💍', id: 'engaged' },
        { label: 'متزوج/ة', icon: '💒', id: 'married' },
        { label: 'أبحث عن توأم روحي', icon: '💫', id: 'searching' },
        { label: 'أعزب/ة', icon: '😌', id: 'single' },
    ];

    const goalsOptions = [
        { label: 'التناغم العائلي', icon: '❤️', id: 'family' },
        { label: 'الحياة المهنية', icon: '💼', id: 'career' },
        { label: 'الصحة', icon: '💊', id: 'health' },
        { label: 'الزواج', icon: '💍', id: 'marriage' },
        { label: 'السفر', icon: '🌍', id: 'travel' },
        { label: 'التعليم', icon: '🎓', id: 'education' },
        { label: 'الأصدقاء', icon: '👥', id: 'friends' },
        { label: 'الأطفال', icon: '👶', id: 'children' },
    ];

    const elementOptions = [
        { label: 'الأرض', icon: '🌿', id: 'earth', desc: 'أنت شخص ثابت وعملي' },
        { label: 'الماء', icon: '💧', id: 'water', desc: 'أنت شخص عاطفي وحدسي' },
        { label: 'النار', icon: '🔥', id: 'fire', desc: 'أنت شخص شغوف وقيادي' },
        { label: 'الهواء', icon: '💨', id: 'air', desc: 'أنت شخص اجتماعي ومفكر' },
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

    const toggleGoal = (id: string) => {
        if (goals.includes(id)) {
            setGoals(goals.filter(g => g !== id));
        } else {
            if (goals.length < 3) {
                setGoals([...goals, id]);
                vibrate(20);
            }
        }
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
        setWizardStep(11); // To Final Processing
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
            relationship,
            goals,
            element,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('userAnalysisData', JSON.stringify(data));
        router.push('/preview');
    };

    // Total Steps = 11 (0-10 mapped to 1-11 in UI, plus processing)
    // 0: Gender
    // 1: Name
    // 2: Relationship
    // 3: BirthDate
    // 4: BirthTime
    // 5: Place
    // 6: Interstitial (Chart)
    // 7: Goals
    // 8: Element
    // 9: Interstitial (Accuracy)
    // 10: Upload
    // 11: Processing

    return (
        <div className="w-full h-[100dvh] flex flex-col items-center justify-center relative text-center overflow-hidden">

            {/* Header / Progress */}
            {wizardStep < 11 && wizardStep !== 6 && wizardStep !== 9 && (
                <div className="absolute top-8 w-full px-6 flex justify-between items-center text-gray-500 z-50 px-4 md:px-8">
                    <button onClick={prevStep} className={`p-4 ${wizardStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
                        <ArrowLeft className="w-8 h-8 rotate-180 text-white" />
                    </button>
                    <span className="font-heading font-bold text-xl tracking-widest text-[#5671ff]">{wizardStep + 1} / 11</span>
                    <div className="w-12"></div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-md px-6 flex flex-col justify-center items-center wizard-step-container animate-wizard-enter z-40" key={wizardStep}>

                {/* STEP 0: GENDER */}
                {wizardStep === 0 && (
                    <div className="w-full space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-heading text-white leading-tight drop-shadow-lg">ما هو جنسك؟</h1>
                            <p className="text-gray-300 text-xl font-light">لتحليل الطاقة الأنثوية والذكورية</p>
                        </div>
                        <div className="flex flex-col gap-6 w-full px-2">
                            <button onClick={() => { setGender('female'); nextStep(); }} className="group w-full py-10 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/20 hover:border-[#5671ff] hover:bg-[#5671ff]/20 active:scale-95 transition-all duration-300 flex items-center justify-between px-10 shadow-2xl">
                                <span className="text-3xl md:text-4xl font-bold text-white group-hover:text-[#5671ff] transition-colors drop-shadow-md">أنثى</span>
                                <span className="text-6xl md:text-7xl filter drop-shadow-lg">♀</span>
                            </button>
                            <button onClick={() => { setGender('male'); nextStep(); }} className="group w-full py-10 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/20 hover:border-[#5671ff] hover:bg-[#5671ff]/20 active:scale-95 transition-all duration-300 flex items-center justify-between px-10 shadow-2xl">
                                <span className="text-3xl md:text-4xl font-bold text-white group-hover:text-[#5671ff] transition-colors drop-shadow-md">ذكر</span>
                                <span className="text-6xl md:text-7xl filter drop-shadow-lg">♂</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1: NAME */}
                {wizardStep === 1 && (
                    <div className="w-full space-y-12">
                        <h1 className="text-4xl md:text-5xl font-heading text-white drop-shadow-lg">اسمك الكامل</h1>
                        <div className="relative w-full">
                            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="input-magical text-3xl md:text-4xl py-4 bg-transparent text-center text-white placeholder-gray-500 border-b-2 border-white/20 focus:border-[#5671ff] outline-none transition-all" placeholder="اكتب اسمك..." />
                        </div>
                        <button disabled={name.length < 2} onClick={nextStep} className="btn-primary w-full py-5 text-2xl mt-12 disabled:opacity-50 disabled:scale-100 shadow-[0_4px_30px_rgba(86,113,255,0.5)]">استمرار</button>
                    </div>
                )}

                {/* STEP 2: RELATIONSHIP STATUS (NEW) */}
                {wizardStep === 2 && (
                    <div className="w-full space-y-8 h-full flex flex-col justify-center">
                        <div className="space-y-4 mb-4">
                            <h1 className="text-4xl md:text-5xl font-heading text-white leading-tight drop-shadow-lg">حالتك الاجتماعية؟</h1>
                            <p className="text-gray-300 text-lg">لنخبرك عن توافقك مع الآخرين</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 w-full overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                            {relationshipOptions.map((opt) => (
                                <button key={opt.id} onClick={() => { setRelationship(opt.id); nextStep(); }} className="w-full py-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#5671ff] hover:bg-[#5671ff]/20 active:scale-98 transition-all flex items-center px-6 gap-6 shadow-lg group">
                                    <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">{opt.icon}</span>
                                    <span className="text-2xl font-bold text-gray-100">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 3: DATE OF BIRTH */}
                {wizardStep === 3 && (
                    <div className="w-full space-y-10">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-heading text-white">تاريخ الميلاد</h1>
                            <p className="text-gray-400">نستخدم هذا لتحديد مواقع النجوم</p>
                        </div>
                        <div className="flex justify-center gap-1 md:gap-4 w-full h-[190px]">
                            <div className="flex-1 min-w-0 bg-[#1F2937]/50 rounded-2xl p-1 md:p-2 backdrop-blur-sm border border-white/5 h-full overflow-hidden"><ScrollPicker items={days} value={birthDay} onChange={(v) => setBirthDay(v as number)} label="اليوم" /></div>
                            <div className="flex-[1.5] min-w-0 bg-[#1F2937]/50 rounded-2xl p-1 md:p-2 backdrop-blur-sm border border-white/5 h-full overflow-hidden"><ScrollPicker items={months} value={birthMonth} onChange={(v) => setBirthMonth(v as string)} label="الشهر" /></div>
                            <div className="flex-1 min-w-0 bg-[#1F2937]/50 rounded-2xl p-1 md:p-2 backdrop-blur-sm border border-white/5 h-full overflow-hidden"><ScrollPicker items={years} value={birthYear} onChange={(v) => setBirthYear(v as number)} label="السنة" /></div>
                        </div>
                        <button onClick={nextStep} className="btn-primary w-full py-4 text-xl mt-8 shadow-[0_4px_20px_rgba(86,113,255,0.4)]">استمرار</button>
                    </div>
                )}

                {/* STEP 4: TIME OF BIRTH */}
                {wizardStep === 4 && (
                    <div className="w-full space-y-10">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-heading text-white">وقت الولادة</h1>
                            <p className="text-gray-400">الدقة مهمة جداً للطالع</p>
                        </div>
                        {!unknownTime ? (
                            <div className="flex justify-center gap-2 w-full">
                                <div className="flex-1 bg-[#1F2937]/50 rounded-2xl p-2 backdrop-blur-sm border border-white/5"><ScrollPicker items={hours} value={birthHour} onChange={(v) => setBirthHour(v as number)} label="ساعة" /></div>
                                <div className="flex-1 bg-[#1F2937]/50 rounded-2xl p-2 backdrop-blur-sm border border-white/5"><ScrollPicker items={minutes} value={birthMinute} onChange={(v) => setBirthMinute(v as string)} label="دقيقة" /></div>
                                <div className="flex-1 bg-[#1F2937]/50 rounded-2xl p-2 backdrop-blur-sm border border-white/5"><ScrollPicker items={periods} value={birthPeriod} onChange={(v) => setBirthPeriod(v as string)} label="م/ص" /></div>
                            </div>
                        ) : (
                            <div className="h-[200px] w-full flex items-center justify-center text-gray-400 italic border-2 border-dashed border-gray-700 rounded-3xl bg-black/20 text-lg">وقت غير معروف (12:00 م)</div>
                        )}
                        <div className="flex items-center justify-center gap-4 mt-6 p-4 rounded-xl bg-white/5 w-full cursor-pointer" onClick={() => setUnknownTime(!unknownTime)}>
                            <input type="checkbox" id="unknownTime" checked={unknownTime} readOnly className="w-6 h-6 rounded border-gray-500 text-indigo-500 focus:ring-indigo-500" />
                            <label htmlFor="unknownTime" className="text-lg text-gray-200 pointer-events-none">لا أعرف وقت ولادتي بدقة</label>
                        </div>
                        <button onClick={nextStep} className="btn-primary w-full py-4 text-xl mt-4 shadow-[0_4px_20px_rgba(86,113,255,0.4)]">استمرار</button>
                    </div>
                )}

                {/* STEP 5: PLACE */}
                {wizardStep === 5 && (
                    <div className="w-full space-y-12">
                        <h1 className="text-4xl md:text-5xl font-heading text-white">مكان الولادة</h1>
                        <div className="relative w-full">
                            <MapPin className="absolute top-1/2 -translate-y-1/2 left-4 text-[#5671ff] w-8 h-8" />
                            <input value={city} onChange={(e) => setCity(e.target.value)} className="input-magical text-3xl md:text-4xl py-6 pl-16" placeholder="المدينة، الدولة" />
                        </div>
                        <button disabled={city.length < 2} onClick={nextStep} className="btn-primary w-full py-4 text-xl mt-12 disabled:opacity-50 shadow-[0_4px_20px_rgba(86,113,255,0.4)]">تحليل الخريطة</button>
                    </div>
                )}

                {/* STEP 6: INTERSTITIAL - CHART (NEW) */}
                {wizardStep === 6 && (
                    <div onClick={() => { vibrate(); nextStep(); }} className="w-full h-full flex flex-col items-center justify-center space-y-8 cursor-pointer animate-fade-in relative overflow-hidden">
                        {/* Avatar Bubble */}
                        <div className="bg-[#FEFCE8] text-[#1F2937] px-6 py-4 rounded-2xl rounded-bl-none shadow-xl max-w-xs relative z-10 animate-slide-up-fade">
                            <p className="font-bold text-lg">خريطتكِ تُظهر "شرارة نادرة"! ✨ لنكتشف المزيد...</p>
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#FEFCE8] rotate-45"></div>
                        </div>

                        {/* Chart Visual */}
                        <div className="relative w-64 h-64 mt-8">
                            <div className="absolute inset-0 border border-[#5671ff]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-4 border border-[#5671ff]/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-16 h-16 text-[#5671ff] animate-pulse" />
                            </div>
                            {/* Zodiac Symbols positions */}
                            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[#5671ff] text-xs">♈</span>
                            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[#5671ff] text-xs">♎</span>
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#5671ff] text-xs">♑</span>
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5671ff] text-xs">♋</span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-white text-xl font-heading">جاري حساب الطوالع...</h3>
                            <p className="text-gray-400 text-sm animate-pulse">يتم تحليل اقتران الكواكب الآن</p>
                        </div>

                        <div className="absolute bottom-12 w-full px-6">
                            <button className="btn-primary w-full py-4 text-xl shadow-[0_4px_20px_rgba(86,113,255,0.4)]">متابعة</button>
                        </div>
                    </div>
                )}

                {/* STEP 7: GOALS (NEW) */}
                {wizardStep === 7 && (
                    <div className="w-full space-y-6 h-full flex flex-col">
                        <div className="space-y-2 mt-4">
                            <h1 className="text-3xl md:text-4xl font-heading text-white leading-tight">ما هي أهدافك؟</h1>
                            <p className="text-gray-400">اختر أهم 3 أهداف لمستقبلك</p>
                            <div className="text-[#5671ff] text-sm font-bold">تم اختيار: {goals.length}/3</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full overflow-y-auto pb-20 custom-scrollbar pr-1">
                            {goalsOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => toggleGoal(opt.id)}
                                    className={`py-4 px-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${goals.includes(opt.id)
                                        ? 'bg-[#5671ff] border-[#5671ff] text-white shadow-lg'
                                        : 'bg-[#1F2937]/50 border-white/5 text-gray-300 hover:border-[#5671ff]/50'
                                        }`}
                                >
                                    <span className="text-3xl">{opt.icon}</span>
                                    <span className="font-bold text-sm">{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="absolute bottom-8 left-0 right-0 px-6 bg-gradient-to-t from-[#111827] via-[#111827] to-transparent pt-10">
                            <button
                                disabled={goals.length === 0}
                                onClick={nextStep}
                                className="btn-primary w-full py-4 text-xl shadow-[0_4px_20px_rgba(86,113,255,0.4)] disabled:opacity-50 disabled:grayscale"
                            >
                                متابعة
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 8: ELEMENTS (NEW) */}
                {wizardStep === 8 && (
                    <div className="w-full space-y-8 h-full flex flex-col justify-center">
                        <div className="space-y-4 mb-4">
                            <h1 className="text-3xl md:text-3xl font-heading text-white leading-tight">أي عنصر يجذبك أكثر؟</h1>
                            <p className="text-gray-400">عنصر الطبيعة يعكس جوهر روحك</p>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            {elementOptions.map((opt) => (
                                <button key={opt.id} onClick={() => { setElement(opt.id); nextStep(); }} className="w-full py-6 rounded-2xl bg-[#1E293B] hover:bg-[#283548] border border-white/5 hover:border-[#5671ff] transition-all flex items-center px-6 relative overflow-hidden group">
                                    <div className={`absolute top-0 bottom-0 right-0 w-2 ${opt.id === 'fire' ? 'bg-orange-500' :
                                        opt.id === 'water' ? 'bg-blue-500' :
                                            opt.id === 'earth' ? 'bg-green-500' : 'bg-gray-300'
                                        } opacity-50`}></div>
                                    <span className="text-4xl ml-4">{opt.icon}</span>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white mb-1">{opt.label}</div>
                                        <div className="text-xs text-gray-400">{opt.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 9: INTERSTITIAL - ACCURACY (NEW) */}
                {wizardStep === 9 && (
                    <div onClick={() => { vibrate(); nextStep(); }} className="w-full h-full flex flex-col items-center justify-center space-y-8 cursor-pointer animate-fade-in relative z-50">
                        <div className="bg-[#FEFCE8] text-[#1F2937] px-6 py-6 rounded-2xl rounded-bl-none shadow-xl max-w-xs relative z-10 animate-slide-up-fade">
                            <p className="font-bold text-lg leading-relaxed">الطاقة الكونية تتجمع! ✨ شاركنا صورة كفك لنكشف ما يخفيه القدر...</p>
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#FEFCE8] rotate-45"></div>
                        </div>

                        <div className="relative w-48 h-48 my-8">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#5671ff] to-cyan-400 blur-md opacity-20 animate-pulse"></div>
                            <div className="absolute inset-0 rounded-full bg-[#1F2937] flex items-center justify-center border-4 border-[#5671ff]/30 z-0">
                                <span className="text-5xl font-heading font-bold text-white animate-pulse">87%</span>
                            </div>
                            {/* Progress Ring SVG */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="96" cy="96" r="90" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#1F2937]" />
                                <circle cx="96" cy="96" r="90" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="565" strokeDashoffset="100" className="text-[#5671ff] transition-all duration-1000" />
                            </svg>
                        </div>

                        <div className="absolute bottom-12 w-full px-6">
                            <button className="btn-primary w-full py-4 text-xl shadow-[0_4px_20px_rgba(86,113,255,0.4)]">متابعة</button>
                        </div>
                    </div>
                )}

                {/* STEP 10: PROFESSIONAL PALM SCANNER (WAS 5) */}
                {wizardStep === 10 && (
                    <div className="w-full h-full flex flex-col items-center justify-between py-6">
                        <div className="space-y-2 mt-4">
                            <h1 className="text-3xl md:text-4xl font-heading text-white">صورة الكف</h1>
                            <p className="text-gray-400">وجه كاميرا هاتفك نحو كفك الأيسر</p>
                        </div>

                        {/* Camera Viewfinder UI */}
                        <div className="relative w-full max-w-[320px] aspect-[3/4] my-4">
                            {/* Corner Brackets */}
                            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#C0A062] rounded-tl-2xl z-10"></div>
                            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#C0A062] rounded-tr-2xl z-10"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#C0A062] rounded-bl-2xl z-10"></div>
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#C0A062] rounded-br-2xl z-10"></div>

                            {/* Hand Outline (SVG) */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                                <svg viewBox="0 0 200 300" className="w-full h-full stroke-white stroke-2 fill-none" preserveAspectRatio="xMidYMid meet">
                                    <path d="M40,280 C40,250 50,220 50,200 L40,140 C35,120 20,130 15,150 L5,180 C0,160 10,120 30,100 C25,80 35,60 50,70 L55,110 C55,80 60,40 80,40 C95,40 100,70 100,100 C100,70 110,30 130,30 C145,30 150,60 150,90 C150,70 160,40 180,50 C195,60 190,100 185,120 L175,180 C185,200 195,240 180,280" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M55,180 Q100,200 160,160" stroke="#FF5050" strokeDasharray="4" className="animate-pulse" /> {/* Heart Line */}
                                    <path d="M50,160 Q100,180 150,220" stroke="#50FF50" strokeDasharray="4" className="animate-pulse delay-75" /> {/* Head Line */}
                                    <path d="M60,150 Q120,250 100,290" stroke="#5050FF" strokeDasharray="4" className="animate-pulse delay-150" /> {/* Life Line */}
                                </svg>
                            </div>

                            {/* Labels */}
                            <div className="absolute top-[20%] right-[-10%] bg-[#1F2937]/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs text-white flex items-center gap-1"><span className="text-pink-400">💍</span> الزواج</div>
                            <div className="absolute top-[35%] left-[-10%] bg-[#1F2937]/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs text-white flex items-center gap-1"><span className="text-blue-400">💼</span> المهنة</div>
                            <div className="absolute bottom-[25%] right-[-5%] bg-[#1F2937]/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs text-white flex items-center gap-1"><span className="text-yellow-400">💰</span> المال</div>
                            <div className="absolute top-[10%] left-[10%] bg-[#1F2937]/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs text-white flex items-center gap-1"><span className="text-purple-400">🔮</span> القدر</div>

                            {/* Scanner Beam */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#5671ff] shadow-[0_0_15px_#5671ff] animate-[scan_3s_ease-in-out_infinite] opacity-50"></div>

                            {/* Actual Upload Area Overlay */}
                            <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 cursor-pointer z-20 flex flex-col items-center justify-end pb-8 group">
                                {palmImage && (
                                    <img src={palmImage} className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-60" />
                                )}
                                {!palmImage && <span className="text-white/50 text-sm mb-4 bg-black/40 px-3 py-1 rounded-full">اضغط لالتقاط صورة</span>}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                        </div>

                        {/* Controls */}
                        <div className="w-full flex flex-col items-center gap-4 px-6 relative z-30">
                            {/* Shutter Button Style */}
                            {!palmImage ? (
                                <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-full border-4 border-white/20 p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                                    <div className="w-full h-full bg-[#14B8A6] rounded-full shadow-[0_0_20px_rgba(20,184,166,0.4)]"></div>
                                </button>
                            ) : (
                                <button onClick={startProcessing} className="btn-primary w-full py-4 text-xl shadow-[0_4px_20px_rgba(86,113,255,0.4)] animate-bounce-slow">
                                    تحليل الصورة ⚡️
                                </button>
                            )}

                            {/* Disclaimer */}
                            <div className="mt-4 text-[10px] md:text-xs text-gray-500 text-center max-w-xs leading-relaxed" dir="rtl">
                                هذه القراءات للأغراض الترفيهية فقط ولا ينبغي اعتبارها حقائق دقيقة بنسبة 100٪. خصوصيتك أولوية بالنسبة لنا، نحن لا نقوم بتخزين أي صور شخصية.
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 11: PROCESSING WITH SCANNED HAND (WAS 6) */}
                {wizardStep === 11 && (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-8 relative overflow-hidden">

                        {/* Scanned Hand Visual with Analyzing Lines */}
                        <div className="relative w-64 h-80 z-10">
                            {palmImage ? (
                                <img src={palmImage} className="w-full h-full object-cover rounded-2xl opacity-40 blur-sm animate-pulse-slow" />
                            ) : (
                                <div className="w-full h-full bg-white/5 rounded-2xl"></div>
                            )}

                            {/* Animated Lines Overlay */}
                            <svg viewBox="0 0 200 300" className="absolute inset-0 w-full h-full stroke-2 fill-none" preserveAspectRatio="none">
                                <path d="M55,180 Q100,200 160,160" stroke="#FF5050" strokeDasharray="1000" strokeDashoffset="1000" className="animate-[draw_3s_ease-out_forwards]">
                                    <animate attributeName="stroke-opactity" values="0;1;1" dur="3s" />
                                </path>
                                <path d="M50,160 Q100,180 150,220" stroke="#50FF50" strokeDasharray="1000" strokeDashoffset="1000" className="animate-[draw_3s_ease-out_forwards_1s]" />
                                <path d="M60,150 Q120,250 100,290" stroke="#5050FF" strokeDasharray="1000" strokeDashoffset="1000" className="animate-[draw_3s_ease-out_forwards_2s]" />
                            </svg>

                            {/* Floating Analysis Points */}
                            <div className="absolute top-[30%] left-[30%] w-3 h-3 bg-white rounded-full animate-ping"></div>
                            <div className="absolute top-[50%] right-[40%] w-3 h-3 bg-white rounded-full animate-ping delay-300"></div>
                            <div className="absolute bottom-[30%] left-[45%] w-3 h-3 bg-white rounded-full animate-ping delay-700"></div>
                        </div>

                        <div className="text-center z-10 space-y-4">
                            <h2 className="text-3xl font-heading text-white animate-pulse">
                                {stages[Math.min(processingStage, stages.length - 1)]}
                            </h2>
                            <p className="text-[#14B8A6] font-mono text-xl">{Math.min(processingStage * 25, 100)}% مكتمل</p>
                        </div>

                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#5671ff]/20 to-transparent animate-pulse-slow pointer-events-none"></div>
                    </div>
                )}
            </div>

            {/* Version Indicator */}
            <div className="absolute bottom-2 text-[10px] text-gray-700 font-mono opacity-50">v2.0 REBORN</div>
        </div>
    );
}
