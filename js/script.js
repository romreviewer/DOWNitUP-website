document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (Basic implementation)
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if(mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            const isVisible = navLinks.style.display === 'flex';
            if(isVisible) {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '24px';
                navLinks.style.background = 'var(--bg-panel)';
                navLinks.style.backdropFilter = 'blur(16px)';
                navLinks.style.padding = '20px';
                navLinks.style.borderRadius = '12px';
                navLinks.style.border = '1px solid var(--border-color)';
            }
        });
    }

    // OS Detection for Download Button
    const osNameSpan = document.getElementById('os-name');
    
    function getOS() {
        let userAgent = window.navigator.userAgent,
            platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'macOS'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'macOS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }
        return os;
    }

    const currentOS = getOS();
    
    if (currentOS) {
        osNameSpan.textContent = currentOS;
    } else {
        osNameSpan.textContent = "Your OS";
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if(window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }
            }
        });
    });
});
