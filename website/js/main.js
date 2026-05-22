/**
 * 忠一口腔 — 页面交互脚本
 * 轻量级 · 无依赖 · 渐进增强
 */

document.addEventListener('DOMContentLoaded', function () {
    // FAQ手风琴互斥展开：同一时间只展开一个
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

    // 导航链接点击后平滑滚动（处理sticky导航偏移）
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = link.getAttribute('href').slice(1);
            var target = document.getElementById(targetId);
            if (target) {
                var navHeight = document.querySelector('.navbar').offsetHeight;
                var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // 当前可视section对应导航高亮
    var sectionIds = ['home', 'services', 'doctors', 'equipment', 'faq', 'contact'];
    var navAs = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        var scrollPos = window.pageYOffset + 120;
        var current = '';
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
                a.style.background = '#e8f5ef';
                a.style.color = '#1a7a5c';
            }
        });
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    });

    // 初始化高亮
    updateActiveNav();
});
