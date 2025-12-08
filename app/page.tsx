import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(112,0,255,0.2) 0%, rgba(5,5,17,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(5,5,17,0) 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 0
        }}
      />

      <div className="container relative z-10 flex flex-col items-center justify-center text-center py-20 min-h-screen">
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            lineHeight: 1.2,
            marginBottom: '1rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #E0E0E0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255,255,255,0.1)'
          }}
        >
          اكتشف خريطة أقدارك <br />
          <span className="text-gold">وسر خطوط كفك</span>
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            maxWidth: '600px',
            color: 'var(--text-muted)',
            marginBottom: '3rem',
            lineHeight: 1.6
          }}
        >
          تطبيق متكامل يجمع بين علم الخرائط الفلكية وتحليل الكف بالذكاء الاصطناعي
          ليمنحك نظرة عميقة حول مستقبلك، حياتك المهنية، وعلاقاتك.
        </p>

        <Link href="/analysis/input" className="btn-primary">
          ابدأ التحليل المجاني
        </Link>

        {/* Features Preview Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          width: '100%',
          marginTop: '6rem'
        }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="text-gold" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>الخريطة الفلكية</h3>
            <p style={{ color: '#ccc' }}>أفضل الأماكن للنجاح، الحب، والسفر بناءً على تاريخ ومكان ميلادك.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="text-gold" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>قراءة الكف</h3>
            <p style={{ color: '#ccc' }}>تحليل فوري لخطوط الكف يكشف عن خفايا شخصيتك وطاقتك الحالية.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="text-gold" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>تقرير شامل</h3>
            <p style={{ color: '#ccc' }}>دمج فريد بين العلمين للحصول على توجيه دقيق ومخصص لك وحدك.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
