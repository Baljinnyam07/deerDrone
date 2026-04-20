"use client";

import React, { useEffect, useRef } from 'react';

export default function AboutPage() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Background is now static fixed, no scroll listener needed.
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --page-bg: #000000;
          --text-main: #ffffff;
          --text-muted: rgba(255, 255, 255, 0.65);
          --border-color: rgba(255, 255, 255, 0.12);
          --card-bg: rgba(28, 28, 30, 0.75);
          --accent: #007AFF;
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-up {
          opacity: 0;
          animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }

        .minimal-page {
          position: relative;
          background-color: var(--page-bg);
          color: var(--text-main);
          overflow-x: hidden;
          clip-path: inset(0); /* Traps the fixed background image strictly within this section */
        }

        /* Dark Cinematic Fixed Background */
        .parallax-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-image: 
            linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 60%, #000000 100%),
            url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=90');
          background-size: cover;
          background-position: center;
          z-index: -1;
          filter: brightness(0.8) contrast(1.1);
          pointer-events: none;
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
        }

        .hero-section {
          padding: 30vh 0 20vh;
          text-align: center;
          position: relative;
        }

        .minimal-title {
          font-size: clamp(3.5rem, 8vw, 7.5rem);
          font-weight: 800;
          letter-spacing: -0.05em;
          line-height: 1;
          margin-bottom: 2rem;
          color: #ffffff;
          text-wrap: balance;
          text-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }

        .minimal-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.6rem);
          color: rgba(255,255,255,0.75);
          font-weight: 500;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .minimal-section {
          padding: 160px 0;
          border-top: 1px solid var(--border-color);
        }

        .section-label {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 2.5rem;
          display: block;
        }

        .huge-statement {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: #ffffff;
          text-wrap: balance;
        }

        .capability-row {
          padding: 50px 0;
          border-bottom: 1px solid var(--border-color);
          transition: all 0.4s ease;
        }
        .capability-row:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(10px);
        }
        .capability-row:last-child {
          border-bottom: none;
        }

        .capability-title {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #ffffff;
        }

        .brand-logo-box {
          position: relative;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 24px;
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
        }

        .brand-logo-box:hover {
          transform: translateY(-10px) scale(1.05);
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--accent);
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
        }

        .brand-text-logo {
          transition: all 0.5s ease;
          color: #ffffff;
          opacity: 0.45;
          font-weight: 900;
        }

        .brand-logo-box:hover .brand-text-logo {
          opacity: 1;
          transform: scale(1.15);
          color: #ffffff;
          text-shadow: 0 0 20px rgba(255,255,255,0.3);
        }

        .info-card {
          background: rgba(255, 255, 255, 0.04);
          padding: 60px;
          border-radius: 40px;
          height: 100%;
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(25px);
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .info-card:hover {
          transform: translateY(-12px);
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--accent);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }

        @media (max-width: 991px) {
           .minimal-section { padding: 100px 0; }
           .hero-section { padding: 20vh 0 10vh; }
           .brand-logo-box { height: 110px; }
           .info-card { padding: 40px; }
        }
      `}} />
      
      <div className="minimal-page">
        {/* Fixed Background Layer */}
        <div className="parallax-bg" ref={bgRef} />

        <div className="content-wrapper">
          {/* 1. Hero */}
          <section className="hero-section">
            <div className="container">
              <h1 className="minimal-title animate-up">
                Бид ирээдүйг нисгэнэ
              </h1>
              <p className="minimal-subtitle animate-up delay-1">
                Дийр Эс Би Интернэйшнл Рэйнж Групп. 2022 онд үүсгэн байгуулагдсан дрон технологи болон ухаалаг төхөөрөмжийн тэргүүлэгч.
              </p>
            </div>
          </section>

          {/* 3. Brands */}
          <section className="minimal-section" style={{ borderTop: 'none' }}>
            <div className="container">
              <div className="row align-items-start g-5">
                <div className="col-lg-5 animate-up">
                  <h2 className="huge-statement" style={{ fontSize: '3rem' }}>
                    Дэлхийд шалгарсан стандартыг Монголд
                  </h2>
                  <p className="mt-4" style={{ color: 'var(--text-muted)', fontSize: '1.3rem', lineHeight: 1.7 }}>
                    Бид дэлхийн тэргүүлэгч брэндүүдийг хэрэглэгчдэд албан ёсны дистрибьютерийн эрхтэйгээр нийлүүлдэг.
                  </p>
                </div>
                <div className="col-lg-7 animate-up delay-1">
                  <div className="row g-4 mt-3 mt-lg-0">
                    {[
                      { name: "DJI", text: "dji", style: { fontWeight: 900, fontSize: '3.5rem', letterSpacing: '-0.08em', fontFamily: 'Arial, Helvetica, sans-serif' } },
                      { name: "Potensic", text: "Potensic", style: { fontWeight: 800, letterSpacing: '-0.02em', fontStyle: 'italic', fontSize: '1.8rem' } },
                      { name: "FIMI", text: "FIMI", style: { fontWeight: 900, letterSpacing: '0.05em', fontStyle: 'italic', fontSize: '2rem' } },
                      { name: "MJX", text: "MJX", style: { fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.05em', fontSize: '2.2rem' } },
                      { name: "STARTRC", text: "STARTRC", style: { fontWeight: 700, letterSpacing: '0.08em', fontSize: '1.35rem' } },
                      { name: "BRDRC", text: "BRDRC", style: { fontWeight: 800, letterSpacing: '0.1em', fontSize: '1.5rem' } },
                    ].map((brand, i) => (
                      <div className="col-6 col-sm-4" key={i}>
                        <div className="brand-logo-box">
                          <span className="brand-text-logo" style={brand.style}>{brand.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Capabilities */}
          <section className="minimal-section">
            <div className="container">
              <div className="row mb-5 animate-up">
                <div className="col-12">
                   <h2 className="huge-statement" style={{ fontSize: '3.5rem' }}>
                     Бид юу хийдэг вэ?
                   </h2>
                </div>
              </div>
              
              <div className="mt-5">
                {[
                  { title: "Мэргэжлийн зөвлөгөө", desc: "Сонголтоос эхлээд систем нэгтгэл хүртэл танд яг хэрэгтэй тэргүүн зэргийн консалтинг." },
                  { title: "Ашиглалтын сургалт", desc: "Дроныг аюулгүй бөгөөд бүрэн дүүрэн ашиглах онол болон практикт суурилсан зааварчилгаа." },
                  { title: "Засвар & Дэмжлэг", desc: "Технологийн хэвийн ажиллагааг хангах баталгаат засвар, өндөр түвшний гарын авлага, дэмжлэг." },
                  { title: "Контент бүтээл", desc: "Агаарын өндөр чанартай зураг, видео контент бүтээх мэргэжлийн түвшний зураг авалт." }
                ].map((srv, idx) => (
                  <div className={`capability-row animate-up delay-${(idx%3)+1}`} key={idx}>
                    <div className="row align-items-center">
                      <div className="col-md-5">
                         <h3 className="capability-title">{srv.title}</h3>
                      </div>
                      <div className="col-md-6 offset-md-1">
                         <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '1.3rem', lineHeight: 1.7 }}>{srv.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Values */}
          <section className="minimal-section" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="container">
               <div className="row g-5">
                  <div className="col-lg-5 animate-up">
                     <div style={{ position: 'sticky', top: '120px' }}>
                       <h2 className="huge-statement mb-5" style={{ fontSize: '3.5rem' }}>
                         Зорилго & Нийцэл
                       </h2>
                       <div className="mb-5">
                          <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px', color: '#ffffff' }}>Алсын хараа</h4>
                          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                            Монгол Улсад дрон технологийн хэрэглээг зөвхөн хөгжүүлэх бус, найдвартай ухаалаг экосистемийг бүтээх.
                          </p>
                       </div>
                       <div>
                          <h4 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '15px', color: '#ffffff' }}>Эрхэм зорилго</h4>
                          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                            Хэрэглэгчдэд урт хугацааны, бодит үнэ цэнийг бий болгох өндөр чанартай бүтээгдэхүүн нийлүүлэх.
                          </p>
                       </div>
                     </div>
                  </div>
                  
                  <div className="col-lg-6 offset-lg-1">
                     <div className="row g-4">
                        {[
                          { t: "Чанар", d: "Борлуулж буй бүтээгдэхүүн бүр төгс баталгааг илтгэх болно." },
                          { t: "Итгэлцэл", d: "Харилцаа болгон ил тод, нээлттэй бөгөөд хоёр талын найдвартай байдалд суурилна." },
                          { t: "Инноваци", d: "Хэрэглэгчийг дараагийн түвшинд хүргэх цоо шинэ технологийн шийдлүүд." },
                          { t: "Хариуцлага", d: "Урт хугацааны дараах бүрэн дэмжлэг үзүүлэх амлалт." }
                        ].map((val, i) => (
                          <div className={`col-12 animate-up delay-${(i%3)+1}`} key={i}>
                             <div className="info-card">
                               <h4 className="mb-3" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>{val.t}</h4>
                               <p className="mb-0" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{val.d}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
