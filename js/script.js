document.addEventListener('DOMContentLoaded', () => {

    // OS Autodetection & Hero Download Button Update
    const mainDownloadBtn = document.getElementById('main-download-btn');
    const heroVersionText = document.querySelector('.hero-version');

    if (mainDownloadBtn && heroVersionText) {
        function detectOS() {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const platform = window.navigator.platform.toLowerCase();
            
            if (platform.includes('mac') || userAgent.includes('macintosh') || userAgent.includes('mac os x')) {
                return 'mac';
            } else if (platform.includes('win') || userAgent.includes('windows')) {
                return 'windows';
            } else if (userAgent.includes('android')) {
                return 'android';
            } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
                return 'ios';
            }
            return 'unknown';
        }

        const os = detectOS();
        
        if (os === 'windows') {
            mainDownloadBtn.href = 'download-windows';
            mainDownloadBtn.removeAttribute('target');
            mainDownloadBtn.removeAttribute('rel');
            mainDownloadBtn.innerHTML = `
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="margin-right: 8px;">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
                Download for Windows
            `;
            heroVersionText.textContent = 'v1.0.0 is available for Windows. Also available on macOS & Android.';
        } else if (os === 'mac') {
            mainDownloadBtn.href = 'download-mac';
            mainDownloadBtn.removeAttribute('target');
            mainDownloadBtn.removeAttribute('rel');
            mainDownloadBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style="margin-right: 8px;">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download for macOS
            `;
            heroVersionText.textContent = 'v1.0.0 is available for macOS. Also available on Windows & Android.';
        } else if (os === 'android') {
            const fallbackVersion = '1.7.3';
            heroVersionText.textContent = `v${fallbackVersion} is available on Google Play. Also available on Windows & macOS.`;
            const heroBadge = document.querySelector('.hero-badge');
            if (heroBadge) {
                heroBadge.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    v${fallbackVersion} is out!
                `;
            }

            // Fetch Play Store version dynamically from our backend API
            fetch('/api/playstore-version')
                .then(res => res.json())
                .then(data => {
                    if (data && data.version) {
                        const version = data.version;
                        heroVersionText.textContent = `v${version} is available on Google Play. Also available on Windows & macOS.`;
                        if (heroBadge) {
                            heroBadge.innerHTML = `
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                                v${version} is out!
                            `;
                        }
                    }
                })
                .catch(err => console.error('Error fetching dynamic Play Store version:', err));
        } else {
            mainDownloadBtn.href = '#platforms';
            mainDownloadBtn.removeAttribute('target');
            mainDownloadBtn.removeAttribute('rel');
            mainDownloadBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                Download DOWNitUP
            `;
            heroVersionText.textContent = 'Available on Windows, macOS & Android.';
        }
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Close mobile menu if open
                if (navLinks.classList.contains('mobile-open')) {
                    navLinks.classList.remove('mobile-open');
                }
            }
        });
    });

    // Animate elements on scroll
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .platform-card, .faq-item, .comparison-table-wrapper').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});
