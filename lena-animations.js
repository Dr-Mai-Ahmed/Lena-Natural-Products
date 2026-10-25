/* Lena Natural — الحركات والأشكال. حمّليه بعد script.js (بيحمّل lena-animations.css لوحده) */
(function () {
    const me = document.currentScript;
    if (me && !document.querySelector('link[href*="lena-animations.css"]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = me.src.replace('lena-animations.js', 'lena-animations.css');
        document.head.appendChild(l);
    }
    const rnd = (a, b) => a + Math.random() * (b - a);

    // ---- شريط التقدّم + ظل الهيدر ----
    const bar = document.createElement('div');
    bar.className = 'sf-progress';
    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const max = document.documentElement.scrollHeight - innerHeight;
            bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ')';
            const h = document.querySelector('.main-header');
            if (h) h.classList.toggle('sf-scrolled', scrollY > 10);
            ticking = false;
        });
    }
    addEventListener('scroll', onScroll, { passive: true });

    // ---- طيران المنتج للسلة ----
    function flyToCart(srcImg) {
        const icon = document.querySelector('.cart-icon-btn .fa-bag-shopping');
        const cartBtn = icon && icon.closest('.cart-icon-btn');
        if (cartBtn) { cartBtn.classList.remove('sf-shake'); void cartBtn.offsetWidth; cartBtn.classList.add('sf-shake'); }
        document.querySelectorAll('#cartCount').forEach(b => { b.classList.remove('sf-bump'); void b.offsetWidth; b.classList.add('sf-bump'); });
        if (!srcImg || !cartBtn) return;
        const a = srcImg.getBoundingClientRect(), b = cartBtn.getBoundingClientRect();
        if (!a.width) return;
        const fly = document.createElement('img');
        fly.src = srcImg.currentSrc || srcImg.src;
        fly.className = 'sf-fly';
        fly.style.cssText = 'width:90px;height:90px;left:' + (a.left + a.width / 2 - 45) + 'px;top:' + (a.top + a.height / 2 - 45) + 'px;';
        document.body.appendChild(fly);
        const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            fly.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(.12) rotate(360deg)';
            fly.style.opacity = '.4';
        }));
        setTimeout(() => fly.remove(), 900);
    }
    if (typeof window.addToCart === 'function') {
        const original = window.addToCart;
        window.addToCart = function (id) {
            original.apply(this, arguments);
            flyToCart(document.querySelector('.product-card[data-id="' + id + '"] .product-img img') || document.getElementById('ppImg'));
        };
    }

    // ---- الشريط العلوي المتحرك ----
    function buildTicker() {
        const bar = document.querySelector('.announcement-bar');
        if (!bar) return;
        const text = bar.textContent.trim();
        if (!text) return;
        bar.style.cssText += ';overflow:hidden;padding:0';
        const ticker = document.createElement('div');
        ticker.style.cssText = 'display:flex;width:max-content;direction:ltr;will-change:transform';
        const add = () => { const t = document.createElement('div'); t.className = 'sf-tick'; t.style.cssText = 'direction:rtl;display:inline-flex;gap:14px;white-space:nowrap;padding:10px 40px;font-weight:700;font-size:15px'; t.textContent = text; ticker.appendChild(t); };
        bar.textContent = '';
        bar.appendChild(ticker);
        add();
        let guard = 0;
        while (ticker.scrollWidth < innerWidth * 1.3 && guard++ < 30) add();
        const half = ticker.scrollWidth;
        ticker.innerHTML += ticker.innerHTML;
        const anim = ticker.animate([{ transform: 'translateX(' + (-half) + 'px)' }, { transform: 'translateX(0px)' }], { duration: half / 70 * 1000, iterations: Infinity, easing: 'linear' });
        bar.addEventListener('mouseenter', () => anim.pause());
        bar.addEventListener('mouseleave', () => anim.play());
    }

    // ---- جزيئات: ورود، أوراق، نجوم، فقاعات ----
    function particles(section, count, colors, kinds) {
        if (!section) return;
        kinds = kinds || ['flower', 'star', 'bubble', 'leaf', 'star'];
        const box = document.createElement('div');
        box.className = 'sf-particles';
        box.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            const kind = kinds[i % kinds.length];
            p.className = 'sf-p ' + kind;
            if (kind === 'leaf') p.innerHTML = '<i class="fa-solid ' + (i % 2 ? 'fa-leaf' : 'fa-spa') + '"></i>';
            if (kind === 'flower') p.textContent = i % 2 ? '🌸' : '🎀';
            if (kind === 'star') p.textContent = '✦';
            const size = kind === 'bubble' ? rnd(14, 38) : kind === 'star' ? rnd(14, 28) : rnd(20, 34);
            p.style.cssText = '--x:' + rnd(2, 96) + '%;--y:' + rnd(4, 90) + '%;--s:' + size + 'px;--t:' + rnd(kind === 'star' ? 2.5 : 9, kind === 'star' ? 5 : 17) + 's;--d:' + rnd(0, 9) + 's';
            if (colors) p.style.setProperty('--c', colors[i % colors.length]);
            box.appendChild(p);
        }
        section.insertBefore(box, section.firstChild);
    }

    // ---- ريبل على الضغط ----
    document.addEventListener('click', e => {
        const el = e.target.closest('.btn, .btn-add, .pf-btn');
        if (!el) return;
        const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height);
        const s = document.createElement('span');
        s.className = 'sf-ripple';
        s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
        el.appendChild(s);
        setTimeout(() => s.remove(), 650);
    });

    // ---- شاشة الترحيب ----
    function splash() {
        if (!document.querySelector('.hero-section')) return;
        try { if (sessionStorage.getItem('sf_splash_lena')) return; sessionStorage.setItem('sf_splash_lena', '1'); } catch (e) {}
        const s = document.createElement('div');
        s.className = 'sf-splash';
        s.innerHTML = '<div class="sf-s-circles"><i></i><i></i><i></i></div><div class="sf-s-flash"></div>' +
            '<div class="sf-s-logo"><svg viewBox="0 0 200 200"><circle class="sf-s-ring" cx="100" cy="100" r="92"/></svg><img src="images/lena.jpg" alt="" onerror="this.remove()"></div>' +
            '<div class="sf-s-name"><span>Lena</span><span>Natural</span></div>' +
            '<div class="sf-s-tag">منتجات عناية طبيعية 100% 🌸</div>';
        document.body.appendChild(s);
        document.body.classList.add('sf-wait');
        document.documentElement.style.overflow = 'hidden';
        let done = false;
        function finish() {
            if (done) return; done = true;
            s.classList.add('sf-out');
            document.body.classList.remove('sf-wait');
            document.documentElement.style.overflow = '';
            setTimeout(() => s.remove(), 1000);
        }
        s.addEventListener('click', finish);
        setTimeout(() => s.classList.add('sf-final'), 2900);   // الانيميشن الختامي
        setTimeout(finish, 3700);
    }
    if (document.body) splash(); else document.addEventListener('DOMContentLoaded', splash);

    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(bar);
        onScroll();
        buildTicker();

        // ---- الهيرو ----
        const hero = document.querySelector('.hero-section');
        if (hero) {
            // الكلمات تطلع واحدة ورا التانية
            const h = hero.querySelector('.hero-content h2, .hero-content h1');
            if (h) {
                let i = 0;
                [...h.childNodes].forEach(n => {
                    if (n.nodeType !== 3) return;
                    const frag = document.createDocumentFragment();
                    n.textContent.split(/(\s+)/).forEach(part => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                        const w = document.createElement('span');
                        w.className = 'sf-w'; w.style.setProperty('--i', i++); w.textContent = part;
                        frag.appendChild(w);
                    });
                    n.replaceWith(frag);
                });
            }
            ['r1', 'r2'].forEach(c => { const d = document.createElement('div'); d.className = 'sf-hero-ring ' + c; hero.insertBefore(d, hero.firstChild); });
            [['#c39bd3', '320px', 'top:-80px;right:-60px'], ['#f39c12', '260px', 'bottom:-60px;left:-40px'], ['#f8bbd0', '240px', 'top:30%;left:30%']].forEach(([c, w, pos]) => {
                const g = document.createElement('div'); g.className = 'sf-glow'; g.style.cssText = '--c:' + c + ';--w:' + w + ';' + pos; hero.insertBefore(g, hero.firstChild);
            });
            particles(hero, 24, ['#ffffff', '#f8bbd0', '#f5b041']);
            const badge = document.createElement('div');
            badge.className = 'sf-badge';
            badge.innerHTML = '<svg viewBox="0 0 120 120"><defs><path id="sfc" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0"/></defs><text><textPath href="#sfc">100% NATURAL ✦ LENA NATURAL ✦</textPath></text></svg><i class="fa-solid fa-leaf"></i>';
            hero.appendChild(badge);
            const w = document.createElement('div');
            w.innerHTML = '<svg class="sf-wave bottom" viewBox="0 0 2400 60" preserveAspectRatio="none"><path d="M0 60 V40 C300 -10 600 70 900 30 C1200 -10 1500 70 1800 30 C2100 -10 2250 40 2400 40 V60 Z"/></svg>';
            hero.appendChild(w.firstChild);
        }

        // ---- أشكال الخلفية ----
        function shapes(section, list) {
            if (!section) return;
            list.forEach(([type, css]) => { const d = document.createElement('div'); d.className = 'sf-shape ' + type; d.style.cssText = css; section.appendChild(d); });
        }
        shapes(document.querySelector('.products-section'), [
            ['blob', '--w:300px;top:10%;right:-110px;--t:18s'], ['dots', 'top:20px;left:10px'], ['ring', '--w:100px;bottom:90px;left:4%'],
            ['diamond', '--w:40px;top:14%;right:10%'], ['blob', '--w:200px;bottom:-60px;left:35%'], ['ring', '--w:70px;top:46%;left:3%']
        ]);
        shapes(document.querySelector('.pre-footer'), [['blob', '--w:240px;top:-60px;right:-60px'], ['dots', 'bottom:0;left:0'], ['diamond', '--w:36px;top:30%;left:6%']]);
        particles(document.querySelector('.pre-footer'), 10, ['#8e44ad', '#f39c12', '#f8bbd0'], ['flower', 'star', 'leaf', 'star']);
        particles(document.querySelector('.main-footer'), 12, ['#ffffff', '#f5b041', '#f8bbd0'], ['star', 'bubble', 'star', 'flower']);

        // ---- خط ملوّن تحت العناوين + ظهور العناصر بالتتابع ----
        document.querySelectorAll('.section-title h2').forEach(h => { const l = document.createElement('span'); l.className = 'sf-line'; h.before(l); });
        const targets = document.querySelectorAll('.section-title, .big-cat-box, .product-card, .pf-item, .pf-cta, .footer-col, .breadcrumb, .related .section-title');
        targets.forEach(t => t.classList.add('sf-r'));
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(entries => {
                entries.filter(e => e.isIntersecting).forEach((e, i) => {
                    e.target.style.setProperty('--sf-d', (i * 0.09) + 's');
                    e.target.classList.add('sf-in');
                    io.unobserve(e.target);
                });
            }, { threshold: .12 });
            targets.forEach(t => io.observe(t));
        } else targets.forEach(t => t.classList.add('sf-in'));

        // أنيميشن عند تغيير القسم
        const boxes = document.getElementById('categoryBoxes');
        const grid = document.getElementById('productsGrid');
        if (boxes && grid) boxes.addEventListener('click', () => setTimeout(() => {
            let i = 0;
            grid.querySelectorAll('.product-card').forEach(c => {
                c.classList.remove('sf-r', 'sf-in', 'sf-pop');
                if (c.classList.contains('is-hidden')) return;
                void c.offsetWidth;
                c.style.setProperty('--sf-d', (i++ * 0.06) + 's');
                c.classList.add('sf-pop');
            });
        }, 0));

        // ---- زرار واتساب عايم ----
        let num = '';
        try { num = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : ''; } catch (e) {}
        if (num && !document.querySelector('.sf-fab')) {
            const f = document.createElement('a');
            f.className = 'sf-fab'; f.href = 'https://wa.me/' + num; f.target = '_blank'; f.rel = 'noopener'; f.setAttribute('aria-label', 'واتساب');
            f.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
            document.body.appendChild(f);
        }
    });
})();
