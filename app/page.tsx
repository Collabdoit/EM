import AnalysisWizard from '@/components/AnalysisWizard';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="w-full h-full relative z-20">
        <AnalysisWizard />
      </div>
    </main>
  );
}
