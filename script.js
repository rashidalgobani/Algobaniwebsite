// JavaScript مشترك لمشروع التميز للضيافة
// Common JavaScript for Altamayoz Hospitality Project

// إنشاء الجزيئات المتحركة في الخلفية
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 15 + 's';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particlesContainer.appendChild(particle);
    }
}

// مراقبة التمرير للرسوم المتحركة
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate').forEach(el => observer.observe(el));
}

// تتبع النقرات (Analytics)
function trackEvent(eventName, eventData = {}) {
    // يمكن ربط هذا بـ Google Analytics أو Firebase
    console.log('Event:', eventName, eventData);

    // مثال لـ Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// إضافة مستمعي الأحداث للأزرار
function initTracking() {
    // تتبع النقرات على الأزرار
    document.querySelectorAll('.btn, .contact-btn, .service-card').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const text = this.textContent.trim();
            const href = this.getAttribute('href') || '';
            trackEvent('button_click', {
                button_text: text,
                button_href: href,
                page: window.location.pathname
            });
        });
    });

    // تتبع النقرات على روابط التواصل
    document.querySelectorAll('.social-links a, .social-footer a').forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.getAttribute('aria-label') || this.querySelector('i').className;
            trackEvent('social_click', {
                platform: platform,
                page: window.location.pathname
            });
        });
    });
}

// نسخ النص للحافظة
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم النسخ بنجاح!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// إظهار إشعار
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#2ECC71' : '#E74C3C'};
        color: white;
        padding: 15px 30px;
        border-radius: 12px;
        font-family: 'Tajawal', sans-serif;
        font-weight: 700;
        z-index: 9999;
        animation: fadeInUp 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// التحقق من الاتصال بالإنترنت
function checkConnection() {
    if (!navigator.onLine) {
        showNotification('أنت غير متصل بالإنترنت', 'error');
    }
}

// تسجيل بيانات الزائر
function logVisitorData(data) {
    const visitorData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer,
        ...data
    };

    // يمكن إرسال هذا لـ Firebase أو Google Sheets
    console.log('Visitor Data:', visitorData);

    // حفظ في localStorage للاستخدام المؤقت
    let visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    visitors.push(visitorData);
    localStorage.setItem('visitors', JSON.stringify(visitors));
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initScrollAnimations();
    initTracking();
    checkConnection();

    // تسجيل زيارة الصفحة
    logVisitorData({
        page: window.location.pathname,
        action: 'page_view'
    });
});

// مراقبة حالة الاتصال
window.addEventListener('online', () => showNotification('تم استعادة الاتصال'));
window.addEventListener('offline', () => showNotification('انقطع الاتصال', 'error'));
