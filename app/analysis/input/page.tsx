import AnalysisForm from '@/components/AnalysisForm';

export default function AnalysisPage() {
    return (
        <main className="min-h-screen py-10 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div
                style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '800px',
                    height: '800px',
                    background: 'radial-gradient(circle, rgba(112,0,255,0.08) 0%, rgba(5,5,17,0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    zIndex: 0
                }}
            />

            <div className="container relative z-10">
                <AnalysisForm />
            </div>
        </main>
    );
}
