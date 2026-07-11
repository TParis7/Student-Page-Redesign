(function() {
  /* ══════════════════════════════════════════════════════════════
     fs-combined.js — For Students page (mirrors fm-combined.js architecture)
     Injects CSS, builds nav, footer, and all page sections via DOM manipulation
     ══════════════════════════════════════════════════════════════ */

  // Guard against double execution (site-level + page-level script loading)
  if (document.getElementById('fm-root')) return;

  // ═══ 0. CANCEL WEBFLOW IX2 BODY ANIMATION ═══
  // Webflow IX2 page-load interactions use the Web Animations API to fade body in.
  // This overrides ALL CSS (even !important) and inline styles. Must cancel it.
  // Run immediately AND on load/DOMContentLoaded since IX2 may init after this script.
  function cancelBodyAnimations() {
    if (document.body.getAnimations) {
      document.body.getAnimations().forEach(function(a) { a.cancel(); });
    }
    document.body.style.setProperty('opacity', '1', 'important');
  }
  cancelBodyAnimations();
  document.addEventListener('DOMContentLoaded', cancelBodyAnimations);
  window.addEventListener('load', cancelBodyAnimations);
  // Also poll briefly in case IX2 starts with a delay
  setTimeout(cancelBodyAnimations, 100);
  setTimeout(cancelBodyAnimations, 500);
  setTimeout(cancelBodyAnimations, 1500);

  // ═══ 1. INJECT CSS ═══
  var style = document.createElement('style');
  style.innerHTML = `/* ══════════════════════════════════════════════════════════════
   CSS — copied verbatim from fm-combined.js v2.2.0
   ══════════════════════════════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body.fm-active { background: #fff; margin:0; padding:0; opacity:1 !important; }
#fm-root { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #1a1a1a; -webkit-font-smoothing: antialiased; line-height: 1.6; }
#fm-root img { max-width: 100%; display: block; }
#fm-root a { text-decoration: none; color: inherit; }
#fm-root h1, #fm-root h2, #fm-root h3, #fm-root h4 { font-family: 'Space Grotesk', sans-serif; line-height: 1.2; color: inherit; }
#fm-root a.fm-btn-primary, #fm-root a.fm-btn-white { color: #fff; }
#fm-root a.fm-btn-white-outline { color: #fff; }

/* ── Utility classes ── */
.fm-section-label { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 100px; background: rgba(217,58,58,0.08); color: #D93A3A; font-family: 'Satoshi', 'Inter', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px; }
.fm-section-heading { font-size: 2.4rem; font-weight: 700; margin-bottom: 16px; color: #1a1a1a; }
.fm-section-heading em { font-style: normal; color: #D93A3A; }
.fm-section-sub { font-size: 1.05rem; color: #555; max-width: 640px; line-height: 1.7; }
.fm-container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.fm-section { padding: 48px 0; }
.fm-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 100px; font-weight: 600; font-size: 0.9rem; transition: all 0.25s ease; cursor: pointer; border: 2px solid transparent; font-family: 'Inter', sans-serif; }
.fm-btn-primary { background: #D93A3A; color: #fff; border-color: #D93A3A; }
.fm-btn-primary:hover { background: #b82e2e; border-color: #b82e2e; transform: translateY(-1px); }
.fm-btn-white { background: #D93A3A; color: #fff; border-color: #D93A3A; }
.fm-btn-white:hover { background: #b82e2e; border-color: #b82e2e; transform: translateY(-1px); }
.fm-btn-arrow { gap: 6px !important; }
.fm-btn-arrow::after { content: '\\2192'; margin-left: 3px; font-family: 'Satoshi', 'Inter', sans-serif; font-size: 14px; transition: transform .25s cubic-bezier(.25,.46,.45,.94); }
.fm-btn-arrow:hover::after { transform: translateX(3px); }
.fm-btn-white-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.3); }
.fm-btn-white-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); }

/* ═══ HERO ═══ */
.fm-hero { padding: 100px 0 40px; background: linear-gradient(135deg, #3a0c18 0%, #4a1020 40%, #2a0e16 100%); color: #fff; position: relative; overflow: hidden; min-height: 550px; display: flex; align-items: flex-start; }
.fm-hero-watermark { position: absolute; right: -5%; top: 50%; transform: translateY(-50%); width: 55%; height: 110%; object-fit: cover; opacity: 0.14; mask-image: linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%); -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%); filter: grayscale(30%); pointer-events: none; }
.fm-hero::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 70% 50%, rgba(217,58,58,0.1) 0%, transparent 60%); pointer-events: none; }
.fm-hero .fm-container { position: relative; z-index: 2; width: 100%; }
.fm-hero-content { max-width: 560px; }
.fm-hero h1 { font-size: 50px; font-weight: 700; margin-bottom: 16px; line-height: 1.15; }
.fm-hero h1 em { font-style: normal; color: #D93A3A; }
.fm-hero p { font-size: 1rem; color: rgba(255,255,255,0.65); margin-bottom: 28px; line-height: 1.7; }
.fm-hero-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
.fm-hero-stats { display: flex; gap: 32px; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.12); }
.fm-hero-stat-num { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #fff; }
.fm-hero-stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.5); margin-top: 2px; }

/* ═══ LOGO BAR ═══ */
.fm-logo-bar { background: #fff; padding: 28px 0; border-bottom: 1px solid #eee; overflow: hidden; }
.fm-logo-label { font-size: 0.7rem; font-weight: 600; color: #999; letter-spacing: 1.12px; text-transform: uppercase; text-align: center; margin-bottom: 18px; }
.fm-logo-track { display: flex; gap: 48px; animation: fmScrollLogos 30s linear infinite; width: max-content; align-items: center; }
.fm-logo-track img { height: 36px; opacity: 0.7; filter: grayscale(100%); transition: all 0.3s; }
.fm-logo-track img:hover { opacity: 1; filter: grayscale(0%); }
.fm-logo-track img.fm-logo-sm { height: 32px; }
@keyframes fmScrollLogos { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* ═══ WHY JOIN ═══ */
.fm-why-mentor { background: #fff; }
.fm-why-mentor .fm-container > .fm-section-label { display: flex; width: fit-content; margin-left: auto; margin-right: auto; }
.fm-why-mentor .fm-container > .fm-section-heading, .fm-why-mentor .fm-container > .fm-section-sub { text-align: center; }
.fm-why-mentor .fm-container > .fm-section-sub { margin: 0 auto; }
.fm-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 32px; }
.fm-why-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #eee; transition: all 0.3s ease; }
.fm-why-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); border-color: #D93A3A; }
.fm-why-card-img { height: 180px; overflow: hidden; position: relative; }
.fm-why-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.fm-why-card-img img.top-align { object-position: center top; }
.fm-why-card:hover .fm-why-card-img img { transform: scale(1.05); }
.fm-why-card-img .fm-why-card-overlay { position: absolute; bottom: 0; left: 0; right: 0; }
#fm-root .fm-why-card-img .fm-why-card-overlay h3 { color: #fff; font-size: 1.1rem; font-weight: 700; background: rgba(0,0,0,0.55); padding: 10px 16px; backdrop-filter: blur(2px); }
.fm-why-card-body { padding: 20px; }
.fm-why-card-role { font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #D93A3A; margin-bottom: 8px; }
.fm-why-card-body p { font-size: 0.88rem; color: #555; line-height: 1.6; margin-bottom: 12px; }

/* ═══ GET STARTED ═══ */
.fm-get-started { background: #f8f6f3; position: relative; overflow: hidden; padding: 48px 0; }
.fm-get-started .fm-container { position: relative; z-index: 2; }
.fm-gs-header { text-align: center; margin-bottom: 32px; }
.fm-gs-header h2 { font-size: 2.6rem; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
.fm-gs-header h2 em { font-style: normal; color: #D93A3A; }
.fm-gs-header p { font-size: 1.05rem; color: #666; max-width: 520px; margin: 0 auto; }
.fm-gs-bubbles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.fm-gs-bubble { position: absolute; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.12); animation: fmFloatBubble 6s ease-in-out infinite; }
.fm-gs-bubble:nth-child(1)  { width: 64px; height: 64px; top: 6%;  left: 4%;  animation-delay: 0s; }
.fm-gs-bubble:nth-child(2)  { width: 52px; height: 52px; top: 14%; right: 5%; animation-delay: 0.8s; }
.fm-gs-bubble:nth-child(3)  { width: 48px; height: 48px; top: 35%; left: 2%;  animation-delay: 1.6s; }
.fm-gs-bubble:nth-child(4)  { width: 56px; height: 56px; top: 55%; right: 3%; animation-delay: 2.4s; }
.fm-gs-bubble:nth-child(5)  { width: 44px; height: 44px; bottom: 20%; left: 5%;  animation-delay: 3.2s; }
.fm-gs-bubble:nth-child(6)  { width: 60px; height: 60px; bottom: 10%; right: 6%; animation-delay: 0.4s; }
.fm-gs-bubble:nth-child(7)  { width: 40px; height: 40px; top: 8%;  left: 14%; animation-delay: 1.2s; }
.fm-gs-bubble:nth-child(8)  { width: 50px; height: 50px; top: 70%; left: 6%;  animation-delay: 2s; }
.fm-gs-bubble:nth-child(9)  { width: 46px; height: 46px; top: 25%; right: 12%; animation-delay: 2.8s; }
.fm-gs-bubble:nth-child(10) { width: 42px; height: 42px; bottom: 5%; left: 12%; animation-delay: 3.6s; }
.fm-gs-bubble:nth-child(11) { width: 54px; height: 54px; top: 45%; right: 8%;  animation-delay: 1s; }
.fm-gs-bubble:nth-child(12) { width: 38px; height: 38px; bottom: 30%; right: 10%; animation-delay: 0.6s; }
@keyframes fmFloatBubble { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.fm-gs-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; position: relative; z-index: 2; }
.fm-gs-steps::before { content: ''; position: absolute; top: 80px; left: calc(12.5% + 10px); right: calc(12.5% + 10px); height: 3px; background: linear-gradient(90deg, #D93A3A, #6366f1, #22c55e, #f59e0b); border-radius: 2px; z-index: 0; opacity: 0.3; }
.fm-gs-step { background: #fff; border-radius: 16px; overflow: visible; border: 1px solid #eee; transition: all 0.3s ease; position: relative; z-index: 1; }
.fm-gs-step:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
.fm-gs-step-img { height: 160px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; border-radius: 16px 16px 0 0; }
.fm-gs-step-abstract { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.fm-gs-step-abstract svg { width: 80px; height: 80px; opacity: 0.95; }
.fm-gs-step-abstract.bg-1 { background: linear-gradient(135deg, #f8e8e8, #f0d4d4); }
.fm-gs-step-abstract.bg-2 { background: linear-gradient(135deg, #e8e8f8, #d4d4f0); }
.fm-gs-step-abstract.bg-3 { background: linear-gradient(135deg, #e8f5e8, #d4ecd4); }
.fm-gs-step-abstract.bg-4 { background: linear-gradient(135deg, #fef3e8, #fde4c8); }
.fm-gs-step-body { padding: 20px; }
.fm-gs-step-body h3 { font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
.fm-gs-step-body p { font-size: 0.85rem; color: #666; line-height: 1.55; }

/* ═══ FEATURES ═══ */
.fm-features { background: #fff; padding: 48px 0; }
.fm-feature-row { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; margin-bottom: 40px; }
.fm-feature-row:last-child { margin-bottom: 0; }
.fm-feature-row.reverse { direction: rtl; }
.fm-feature-row.reverse > * { direction: ltr; }
.fm-feature-visual { border-radius: 16px; overflow: hidden; aspect-ratio: 21/9; position: relative; display: flex; align-items: center; justify-content: center; }
.fm-feature-visual img { width: 100%; height: 100%; object-fit: cover; }
.fm-feature-text .fm-section-label { margin-bottom: 8px; }
.fm-feature-text h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 10px; }
.fm-feature-text p { font-size: 0.9rem; color: #555; line-height: 1.6; margin-bottom: 14px; }
.fm-feature-list { list-style: none; display: flex; flex-direction: column; gap: 6px; padding: 0; }
.fm-feature-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.86rem; color: #444; }
.fm-feature-list li::before { content: '\\2713'; color: #D93A3A; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

/* ═══ MILESTONES — web-platform band (homepage For-Institutions style) ═══ */
.fm-milestones { background: linear-gradient(135deg, #2e0614 0%, #4A1020 55%, #2e0614 100%); color: #fff; padding: 64px 0; position: relative; overflow: hidden; }
.fm-milestones::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 55% 70% at 80% 50%, rgba(217,58,58,0.16), transparent 70%); pointer-events: none; }
.fm-milestones .fm-container { position: relative; z-index: 1; }
.fm-milestones .fm-section-label { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }
.fm-milestones .fm-section-heading { color: #fff; }
.fm-milestones .fm-section-heading em { color: #D93A3A; }
.fm-mi2-grid { display: grid; grid-template-columns: 1fr 1.15fr; gap: 56px; align-items: center; }
.fm-mi2-lede { font-size: 1rem; color: rgba(255,255,255,0.72); line-height: 1.65; margin: 0 0 20px; max-width: 470px; }
.fm-mi2-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 11px; margin: 0 0 26px; }
.fm-mi2-list li { display: flex; gap: 11px; align-items: flex-start; font-size: 0.9rem; color: rgba(255,255,255,0.85); line-height: 1.5; }
.fm-mi2-list li svg { width: 17px; height: 17px; flex-shrink: 0; margin-top: 2.5px; color: #D93A3A; }
.fm-mi2-list li strong { font-weight: 600; color: inherit; }
.fm-mi2-btn { display: inline-flex; align-items: center; gap: 9px; background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.4); padding: 12px 26px; border-radius: 100px; font-weight: 600; font-size: 0.9rem; text-decoration: none; transition: all 0.3s; }
.fm-mi2-btn:hover { border-color: #D93A3A; color: #fff; background: rgba(217,58,58,0.18); transform: translateY(-2px); }
.fm-browser { border-radius: 12px; overflow: hidden; background: #16161a; box-shadow: 0 24px 70px rgba(20,5,16,0.35), 0 4px 18px rgba(20,5,16,0.18); border: 1px solid rgba(255,255,255,0.06); }
.fm-browser-bar { height: 34px; display: flex; align-items: center; gap: 12px; padding: 0 14px; background: #232329; }
.fm-browser-dots { display: flex; gap: 6px; flex-shrink: 0; }
.fm-browser-dots span { width: 10px; height: 10px; border-radius: 50%; }
.fm-browser-dots span:nth-child(1) { background: #e0564f; }
.fm-browser-dots span:nth-child(2) { background: #e0a33e; }
.fm-browser-dots span:nth-child(3) { background: #57a464; }
.fm-browser-url { flex: 1; max-width: 320px; margin: 0 auto; background: rgba(255,255,255,0.07); border-radius: 6px; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.55); text-align: center; padding: 4px 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fm-browser img { width: 100%; display: block; }

/* ═══ DUAL CARDS (Scholarships + Book) ═══ */
.fm-dual-cards { background: #fff; padding: 48px 0; }
.fm-dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.fm-dual-card { position: relative; border-radius: 20px; overflow: hidden; padding: 40px 36px; min-height: 617px; display: flex; flex-direction: column; justify-content: flex-end; border: 1px solid #eee; }
.fm-dual-card-bg { position: absolute; inset: 0; z-index: 0; }
.fm-dual-card-bg img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; opacity: 0.54; }
.fm-dual-card-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.85) 60%); }
.fm-dual-card-content { position: relative; z-index: 1; background: rgba(255,255,255,0.5); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); border-radius: 14px; padding: 24px; }
.fm-dual-card-content .fm-section-label { margin-bottom: 10px; }
.fm-dual-card-content h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 10px; color: #1a1a1a; }
.fm-dual-card-content h3 em { font-style: normal; color: #D93A3A; }
.fm-dual-card-content p { font-size: 0.9rem; color: #555; line-height: 1.6; margin-bottom: 16px; }
.fm-dual-card-content blockquote { background: transparent !important; background-color: transparent !important; border: 0 !important; border-left: 3px solid #D93A3A !important; border-radius: 0 !important; box-shadow: none !important; font-size: 0.85rem !important; font-style: italic !important; color: #666 !important; padding: 0 0 0 14px !important; margin: 0 0 20px !important; line-height: 1.6 !important; quotes: none; }
.fm-dual-card-content blockquote::before, .fm-dual-card-content blockquote::after { content: none !important; }
.fm-dual-card-features { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.fm-dual-card-features .fm-dual-feat { display: flex; align-items: flex-start; gap: 8px; font-size: 0.85rem; color: #444; }
.fm-dual-card-features .fm-dual-feat::before { content: '\\2713'; color: #D93A3A; font-weight: 700; flex-shrink: 0; }

/* ═══ COMMUNITY GALLERY ═══ */
.fm-community-gallery { padding: 8px 0 48px; background: #fff; overflow: hidden; }
.fm-community-gallery .fm-container { text-align: center; margin-bottom: 28px; }
.fm-gallery-track { display: flex; gap: 12px; animation: fmScrollGallery 40s linear infinite; width: max-content; }
.fm-gallery-track img { width: 240px; height: 180px; object-fit: cover; border-radius: 12px; }
@keyframes fmScrollGallery { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* ═══ CTA ═══ */
.fm-cta-section { background: linear-gradient(135deg, #3a0c18 0%, #4a1020 40%, #2a0e16 100%); color: #fff; text-align: center; padding: 48px 0; }
.fm-cta-section h2 { font-size: 2.4rem; font-weight: 700; margin-bottom: 16px; }
.fm-cta-section p { font-size: 1.05rem; color: rgba(255,255,255,0.7); max-width: 560px; margin: 0 auto 32px; line-height: 1.7; }
.fm-cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.fm-cta-badges { display: flex; gap: 14px; justify-content: center; align-items: center; margin-bottom: 26px; }
.fm-cta-badges img { height: 48px; width: auto; display: block; }
.fm-cta-badges a { transition: transform 0.3s; display: inline-block; }
.fm-cta-badges a:hover { transform: translateY(-2px); }
.fm-cta-note { font-size: 0.9rem !important; color: rgba(255,255,255,0.55) !important; margin: 0 auto !important; }
.fm-cta-note a { color: #fff; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; transition: color 0.3s; }
.fm-cta-note a:hover { color: #ff6b6b; }

/* ═══ NAV BAR (matches hp-shared-sections.js / p3-nav) ═══ */
.p3-nav { position: fixed; top: 0; left: 0; right: 0; height: auto; padding: 16px 40px; display: flex; align-items: center; justify-content: space-between; background: transparent; transition: background 0.3s, box-shadow 0.3s, backdrop-filter 0.3s; z-index: 1000; }
.p3-nav.scrolled { background: rgba(26, 26, 26, 0.95) !important; backdrop-filter: blur(20px) !important; box-shadow: 0 2px 20px rgba(0,0,0,0.15); }
.p3-nav-logo { text-decoration: none; z-index: 10; }
.p3-nav-logo-img { height: 36px; max-height: 36px; }
.p3-nav-links { display: flex; align-items: center; gap: 32px; margin-left: auto; }
.p3-nav-links a { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.85); text-decoration: none; transition: color 0.2s; }
/* Active page link: NOT bold, matches other links exactly */
.p3-nav-links a.w--current, .p3-nav-links a.p3-nav-link.w--current { color: rgba(255,255,255,0.85) !important; font-weight: 500 !important; }
.p3-nav.scrolled .p3-nav-links a.w--current { color: rgba(255,255,255,0.85) !important; font-weight: 500 !important; }
.pp-home-desktop-hide { display: none; }
.p3-nav-cta { background: #D93A3A; color: #fff !important; padding: 10px 24px; border-radius: 50px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; transition: background 0.2s, transform 0.2s; margin-left: 0; }
.p3-nav-cta:hover { background: #b52f2f; transform: translateY(-1px); }

/* ═══ MOBILE MENU ═══ */
.pp-mob-menu { display: none; flex-direction: column; gap: 5px; cursor: pointer; z-index: 1001; }
.pp-mob-menu span { width: 24px; height: 2.5px; background: #fff; border-radius: 2px; transition: all 0.3s; }
.pp-mob-menu.open span:nth-child(1) { transform: rotate(45deg) translate(8px, 8px); }
.pp-mob-menu.open span:nth-child(2) { opacity: 0; }
.pp-mob-menu.open span:nth-child(3) { transform: rotate(-45deg) translate(7px, -7px); }
.pp-mob-overlay { position: fixed; inset: 0; background-color: rgba(26, 10, 16, 0.97); z-index: 999; display: none; flex-direction: column; justify-content: center; align-items: center; gap: 28px; opacity: 0; transform: translateY(-100%); transition: opacity 0.3s, transform 0.3s; overflow-y: auto; }
.pp-mob-overlay.open { display: flex !important; opacity: 1; transform: translateY(0); }
.pp-mob-overlay-link, .pp-mob-overlay-cta { font-family: 'Inter', sans-serif; font-size: 1.25rem; font-weight: 500; color: #fff; opacity: 0.85; text-decoration: none; transition: color 0.2s; }
.pp-mob-overlay-link.w--current { opacity: 0.85 !important; font-weight: 500 !important; }
.pp-mob-overlay-cta { opacity: 1; background: #D93A3A; color: #fff; padding: 12px 32px; border-radius: 100px; display: inline-block; text-align: center; margin-top: 8px; font-size: 1rem; font-weight: 600; }

/* ═══ FOOTER ═══ */
.p3-footer { background: #0a0a0a; padding: 64px 40px 32px; color: #fff; }
.p3-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; max-width: 1180px; margin: 0 auto; }
.p3-footer-brand p { color: rgba(255,255,255,0.5); font-size: 0.85rem; line-height: 1.6; margin-top: 12px; }
.p3-footer-logo { height: 36px; margin-bottom: 8px; }
.p3-footer-tagline { color: rgba(255,255,255,0.5); font-size: 13px; line-height: 1.6; margin-top: 12px; }
.p3-footer-location { color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 4px; }
.p3-footer-col-title { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.8); margin-bottom: 16px; }
.p3-footer-col { display: flex; flex-direction: column; gap: 10px; }
.p3-footer-link { color: rgba(255,255,255,0.6); font-size: 13px; text-decoration: none; transition: color 0.2s; }
.p3-footer-link:hover { color: #fff; }
.p3-footer-bottom { margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); }

/* ═══ HERO H1 LINE BREAKS (desktop default) ═══ */
.fm-h1-br-mob { display: none; }
.fm-h1-br-dt { display: inline; }

/* ═══ DUAL CARD WATERMARK — Financial Support card shifted ~50% upwards from default center ═══ */
.fm-dual-card:first-child .fm-dual-card-bg img { object-position: center -20% !important; }
/* (Blockquote uses original CSS rule above — matches GitHub concept exactly.) */

/* ═══ RESPONSIVE ═══ */
@media (max-width: 991px) {
  .pp-mob-menu { display: flex; }
  .p3-nav-links, .p3-nav-cta { display: none !important; }
  .p3-nav { padding: 16px !important; height: 64px !important; }
  .p3-nav .p3-nav-logo-img { max-height: 36px !important; height: 36px !important; }
}
@media (max-width: 1024px) {
  .fm-hero h1 { font-size: 2.4rem; }
  .fm-hero-watermark { width: 70%; opacity: 0.12; }
  .fm-feature-row, .fm-feature-row.reverse { grid-template-columns: 1fr; direction: ltr; }
  .fm-milestone-content { grid-template-columns: 1fr; }
  .fm-why-grid { grid-template-columns: repeat(2, 1fr); }
  .fm-gs-steps { grid-template-columns: repeat(2, 1fr); }
  .fm-dual-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .fm-section { padding: 40px 0; }
  .fm-hero { padding: 120px 0 48px; min-height: auto; }
  .fm-hero .fm-container { padding: 0 28px; }
  .fm-hero-content { max-width: 100%; text-align: center; }
  .fm-hero h1 { font-size: 1.75rem; }
  /* Mobile: 2 lines only — break only at the comma */
  .fm-h1-br-dt { display: none !important; }
  .fm-h1-br-mob { display: inline !important; }
  .fm-hero p { font-size: 1rem; margin-bottom: 28px; max-width: 100%; }
  .fm-hero-watermark { display: none; }
  .fm-hero-buttons { flex-direction: column; gap: 12px; }
  .fm-hero-buttons .fm-btn { width: 100%; justify-content: center; padding: 14px 32px; font-size: 14px; }
  .fm-hero-stats { gap: 20px; flex-wrap: wrap; margin-top: 28px; padding-top: 24px; justify-content: center; }
  .fm-hero-stat-num { font-size: 1.6rem; }
  .fm-section-heading { font-size: 1.6rem; }
  .fm-section-sub { font-size: 0.92rem; }
  .fm-gs-header { margin-bottom: 32px; }
  .fm-gs-header h2 { font-size: 1.8rem; }
  .fm-gs-steps { grid-template-columns: 1fr 1fr; gap: 12px; }
  .fm-gs-step-img { height: 120px; }
  .fm-gs-step-body { padding: 14px; }
  .fm-gs-step-body h3 { font-size: 0.9rem; }
  .fm-gs-step-body p { font-size: 0.8rem; }
  .fm-gs-bubbles { display: none; }
  .fm-why-grid { grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 32px; }
  .fm-why-card-img { height: 140px; }
  .fm-why-card-body { padding: 14px; }
  .fm-why-card-body p { font-size: 0.82rem; margin-bottom: 8px; }
  .fm-why-card-role { font-size: 0.72rem; margin-bottom: 6px; }
  .fm-feature-row { gap: 24px; margin-bottom: 32px; }
  .fm-feature-text h3 { font-size: 1.2rem; }
  .fm-mi2-grid { grid-template-columns: 1fr; gap: 32px; }
  .fm-mi2-copy { text-align: center; }
  .fm-mi2-lede { margin-left: auto; margin-right: auto; }
  .fm-mi2-list { max-width: 420px; margin: 0 auto 24px; text-align: left; }
  .fm-community-gallery .fm-container { margin-bottom: 24px; }
  .fm-cta-section h2 { font-size: 1.6rem; }
  .fm-cta-section p { font-size: 0.92rem; }
  .fm-cta-badges img { height: 42px; }
  .fm-milestones .fm-section-label { display: flex !important; width: fit-content; margin-left: auto !important; margin-right: auto !important; }
  .fm-milestones .fm-section-heading,
  .fm-milestones .fm-section-sub { text-align: center !important; }
  .fm-dual-grid { grid-template-columns: 1fr; }
  .fm-dual-card { min-height: 520px; padding: 32px 24px; }
  .p3-footer-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 24px 16px !important; }
  .p3-footer-brand { grid-column: 1 / -1; }
  .p3-footer-bottom { flex-wrap: wrap; justify-content: center; text-align: center; }
}
@media (max-width: 480px) {
  .fm-hero h1 { font-size: 1.75rem; }
  .fm-hero-stats { gap: 16px; justify-content: center; }
  .fm-hero-stat-num { font-size: 1.4rem; }
  .fm-section-heading { font-size: 1.4rem; }
  .fm-gs-steps { grid-template-columns: 1fr; max-width: 340px; margin: 0 auto; }
  .fm-why-grid { grid-template-columns: 1fr; }
}`;
  document.head.appendChild(style);

  // ═══ 1b. LOAD GOOGLE FONTS (Inter, Space Grotesk, Satoshi) ═══
  var fontPreconnect = document.createElement('link');
  fontPreconnect.rel = 'preconnect';
  fontPreconnect.href = 'https://fonts.googleapis.com';
  document.head.appendChild(fontPreconnect);

  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Satoshi:wght@400;600;700&display=swap';
  document.head.appendChild(fontLink);

  // ═══ 2. ADD fm-active CLASS TO BODY ═══
  document.body.classList.add('fm-active');

  // ═══ 3. BUILD NAV ═══
  var nav = document.createElement('div');
  nav.id = 'p3nav';
  nav.className = 'p3-nav';
  nav.innerHTML = `<a href="https://pulseofp3.org/" class="p3-nav-logo w-inline-block"><img src="https://cdn.prod.website-files.com/69b02f65f0068e9fb16f09f7/69b02f65f0068e9fb16f0df1_P3%20Logo.svg" loading="lazy" alt="P3 - Pulse of Perseverance" class="p3-nav-logo-img"></a><div class="p3-nav-links"><a href="https://pulseofp3.org/" class="pp-home-desktop-hide">Home</a><a href="https://pulseofp3.org/for-students" class="p3-nav-link w--current" aria-current="page">For Students</a><a href="https://pulseofp3.org/partner" class="p3-nav-link">For Institutions</a><a href="https://pulseofp3.org/for-mentors" class="p3-nav-link">For Mentors</a><a href="https://pulseofp3.org/about/about" class="p3-nav-link">About</a></div><a href="https://pulseofp3.org/download" class="p3-nav-cta">Get the App</a><div aria-label="Menu" class="pp-mob-menu" id="hamburger"><span></span><span></span><span></span></div>`;
  document.body.insertBefore(nav, document.body.firstChild);

  // ═══ MOBILE OVERLAY ═══
  var overlay = document.createElement('div');
  overlay.id = 'pp-mob-overlay';
  overlay.className = 'pp-mob-overlay';
  overlay.innerHTML = `<a href="https://pulseofp3.org/" class="pp-mob-overlay-link">Home</a><a href="https://pulseofp3.org/for-students" class="pp-mob-overlay-link w--current" aria-current="page">For Students</a><a href="https://pulseofp3.org/partner" class="pp-mob-overlay-link">For Institutions</a><a href="https://pulseofp3.org/for-mentors" class="pp-mob-overlay-link">For Mentors</a><a href="https://pulseofp3.org/about/about" class="pp-mob-overlay-link">About</a><a href="https://pulseofp3.org/download" class="pp-mob-overlay-cta">Get the App</a>`;
  document.body.insertBefore(overlay, nav.nextSibling);

  // ═══ 4. BUILD fm-root CONTAINER ═══
  var root = document.createElement('div');
  root.id = 'fm-root';

  // ═══ HERO ═══
  var hero = document.createElement('section');
  hero.className = 'fm-hero';
  hero.innerHTML = `<img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20Versus_P3_20260910-IMG9479_MollJeanNye.jpg" alt="" class="fm-hero-watermark"><div class="fm-container"><div class="fm-hero-content"><h1>Your <em>career</em><br class="fm-h1-br-dt"> <em>accelerator</em>,<br class="fm-h1-br-mob"> powered<br class="fm-h1-br-dt"> by community.</h1><p>We are invested in your success. Get direct access to real professionals, opportunities, and career paths &mdash; 100% free on the P3 app.</p><div class="fm-hero-buttons"><a href="https://pulseofp3.org/download" class="fm-btn fm-btn-white fm-btn-arrow">Get the App</a><a href="https://platform.pulseofp3.org/demos/" target="_blank" rel="noopener" class="fm-btn fm-btn-white-outline">Try the Demo</a></div><div class="fm-hero-stats"><div><div class="fm-hero-stat-num">1,000+</div><div class="fm-hero-stat-label">Registered Users</div></div><div><div class="fm-hero-stat-num">$100K+</div><div class="fm-hero-stat-label">Scholarships Awarded</div></div><div><div class="fm-hero-stat-num">4.9&#9733;</div><div class="fm-hero-stat-label">App Store Rating</div></div></div></div></div>`;
  root.appendChild(hero);

  // ═══ LOGO BAR ═══
  var logoBar = document.createElement('div');
  logoBar.className = 'fm-logo-bar';
  logoBar.innerHTML = `<div class="fm-logo-label">Trusted by students at leading institutions</div><div class="fm-logo-track"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/csu.png" alt="CSU" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/xavier.png" alt="XAVIER" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/langston.png" alt="LANGSTON"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/nyu.png" alt="NYU" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/google.png" alt="GOOGLE" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/lsu.png" alt="LSU" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/mbk.png" alt="MBK"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/project-hood.png" alt="PROJECT-HOOD"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/cps.png" alt="CPS"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/100bm.png" alt="100BM"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/gilead.png" alt="GILEAD"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/lurie.png" alt="LURIE"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/csu.png" alt="CSU" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/xavier.png" alt="XAVIER" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/langston.png" alt="LANGSTON"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/nyu.png" alt="NYU" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/google.png" alt="GOOGLE" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/lsu.png" alt="LSU" class="fm-logo-sm"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/mbk.png" alt="MBK"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/project-hood.png" alt="PROJECT-HOOD"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/cps.png" alt="CPS"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/100bm.png" alt="100BM"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/gilead.png" alt="GILEAD"><img src="https://tparis7.github.io/Mentor-Page-Redesign/logos/lurie.png" alt="LURIE"></div>`;
  root.appendChild(logoBar);

  // ═══ WHY JOIN P3 ═══
  var whySection = document.createElement('section');
  whySection.className = 'fm-why-mentor fm-section';
  whySection.innerHTML = `<div class="fm-container"><div class="fm-section-label">Why Join P3</div><h2 class="fm-section-heading">Everything you need to <em>launch your career</em></h2><p class="fm-section-sub">P3 isn't just an app &mdash; it's your personal career accelerator. Free forever for students.</p><div class="fm-why-grid"><div class="fm-why-card"><div class="fm-why-card-img"><img src="https://tparis7.github.io/Mentor-Page-Redesign/new-mentor.jpeg" alt="AI Smart Matching"><div class="fm-why-card-overlay"><h3>AI Smart Matching</h3></div></div><div class="fm-why-card-body"><div class="fm-why-card-role">Your Perfect Mentor</div><p>Get matched with mentors based on your career goals, interests, and academic stage. Every connection is intentional &mdash; you choose who guides you.</p></div></div><div class="fm-why-card"><div class="fm-why-card-img"><img src="https://tparis7.github.io/Mentor-Page-Redesign/hospital.jpeg" alt="Video Guidance"><div class="fm-why-card-overlay"><h3>Video Guidance</h3></div></div><div class="fm-why-card-body"><div class="fm-why-card-role">Real Answers</div><p>Submit text-based questions and receive personalized 90-second video responses from professionals who've walked the path.</p></div></div><div class="fm-why-card"><div class="fm-why-card-img"><img src="https://tparis7.github.io/Mentor-Page-Redesign/224A1273_Original.jpg" alt="Monthly Scholarships"><div class="fm-why-card-overlay"><h3>Monthly Scholarships</h3></div></div><div class="fm-why-card-body"><div class="fm-why-card-role">Financial Support</div><p>Apply for P3's monthly scholarship &mdash; nearly $100,000 awarded since 2018. Be an active mentee to qualify.</p></div></div><div class="fm-why-card"><div class="fm-why-card-img"><img src="https://tparis7.github.io/Mentor-Page-Redesign/1760104448089.jpeg" alt="Career Opportunities" class="top-align"><div class="fm-why-card-overlay"><h3>Career Opportunities</h3></div></div><div class="fm-why-card-body"><div class="fm-why-card-role">Jobs &amp; Internships</div><p>Browse curated internships, jobs, and career resources across STEM, finance, legal, business, and more.</p></div></div><div class="fm-why-card"><div class="fm-why-card-img"><img src="https://tparis7.github.io/Student-Page-Redesign/Milestone%20Pathways%20Mobile.png" alt="Track Your Progress"><div class="fm-why-card-overlay"><h3>Track Your Progress</h3></div></div><div class="fm-why-card-body"><div class="fm-why-card-role">Milestone Pathways</div><p>Check off real-life milestones &mdash; from campus visits to your first job. Stay focused and show mentors where you are.</p></div></div><div class="fm-why-card"><div class="fm-why-card-img"><img src="https://tparis7.github.io/Student-Page-Redesign/Copy%20of%20IMG_1719.jpg" alt="Explore &amp; Learn"><div class="fm-why-card-overlay"><h3>Explore &amp; Learn</h3></div></div><div class="fm-why-card-body"><div class="fm-why-card-role">Video Library</div><p>Access a curated feed of career advice videos from mentors across industries. Learn from professionals in healthcare, tech, business, and more.</p></div></div></div></div>`;
  root.appendChild(whySection);

  // ═══ GET STARTED ═══
  var getStarted = document.createElement('section');
  getStarted.className = 'fm-get-started';
  getStarted.id = 'fm-get-started';
  getStarted.innerHTML = `<div class="fm-gs-bubbles"><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01J9NVS90T9N1P16JT92N94QZB.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01HXX2QF7XB3SCFQCZCB1CEY5N.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01J6W5Z2CZC32ENFW8NXKCBA0W.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01JZERCH0G6S1KP2DCKZ1NAZ60.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01JWX0RD5K7G6K49JMKXPN03Y2.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01JPNCNQSNC6B5J3CMQX5N8PGA.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01HXADB1E3N9CF3XV7FXXDY25K.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01JNB2J7ZGB8NZC7ZVQJYB0PHP.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01K2GDQC2RV2AZB52PFFNA2SAW.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01HXJ7KP3DKKM0EEQWGPJNBNJ2.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01JWKTEQZ6J1V88Y0ZWKWCWW9G.jpg" alt=""><img class="fm-gs-bubble" src="https://tparis7.github.io/Mentor-Page-Redesign/mentors/01JWM1DDK12KNBSXJPSER52BCH.jpg" alt=""></div><div class="fm-container"><div class="fm-gs-header"><h2>Get started in <em>4 simple steps</em></h2><p>P3 guides you from download to your first mentor connection.</p></div><div class="fm-gs-steps"><div class="fm-gs-step"><div class="fm-gs-step-img"><div class="fm-gs-step-abstract bg-1"><svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="13" fill="#D93A3A"/><circle cx="14" cy="14" r="13" stroke="#fff" stroke-width="2.5"/><text x="14" y="19" text-anchor="middle" fill="#fff" font-family="'Space Grotesk',sans-serif" font-size="16" font-weight="700">1</text><rect x="22" y="22" width="36" height="48" rx="7" stroke="#D93A3A" stroke-width="2.5"/><circle cx="40" cy="62" r="3" fill="#D93A3A"/><line x1="30" y1="34" x2="50" y2="34" stroke="#D93A3A" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="42" x2="44" y2="42" stroke="#D93A3A" stroke-width="2" stroke-linecap="round" opacity="0.5"/><path d="M34 50l4 4 8-8" stroke="#D93A3A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div><div class="fm-gs-step-body"><h3>Download &amp; Register</h3><p>Get the P3 app on iOS or Android. Sign up with Google or email &mdash; it takes just 2 minutes.</p></div></div><div class="fm-gs-step"><div class="fm-gs-step-img"><div class="fm-gs-step-abstract bg-2"><svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="13" fill="#6366f1"/><circle cx="14" cy="14" r="13" stroke="#fff" stroke-width="2.5"/><text x="14" y="19" text-anchor="middle" fill="#fff" font-family="'Space Grotesk',sans-serif" font-size="16" font-weight="700">2</text><circle cx="44" cy="32" r="12" stroke="#6366f1" stroke-width="2.5"/><circle cx="44" cy="32" r="5" fill="#6366f1" opacity="0.3"/><path d="M26 68v-4a18 18 0 0 1 36 0v4" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round"/><line x1="50" y1="56" x2="60" y2="56" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/><line x1="50" y1="62" x2="57" y2="62" stroke="#6366f1" stroke-width="2" stroke-linecap="round" opacity="0.5"/></svg></div></div><div class="fm-gs-step-body"><h3>Build Your Profile</h3><p>Tell us your career goals, education level, and what kind of guidance you need. The more detail, the better your match.</p></div></div><div class="fm-gs-step"><div class="fm-gs-step-img"><div class="fm-gs-step-abstract bg-3"><svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="13" fill="#22c55e"/><circle cx="14" cy="14" r="13" stroke="#fff" stroke-width="2.5"/><text x="14" y="19" text-anchor="middle" fill="#fff" font-family="'Space Grotesk',sans-serif" font-size="16" font-weight="700">3</text><circle cx="44" cy="44" r="22" stroke="#22c55e" stroke-width="2.5"/><path d="M33 44l8 8 14-14" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="44" cy="44" r="28" stroke="#22c55e" stroke-width="1" opacity="0.25" stroke-dasharray="4 4"/></svg></div></div><div class="fm-gs-step-body"><h3>Get Matched</h3><p>Our AI recommends mentors based on your goals and interests. Browse profiles, read bios, and choose who you want to connect with.</p></div></div><div class="fm-gs-step"><div class="fm-gs-step-img"><div class="fm-gs-step-abstract bg-4"><svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="13" fill="#f59e0b"/><circle cx="14" cy="14" r="13" stroke="#fff" stroke-width="2.5"/><text x="14" y="19" text-anchor="middle" fill="#fff" font-family="'Space Grotesk',sans-serif" font-size="16" font-weight="700">4</text><rect x="14" y="26" width="28" height="20" rx="4" stroke="#f59e0b" stroke-width="2.5"/><polygon points="56,28 68,36 56,44" stroke="#f59e0b" stroke-width="2.5" fill="#f59e0b" fill-opacity="0.2" stroke-linejoin="round"/><circle cx="28" cy="62" r="9" stroke="#f59e0b" stroke-width="2" opacity="0.5"/><circle cx="56" cy="62" r="9" stroke="#f59e0b" stroke-width="2" opacity="0.5"/><line x1="37" y1="62" x2="47" y2="62" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 3"/></svg></div></div><div class="fm-gs-step-body"><h3>Start Learning</h3><p>Ask questions, receive video guidance, track milestones, and apply for monthly scholarships.</p></div></div></div></div>`;
  root.appendChild(getStarted);

  // ═══ FEATURES ═══
  var features = document.createElement('section');
  features.className = 'fm-features';
  features.id = 'fm-features';
  features.innerHTML = `<div class="fm-container"><div style="text-align:center; margin-bottom: 40px;"><div class="fm-section-label">Student Features</div><h2 class="fm-section-heading">Built for students. <em>Designed for your success.</em></h2><p class="fm-section-sub" style="margin:0 auto">Everything you need to connect, learn, and grow &mdash; right from your phone.</p></div><div class="fm-feature-row"><div class="fm-feature-visual"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Connections.jpeg" alt="Smart Matching"></div><div class="fm-feature-text"><div class="fm-section-label">Smart Matching</div><h3>Personalized mentors, powered by AI</h3><p>Tell us your career goals, academic stage, and what kind of guidance you need. Our AI matches you with vetted professionals.</p><ul class="fm-feature-list"><li>Matched by career goals, education &amp; personal needs</li><li>You choose your mentor &mdash; every connection is intentional</li><li>Two types: Guides (1:1 focused) and Experts (career coaching)</li></ul></div></div><div class="fm-feature-row reverse"><div class="fm-feature-visual"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Video%20collage.jpeg" alt="Video Guidance"></div><div class="fm-feature-text"><div class="fm-section-label">Video Guidance</div><h3>Get real answers from real professionals</h3><p>Submit questions to your matched mentors and receive authentic 90-second video responses.</p><ul class="fm-feature-list"><li>Text questions, video answers &mdash; async and on your schedule</li><li>100+ discussion topics with conversation starters</li><li>Responses added to the public Explore feed for all students</li></ul></div></div><div class="fm-feature-row"><div class="fm-feature-visual"><img src="https://tparis7.github.io/Mentor-Page-Redesign/iPhone%20Mockup%20hand.jpg" alt="Career Resources"></div><div class="fm-feature-text"><div class="fm-section-label">Career Resources</div><h3>Opportunities curated just for you</h3><p>From internships and jobs to college readiness guides and scholarships &mdash; P3 puts career resources at your fingertips.</p><ul class="fm-feature-list"><li>Internships, jobs, and volunteer opportunities</li><li>College readiness resources and application guides</li><li>Monthly P3 scholarship &mdash; nearly $100K awarded since 2018</li></ul></div></div></div>`;
  root.appendChild(features);

  // ═══ MILESTONES ═══
  var milestones = document.createElement('section');
  milestones.className = 'fm-milestones';
  milestones.id = 'fm-milestones';
  milestones.innerHTML = `<div class="fm-container"><div class="fm-mi2-grid"><div class="fm-mi2-copy"><div class="fm-section-label">Pathway Milestones</div><h2 class="fm-section-heading">Achieve Your <em>Milestones.</em></h2><p class="fm-mi2-lede">The Mentee Milestone Framework turns the long climb to opportunity into a clear, achievable pathway, tracked from high school to first job.</p><ul class="fm-mi2-list"><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><strong>Guided pathways</strong> with checkpoints you can act on</span></li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><strong>Progress at a glance:</strong> see how far you&#39;ve come, and what&#39;s next</span></li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span><strong>Synced everywhere:</strong> one journey across app and web</span></li></ul><a href="https://www.pulseofp3.org/platform" class="fm-mi2-btn">Explore the Web App <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a></div><div class="fm-mi2-visual"><div class="fm-browser"><div class="fm-browser-bar"><div class="fm-browser-dots"><span></span><span></span><span></span></div><div class="fm-browser-url">platform.pulseofp3.org/milestones</div></div><img src="https://tparis7.github.io/Platform-Page/shots/milestones-crop.webp?v=20260708a" alt="Milestones: the full pathway journey on one screen" loading="lazy"></div></div></div></div>`;
  root.appendChild(milestones);

  // ═══ DUAL CARDS ═══
  var dualCards = document.createElement('section');
  dualCards.className = 'fm-dual-cards fm-section';
  dualCards.innerHTML = `<div class="fm-container"><div style="text-align:center; margin-bottom: 36px;"><div class="fm-section-label">Resources</div><h2 class="fm-section-heading">Scholarships &amp; <em>inspiration</em></h2></div><div class="fm-dual-grid"><div class="fm-dual-card"><div class="fm-dual-card-bg"><img src="https://tparis7.github.io/Mentor-Page-Redesign/224A1273_Original.jpg" alt=""></div><div class="fm-dual-card-content"><div class="fm-section-label">Monthly Scholarships</div><h3>Financial support for <em>ambitious students</em></h3><p>P3's monthly scholarship program has awarded nearly $100,000 to high school and college students since 2018.</p><div class="fm-dual-card-features"><div class="fm-dual-feat">Download the P3 app and become an active mentee</div><div class="fm-dual-feat">Submit your application by the 1st of each month</div><div class="fm-dual-feat">Winners selected based on engagement and need</div><div class="fm-dual-feat">Open to high school and college students nationwide</div></div><a href="https://pulseofp3.org/scholarships" class="fm-btn fm-btn-primary fm-btn-arrow">Apply Today</a></div></div><div class="fm-dual-card"><div class="fm-dual-card-bg"><img src="https://tparis7.github.io/Student-Page-Redesign/Book%20Cover.jpg" alt=""></div><div class="fm-dual-card-content"><div class="fm-section-label">The P3 Book</div><h3>Pulse of <em>Perseverance</em> Book</h3><p>The inspiring story behind P3 &mdash; written by our co-founders Dr. Maxime Madhere, Dr. Joseph Semien Jr., and Dr. Pierre Johnson. Three friends from Baton Rouge who defied the odds to become doctors and built a movement.</p><blockquote>"Read this book. Share it with any young person who needs to know that the odds can be beaten." &mdash; Dr. James E.K. Hildreth, Meharry Medical College</blockquote><a href="https://www.amazon.com/Pulse-Perseverance-Doctors-Journey-Success/dp/099927970X" target="_blank" class="fm-btn fm-btn-primary fm-btn-arrow">Get the Book</a></div></div></div></div>`;
  root.appendChild(dualCards);

  // ═══ COMMUNITY GALLERY ═══
  var gallery = document.createElement('section');
  gallery.className = 'fm-community-gallery';
  gallery.innerHTML = `<div class="fm-container"><div class="fm-section-label">Community</div><h2 class="fm-section-heading">Join <em>1,000+</em> Students Nationwide</h2><p class="fm-section-sub" style="margin:0 auto">Mentorship moments, campus events, and career breakthroughs.</p></div><div class="fm-gallery-track"><img src="https://tparis7.github.io/Mentor-Page-Redesign/224A1273_Original.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20Copy%20of%20P3_Gala2025_0193.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/_P3_4718.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/P3_Gala2025_0425.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/IMG_7919.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20Versus_P3_20260910-IMG9096_MollJeanNye.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/IMG_6982.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20P3_Gala2025_0065.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Doctors%20Park.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/group.jpeg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20_P3_4641.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20Versus_P3_20260910-IMG9479_MollJeanNye.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/224A1273_Original.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20Copy%20of%20P3_Gala2025_0193.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/_P3_4718.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/P3_Gala2025_0425.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/IMG_7919.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20Versus_P3_20260910-IMG9096_MollJeanNye.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/IMG_6982.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20P3_Gala2025_0065.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Doctors%20Park.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/group.jpeg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20_P3_4641.jpg" alt="P3"><img src="https://tparis7.github.io/Mentor-Page-Redesign/Copy%20of%20Versus_P3_20260910-IMG9479_MollJeanNye.jpg" alt="P3"></div>`;
  root.appendChild(gallery);

  // ═══ CTA ═══
  var cta = document.createElement('section');
  cta.className = 'fm-cta-section';
  cta.innerHTML = `<div class="fm-container"><h2>Your next chapter starts <em style="font-style:normal;color:#ff6b6b">here.</em></h2><p>Find a mentor who believes in your potential, unlock scholarships, and build the career you deserve. It all starts with the free P3 app.</p><div class="fm-cta-badges"><a href="https://apps.apple.com/us/app/p3-pulse-of-perseverance/id6478132244" target="_blank" rel="noopener"><img src="https://cdn.prod.website-files.com/69b02f65f0068e9fb16f09f7/69b02f65f0068e9fb16f0ddf_ios%20badge.svg" alt="Download on the App Store"></a><a href="https://play.google.com/store/apps/details?id=com.P3.prod" target="_blank" rel="noopener"><img src="https://cdn.prod.website-files.com/69b02f65f0068e9fb16f09f7/69b02f65f0068e9fb16f0de0_android%20badge.svg" alt="Get it on Google Play"></a></div><p class="fm-cta-note">Prefer the big screen? <a href="https://www.pulseofp3.org/platform">Explore the Web App &rarr;</a></p></div>`;
  root.appendChild(cta);

  // ═══ INSERT fm-root INTO BODY ═══
  document.body.insertBefore(root, document.body.lastChild);

  // ═══ 5. BUILD FOOTER ═══
  var footer = document.createElement('section');
  footer.className = 'p3-footer';
  footer.innerHTML = `<div class="p3-footer-grid"><div class="p3-footer-brand"><img src="https://cdn.prod.website-files.com/69b02f65f0068e9fb16f09f7/69b02f65f0068e9fb16f0df1_P3%20Logo.svg" loading="lazy" alt="P3 - Pulse of Perseverance" class="p3-footer-logo"><p class="p3-footer-tagline">Unlocking life-changing opportunities for young visionaries. Free on iOS &amp; Android.</p><p class="p3-footer-location">Chicago, IL &middot; Founded 2018</p></div><div class="p3-footer-col"><h4 class="p3-footer-col-title">Platform</h4><a href="https://pulseofp3.org/for-students" class="p3-footer-link">For Students</a><a href="https://pulseofp3.org/partner" class="p3-footer-link">For Institutions</a><a href="https://pulseofp3.org/for-mentors" class="p3-footer-link">For Mentors</a><a href="https://pulseofp3.org/scholarships" class="p3-footer-link">Scholarships</a></div><div class="p3-footer-col"><h4 class="p3-footer-col-title">About</h4><a href="https://pulseofp3.org/about/about" class="p3-footer-link">Our Story</a><a href="https://pulseofp3.org/about/about#team" class="p3-footer-link">Team</a><a href="https://drive.google.com/file/d/1IrFocCsboO6mLZsG3GAlHjmKv_V7a9Sn/view?usp=drive_link" class="p3-footer-link">Annual Report</a><a href="https://pulseofp3.org/about/in-the-press" class="p3-footer-link">Press</a></div><div class="p3-footer-col"><h4 class="p3-footer-col-title">Connect</h4><a href="https://www.instagram.com/pulseofp3/" class="p3-footer-link">Instagram</a><a href="https://www.linkedin.com/company/pulseofperseverance/" class="p3-footer-link">LinkedIn</a><a href="https://www.youtube.com/@PulseofPerseverance" target="_blank" class="p3-footer-link">YouTube</a><a href="https://pulseofp3.org/donate" class="p3-footer-link">Donate</a></div></div><div class="p3-footer-bottom" style="display:flex;justify-content:center;align-items:center;gap:4px;padding-top:24px;flex-wrap:wrap;"><p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;">&copy; 2026 Pulse of Perseverance Project. All rights reserved.</p><a href="https://pulseofp3.org/terms-conditions" class="p3-footer-link" style="font-size:12px;text-decoration:underline;color:rgba(255,255,255,0.4);">Terms &amp; Conditions</a></div>`;
  document.body.appendChild(footer);

  // ═══ 6. ATTACH INTERACTIVE BEHAVIORS ═══

  // Scroll-darken navbar
  var navEl = document.querySelector('.p3-nav');
  window.addEventListener('scroll', function() {
    if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Hamburger toggle
  var hamburger = document.getElementById('hamburger');
  var mobOverlay = document.getElementById('pp-mob-overlay');
  if (hamburger && mobOverlay) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      mobOverlay.classList.toggle('open');
      document.body.style.overflow = mobOverlay.classList.contains('open') ? 'hidden' : '';
    });
    mobOverlay.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        hamburger.classList.remove('open');
        mobOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
