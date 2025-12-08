"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';

export default function PaymentPage() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        if (!selectedMethod) return;

        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            router.push('/analysis/report');
        }, 2000);
    };

    const methods = [
        { id: 'apple', name: 'Apple Pay', icon: '' },
        { id: 'stc', name: 'STC Pay', icon: '📱' },
        { id: 'card', name: 'بطاقة ائتمان', icon: '💳' },
        { id: 'mada', name: 'مدى', icon: '🏛️' },
    ];

    return (
        <main className="min-h-screen py-10 px-4 flex items-center justify-center">
            <div className="container max-w-md glass-panel p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-gold" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">تأكيد الطلب</h1>
                    <p className="text-gray-400">احصل على التقرير الشامل فوراً</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 mb-8 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-white">التقرير الفلكي + قراءة الكف</h3>
                        <p className="text-xs text-gray-400">نسخة كاملة PDF + تقرير تفاعلي</p>
                    </div>
                    <div className="text-xl font-bold text-gold">49 ر.س</div>
                </div>

                <div className="space-y-3 mb-8">
                    <label className="text-sm text-gray-400 block mb-2">اختر وسيلة الدفع</label>
                    {methods.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedMethod === method.id
                                    ? 'border-yellow-500 bg-yellow-500/10'
                                    : 'border-gray-700 hover:border-gray-500 bg-transparent'
                                }`}
                        >
                            <span className="flex items-center gap-3 font-bold">
                                <span className="text-2xl">{method.icon}</span>
                                {method.name}
                            </span>
                            {selectedMethod === method.id && <CheckCircle2 className="w-5 h-5 text-gold" />}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handlePayment}
                    disabled={!selectedMethod || isProcessing}
                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {isProcessing ? 'جاري المعالجة...' : 'دفع الآن 49 ر.س'}
                    {!isProcessing && <Lock className="w-4 h-4" />}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    دفع آمن ومشفر 100%
                </p>
            </div>
        </main>
    );
}
