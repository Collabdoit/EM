import AnalysisForm from '@/components/AnalysisForm';

export default function AnalysisPage() {
    return (
        <main className="min-h-screen py-0 px-0 relative overflow-hidden flex items-center justify-center">
            {/* Dark Overlay for contrast against Stars */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            <div className="w-full h-full relative z-20">
                <AnalysisForm />
            </div>
        </main>
    );
}
