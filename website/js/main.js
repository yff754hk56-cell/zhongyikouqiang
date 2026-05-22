/**
 * 忠一口腔 — 页面交互脚本
 * 滚动动画 · 数字计数 · 导航效果 · 移动菜单 · 渐进增强
 */

document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // 1. 滚动动画 — Intersection Observer
    // =============================================
    var revealEls = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el) {
        observer.observe(el);
    });

    // =============================================
    // 2. 数字滚动计数器
    // =============================================
    var countEls = document.querySelectorAll('.count');
    var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = parseFloat(el.getAttribute('data-target'));
            var isFloat = target % 1 !== 0;
            var duration = 2000;
            var startTime = null;

            function animate(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // easeOutCubic
                var ease = 1 - Math.pow(1 - progress, 3);
                var current = target * ease;
                el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    el.textContent = isFloat ? target.toFixed(1) : target;
                }
            }

            requestAnimationFrame(animate);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.6 });

    countEls.forEach(function (el) {
        countObserver.observe(el);
    });

    // =============================================
    // 3. 导航栏滚动效果（透明 → 实色）
    // =============================================
    var navbar = document.querySelector('.navbar');
    var scrollThreshold = 60;

    function updateNavbar() {
        if (window.pageYOffset > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    var navTicking = false;
    window.addEventListener('scroll', function () {
        if (!navTicking) {
            requestAnimationFrame(function () {
                updateNavbar();
                updateActiveNav();
                navTicking = false;
            });
            navTicking = true;
        }
    });

    // 初始状态
    updateNavbar();

    // =============================================
    // 4. 当前可视区域导航高亮
    // =============================================
    var sectionIds = ['home', 'about', 'services', 'doctors', 'equipment', 'gallery', 'reviews', 'faq', 'contact'];
    var navAs = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    function updateActiveNav() {
        var scrollPos = window.pageYOffset + 150;
        var current = 'home';
        sectionIds.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && el.offsetTop <= scrollPos) {
                current = id;
            }
        });
        navAs.forEach(function (a) {
            a.style.background = '';
            a.style.color = '';
            if (a.getAttribute('href') === '#' + current) {
                if (navbar.classList.contains('scrolled')) {
                    a.style.background = '#eaf5f2';
                    a.style.color = '#0d7c6b';
                } else {
                    a.style.background = 'rgba(255,255,255,0.15)';
                    a.style.color = '#fff';
                }
            }
        });
    }

    // =============================================
    // 5. 移动端菜单
    // =============================================
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    var navOverlay = document.querySelector('.nav-overlay');

    function openMenu() {
        navLinks.classList.add('active');
        navOverlay.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', function () {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navOverlay.addEventListener('click', closeMenu);

    // 菜单内链接点击后关闭
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // ESC关闭
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
            navToggle.focus();
        }
    });

    // =============================================
    // 6. FAQ手风琴互斥展开
    // =============================================
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (!item.open) return;
            faqItems.forEach(function (other) {
                if (other !== item && other.open) {
                    other.open = false;
                }
            });
        });
    });

    // =============================================
    // 7. 导航平滑滚动（含偏移）
    // =============================================
    var allNavLinks = document.querySelectorAll('.nav-links a[href^="#"], a[href^="#services"]');
    allNavLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (!href || href === '#') return;
            if (href.startsWith('#')) {
                e.preventDefault();
                var targetId = href.slice(1);
                var target = document.getElementById(targetId);
                if (target) {
                    var navHeight = navbar.offsetHeight;
                    var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            }
        });
    });

    // =============================================
    // 8. 画廊图片优雅淡入
    // =============================================
    var galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(function (img) {
        img.addEventListener('load', function () {
            img.style.opacity = '1';
        });
        // 如果图片已被缓存
        if (img.complete) {
            img.style.opacity = '1';
        }
        img.style.transition = 'opacity 0.4s ease';
        img.style.opacity = '0';
    });

    // =============================================
    // 9. Hero装饰元素的视差效果
    // =============================================
    var ornaments = document.querySelectorAll('.hero-bg-ornament');
    if (ornaments.length && window.innerWidth > 768) {
        window.addEventListener('scroll', function () {
            var scrolled = window.pageYOffset;
            if (scrolled > window.innerHeight) return;
            var rate = scrolled * 0.03;
            ornaments.forEach(function (orn, i) {
                var factor = (i + 1) * 0.5;
                orn.style.transform = 'translateY(' + (rate * factor) + 'px)';
            });
        }, { passive: true });
    }

});
