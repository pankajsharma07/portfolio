// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ─── Firebase Configuration ───
// Replace these with your real Firebase project values
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

  // ════════════════════════════════════════
  // 1. TYPEWRITER EFFECT — Hero role text
  // ════════════════════════════════════════
  const roleEl = document.querySelector('.hero-role');
  if (roleEl) {
    const phrases = [
      { plain: 'Senior Android Developer',        html: 'Senior Android <em>Developer</em>' },
      { plain: 'Kotlin Specialist',               html: 'Kotlin <em>Specialist</em>' },
      { plain: 'Jetpack Compose Enthusiast',      html: 'Jetpack Compose <em>Enthusiast</em>' },
      { plain: 'Clean Architecture Advocate',     html: 'Clean Architecture <em>Advocate</em>' },
    ];
    let pi = 0, ci = 0, deleting = false, paused = false;

    function typeLoop() {
      if (paused) { paused = false; setTimeout(typeLoop, 1800); return; }
      const { plain, html } = phrases[pi];

      if (!deleting) {
        ci++;
        roleEl.textContent = plain.slice(0, ci);
        if (ci >= plain.length) {
          roleEl.innerHTML = html; // snap to styled version
          paused = true; deleting = true;
          setTimeout(typeLoop, 50); return;
        }
        setTimeout(typeLoop, 55 + Math.random() * 30);
      } else {
        ci--;
        roleEl.textContent = plain.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(typeLoop, 380); return;
        }
        setTimeout(typeLoop, 26);
      }
    }
    setTimeout(typeLoop, 1000);

    // Blinking cursor via CSS class
    roleEl.classList.add('typewriter-cursor');
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
      .typewriter-cursor::after {
        content: '|';
        display: inline-block;
        margin-left: 3px;
        color: var(--accent, #5D9DFF);
        animation: cursorBlink 0.75s step-end infinite;
      }
      @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
    `;
    document.head.appendChild(cursorStyle);
  }

  // ════════════════════════════════════════
  // 2. STAT NUMBER COUNTERS — Hero stats
  // ════════════════════════════════════════
  const statEls = document.querySelectorAll('.stat-num');
  const statConfigs = [
    { target: 8,   suffix: '+',  decimals: 0, duration: 1200 },
    { target: 500, suffix: 'K+', decimals: 0, duration: 1600 },
    { target: 4.8, suffix: '★', decimals: 1, duration: 1400 },
  ];

  function animateCounter(el, { target, suffix, decimals, duration }) {
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection && statEls.length) {
    const so = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        statEls.forEach((el, i) => statConfigs[i] && animateCounter(el, statConfigs[i]));
        so.disconnect();
      }
    }, { threshold: 0.5 });
    so.observe(statsSection);
  }

  // ════════════════════════════════════════
  // 3. TIMELINE SLIDE-IN — alternating sides
  // ════════════════════════════════════════
  document.querySelectorAll('.timeline-card').forEach((card, i) => {
    const x = i % 2 === 0 ? '-48px' : '48px';
    card.style.cssText += `opacity:0;transform:translateX(${x});transition:opacity 0.65s cubic-bezier(.4,0,.2,1),transform 0.65s cubic-bezier(.4,0,.2,1);`;
  });

  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateX(0)';
        e.target.style.borderColor = '';
      }
    });
  }, { threshold: 0.15 }).observe
    ? (() => {
        const tObs = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateX(0)'; tObs.unobserve(e.target); }
          });
        }, { threshold: 0.15 });
        document.querySelectorAll('.timeline-card').forEach(c => tObs.observe(c));
      })()
    : null;

  // ════════════════════════════════════════
  // 4. PARALLAX — Hero rings on scroll
  // ════════════════════════════════════════
  const rings = document.querySelectorAll('.hero-ring');
  const heroBg = document.querySelector('.hero-bg');
  const heroEl = document.getElementById('hero');

  if (rings.length && heroEl) {
    let raf = false;
    window.addEventListener('scroll', () => {
      if (!raf) {
        requestAnimationFrame(() => {
          const sy = window.scrollY;
          const hh = heroEl.offsetHeight;
          if (sy <= hh) {
            rings[0]?.style.setProperty('transform', `translate(-50%, calc(-50% + ${sy * 0.14}px))`);
            rings[1]?.style.setProperty('transform', `translate(-50%, calc(-50% + ${sy * 0.08}px))`);
            rings[2]?.style.setProperty('transform', `translate(-50%, calc(-50% + ${sy * 0.04}px))`);
            if (heroBg) heroBg.style.opacity = `${1 - (sy / hh) * 0.65}`;
          }
          raf = false;
        });
        raf = true;
      }
    }, { passive: true });
  }

  // ════════════════════════════════════════
  // 5. BUTTON RIPPLE EFFECT
  // ════════════════════════════════════════
  const rippleCSS = document.createElement('style');
  rippleCSS.textContent = `@keyframes rippleAnim{to{transform:scale(1);opacity:0}}`;
  document.head.appendChild(rippleCSS);

  function attachRipple(el) {
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('click', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const size = Math.max(r.width, r.height) * 2;
      const dot = document.createElement('span');
      dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${x-size/2}px;top:${y-size/2}px;background:rgba(255,255,255,0.2);border-radius:50%;transform:scale(0);animation:rippleAnim 0.55s ease-out forwards;pointer-events:none;z-index:10;`;
      el.appendChild(dot);
      dot.addEventListener('animationend', () => dot.remove());
    });
  }
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .form-submit').forEach(attachRipple);

  // ════════════════════════════════════════
  // 6. STAGGERED SKILL TAGS — pop in on scroll
  // ════════════════════════════════════════
  document.querySelectorAll('.skill-group').forEach(group => {
    const tags = group.querySelectorAll('.tag');
    tags.forEach(t => { t.style.opacity='0'; t.style.transform='scale(0.75) translateY(8px)'; });

    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        tags.forEach((tag, i) => {
          tag.style.transition = `opacity 0.4s ease ${i*60}ms, transform 0.4s ease ${i*60}ms`;
          requestAnimationFrame(() => { tag.style.opacity='1'; tag.style.transform='scale(1) translateY(0)'; });
        });
        entries[0].target._obs?.disconnect();
      }
    }, { threshold: 0.2 }).observe(group);
  });

  // ════════════════════════════════════════
  // 7. CARD FADE + SCALE on scroll
  // ════════════════════════════════════════
  const cardItems = document.querySelectorAll('.project-card, .about-card, .edu-card');
  cardItems.forEach(el => {
    el.style.cssText += 'opacity:0;transform:translateY(22px) scale(0.97);transition:opacity 0.55s cubic-bezier(.4,0,.2,1),transform 0.55s cubic-bezier(.4,0,.2,1),border-color 0.3s ease;';
  });

  const cardObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, (i % 4) * 80);
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  cardItems.forEach(el => cardObs.observe(el));

  // ════════════════════════════════════════
  // 8. HERO PHOTO FLOAT
  // ════════════════════════════════════════
  const photoWrap = document.querySelector('.hero-image-wrap');
  if (photoWrap) {
    const fs = document.createElement('style');
    fs.textContent = `
      @keyframes floatPhoto{0%,100%{transform:translateY(-50%)}50%{transform:translateY(calc(-50% - 14px))}}
      .hero-image-wrap{animation:floatPhoto 6s ease-in-out infinite}
    `;
    document.head.appendChild(fs);
  }

  // ════════════════════════════════════════
  // 9. HAMBURGER MENU
  // ════════════════════════════════════════
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks?.classList.toggle('active');
  });
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ════════════════════════════════════════
  // 10. ACTIVE NAV LINK on scroll
  // ════════════════════════════════════════
  const navStyle = document.createElement('style');
  navStyle.textContent = `#nav-links a.nav-active{color:var(--accent)!important;background:var(--accent-dim)!important;}`;
  document.head.appendChild(navStyle);

  const navAnchors = document.querySelectorAll('#nav-links a');
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('nav-active'));
        document.querySelector(`#nav-links a[href="#${entry.target.id}"]`)?.classList.add('nav-active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' })
    .observe
    ? (() => {
        const nObs = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              navAnchors.forEach(a => a.classList.remove('nav-active'));
              document.querySelector(`#nav-links a[href="#${e.target.id}"]`)?.classList.add('nav-active');
            }
          });
        }, { rootMargin: '-40% 0px -55% 0px' });
        document.querySelectorAll('section[id]').forEach(s => nObs.observe(s));
      })()
    : null;

  // ════════════════════════════════════════
  // 11. HEADER scroll shadow
  // ════════════════════════════════════════
  window.addEventListener('scroll', () => {
    document.getElementById('main-header')?.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // ════════════════════════════════════════
  // 12. CONTACT FORM — Firebase submit
  // ════════════════════════════════════════
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMessage');

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) { showMsg('Please fill in all fields.', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMsg('Please enter a valid email address.', 'error'); return; }

    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      await addDoc(collection(db, 'queries'), { name, email, message, timestamp: serverTimestamp() });
      showMsg("Message sent! I'll get back to you soon.", 'success');
      form.reset();
    } catch (err) {
      console.error(err);
      showMsg('Something went wrong. Please try again.', 'error');
    } finally {
      btn.disabled = false; btn.textContent = 'Send Message →';
    }
  });

  function showMsg(text, type) {
    if (!formMsg) return;
    formMsg.textContent = text;
    formMsg.className = `form-message ${type}`;
  }

});
