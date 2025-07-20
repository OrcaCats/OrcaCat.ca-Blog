class TaskbarComponent {
    constructor(options = {}) {
        this.options = {
            logoSrc: options.logoSrc || 'assets/logo.png',
            logoAlt: options.logoAlt || 'logo',
            links: options.links || [
                { href: 'home.html', text: 'HOME' },
                { href: 'about.html', text: 'ABOUT' },
                { href: 'projects.html', text: 'PROJECTS' },
                { href: 'blog.html', text: 'BLOG' }
            ],
            socialLinks: options.socialLinks || [
                { href: 'https://github.com', icon: 'assets/icons/github.png', label: 'GitHub', color: '#333', isMain: true },
                { href: 'https://twitter.com', icon: 'assets/icons/twitter.png', label: 'Twitter', color: '#000' },
                { href: 'https://linkedin.com', icon: 'assets/icons/linkedin.png', label: 'LinkedIn', color: '#0077B5' },
                { href: 'https://instagram.com', icon: 'assets/icons/instagram.png', label: 'Instagram', color: '#E4405F' },
                { href: 'mailto:kelper22c@gmail.com', icon: 'assets/icons/email.png', label: 'Email', color: '#EA4335' },
                { href: 'https://discord.com', icon: 'assets/icons/discord.png', label: 'Discord', color: '#5865F2' },
                { href: 'https://youtube.com', icon: 'assets/icons/youtube.png', label: 'YouTube', color: '#FF0000' }
            ],
            ...options
        };
        
        this.lastScrollTop = 0;
        this.taskbar = null;
        this.socialRing = null;
        
        this.init();
    }
    
    init() {
        this.injectCSS();
        this.createTaskbar();
        this.attachScrollListener();
    }
    
    injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            
            #taskbar {
                width: 100%;
                background-color: rgba(255,255,255,0.7);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                padding: 5px;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 1000;
                transition: top 0.3s ease-in-out;
                height: 80px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .taskbar-center {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 1;
            }
            
            .taskbar-social-ring {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
                z-index: 1001;
            }
            
            .taskbar-social-ring.hidden {
                transform: translateY(-120px);
                opacity: 0;
            }
            
            .taskbar-social-secondary {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 300px;
                height: 300px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
                z-index: 1001;
            }
            
            .taskbar-social-secondary.hidden {
                transform: translateX(-320px);
                opacity: 0;
            }
            
            .social-icon {
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    z-index: 1;
}

.social-icon img {
    width: 70%;
    height: 70%;
    object-fit: contain;
    transition: all 0.3s ease;
}

.social-icon.main-icon {
    width: 40px;
    height: 40px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
}

.social-icon.main-icon:hover {
    width: 46px;
    height: 46px;
    z-index: 3;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
}

.social-icon.main-icon:hover img {
    width: 75%;
    height: 75%;
}

.social-icon:not(.main-icon) {
    width: 16px;
    height: 16px;
}

.social-icon:not(.main-icon):hover {
    width: 18px;
    height: 18px;
    z-index: 2;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
}

.social-icon:not(.main-icon) img {
    width: 80%;
    height: 80%;
}

.social-icon:not(.main-icon):hover img {
    width: 85%;
    height: 85%;
}
            
            /* Positioning for the 6 smaller circles - farther out with uppermost moved to bottom */
            .social-icon:nth-child(2) {
                top: calc(50% - 40px);
                left: calc(50% - 80px);
                transform: translate(-50%, -50%);
            }
            
            .social-icon:nth-child(3) {
                top: calc(50% + 20px);
                left: calc(50% - 100px);
                transform: translate(-50%, -50%);
            }
            
            .social-icon:nth-child(4) {
                top: calc(50% + 80px);
                left: calc(50% - 90px);
                transform: translate(-50%, -50%);
            }
            
            .social-icon:nth-child(5) {
                top: calc(50% + 120px);
                left: calc(50% - 50px);
                transform: translate(-50%, -50%);
            }
            
            .social-icon:nth-child(6) {
                top: calc(50% + 130px);
                left: calc(50% + 10px);
                transform: translate(-50%, -50%);
            }
            
            .social-icon:nth-child(7) {
                top: calc(50% + 110px);
                left: calc(50% + 60px);
                transform: translate(-50%, -50%);
            }
            
            @media (max-width: 768px) {
                .taskbar-social-ring {
                    display: none;
                }
                
                .taskbar-social-secondary {
                    display: none;
                }
                
                #taskbar {
                    justify-content: center;
                }
            }
            
            #taskbar a {
                display: inline-block;
                color: black;
                text-decoration: none;
                padding: 40px;
                font-size: 20px;
            }
            
            #taskbar a:hover {
                color: #575757;
            }
            
            #taskbar::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 100%;
                height: 20px;
                background: linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(0, 0, 0, 0));
                z-index: 999;
            }
            
            .taskbarLogo {
                height: 100%;
                object-fit: contain;
                max-height: 80px;
            }
            
            .taskbarLink {
                transition: color 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    createTaskbar() {
        // Create taskbar element
        this.taskbar = document.createElement('div');
        this.taskbar.id = 'taskbar';
        
        // Create center container for navigation
        const centerContainer = document.createElement('div');
        centerContainer.className = 'taskbar-center';
        
        // Create links before logo
        const beforeLogoLinks = this.options.links.slice(0, Math.ceil(this.options.links.length / 2));
        beforeLogoLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = link.text;
            linkElement.className = 'taskbarLink';
            centerContainer.appendChild(linkElement);
        });
        
        // Create logo
        const logo = document.createElement('img');
        logo.src = this.options.logoSrc;
        logo.alt = this.options.logoAlt;
        logo.className = 'taskbarLogo';
        centerContainer.appendChild(logo);
        
        // Create links after logo
        const afterLogoLinks = this.options.links.slice(Math.ceil(this.options.links.length / 2));
        afterLogoLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = link.text;
            linkElement.className = 'taskbarLink';
            centerContainer.appendChild(linkElement);
        });
        
        // Create social ring
        this.socialRing = document.createElement('div');
        this.socialRing.className = 'taskbar-social-ring';
        
        this.options.socialLinks.forEach((social, index) => {
            const socialLink = document.createElement('a');
            socialLink.href = social.href;
            socialLink.className = social.isMain ? 'social-icon main-icon' : 'social-icon';
            socialLink.title = social.label;
            socialLink.target = '_blank';
            socialLink.rel = 'noopener noreferrer';
            
            // Create image element for the icon
            const iconImg = document.createElement('img');
            iconImg.src = social.icon;
            iconImg.alt = social.label;
            iconImg.style.pointerEvents = 'none'; // Prevent image from interfering with hover
            
            socialLink.appendChild(iconImg);
            
            // Add hover effect with custom colors
            socialLink.addEventListener('mouseenter', () => {
                socialLink.style.backgroundColor = social.color + '20';
                socialLink.style.borderColor = social.color + '40';
            });
            
            socialLink.addEventListener('mouseleave', () => {
                socialLink.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                socialLink.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            });
            
            this.socialRing.appendChild(socialLink);
        });
        
        // Append everything to taskbar
        this.taskbar.appendChild(centerContainer);
        this.taskbar.appendChild(this.socialRing);
        
        // Insert taskbar at the beginning of body
        document.body.insertBefore(this.taskbar, document.body.firstChild);
    }
    
    attachScrollListener() {
        window.addEventListener("scroll", () => {
            let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollTop > this.lastScrollTop && currentScrollTop > 50) {
                // User is scrolling down - hide the navbar and social ring
                this.taskbar.style.top = "-100px";
                this.socialRing.classList.add('hidden');
            } else if (currentScrollTop < this.lastScrollTop) {
                // User is scrolling up - show the navbar and social ring
                this.taskbar.style.top = "0";
                this.taskbar.style.backgroundColor = "rgba(255,255,255,0.8)";
                this.socialRing.classList.remove('hidden');
            }

            this.lastScrollTop = currentScrollTop;
        });
    }
    
    // Method to update links dynamically
    updateLinks(newLinks) {
        this.options.links = newLinks;
        this.recreateTaskbar();
    }
    
    // Method to update social links
    updateSocialLinks(newSocialLinks) {
        this.options.socialLinks = newSocialLinks;
        this.recreateTaskbar();
    }
    
    // Helper method to recreate taskbar content
    recreateTaskbar() {
        // Clear current taskbar content
        this.taskbar.innerHTML = '';
        
        // Create center container for navigation
        const centerContainer = document.createElement('div');
        centerContainer.className = 'taskbar-center';
        
        // Recreate navigation links
        const beforeLogoLinks = this.options.links.slice(0, Math.ceil(this.options.links.length / 2));
        beforeLogoLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = link.text;
            linkElement.className = 'taskbarLink';
            centerContainer.appendChild(linkElement);
        });
        
        const logo = document.createElement('img');
        logo.src = this.options.logoSrc;
        logo.alt = this.options.logoAlt;
        logo.className = 'taskbarLogo';
        centerContainer.appendChild(logo);
        
        const afterLogoLinks = this.options.links.slice(Math.ceil(this.options.links.length / 2));
        afterLogoLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = link.text;
            linkElement.className = 'taskbarLink';
            centerContainer.appendChild(linkElement);
        });
        
        // Recreate social ring
        this.socialRing = document.createElement('div');
        this.socialRing.className = 'taskbar-social-ring';
        
        this.options.socialLinks.forEach((social, index) => {
            const socialLink = document.createElement('a');
            socialLink.href = social.href;
            socialLink.className = social.isMain ? 'social-icon main-icon' : 'social-icon';
            socialLink.title = social.label;
            socialLink.target = '_blank';
            socialLink.rel = 'noopener noreferrer';
            
            // Create image element for the icon
            const iconImg = document.createElement('img');
            iconImg.src = social.icon;
            iconImg.alt = social.label;
            iconImg.style.pointerEvents = 'none';
            
            socialLink.appendChild(iconImg);
            
            // Add hover effect with custom colors
            socialLink.addEventListener('mouseenter', () => {
                socialLink.style.backgroundColor = social.color + '20';
                socialLink.style.borderColor = social.color + '40';
            });
            
            socialLink.addEventListener('mouseleave', () => {
                socialLink.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                socialLink.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            });
            
            this.socialRing.appendChild(socialLink);
        });
        
        // Append everything to taskbar
        this.taskbar.appendChild(centerContainer);
        this.taskbar.appendChild(this.socialRing);
    }
    
    // Method to show/hide taskbar
    show() {
        this.taskbar.style.top = "0";
        this.socialRing.classList.remove('hidden');
    }
    
    hide() {
        this.taskbar.style.top = "-100px";
        this.socialRing.classList.add('hidden');
    }
    
    // Method to destroy the taskbar
    destroy() {
        if (this.taskbar) {
            this.taskbar.remove();
        }
    }
}

// Initialize taskbar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create taskbar with default options
    window.taskbar = new TaskbarComponent({
        logoSrc: 'assets/logo.png',
        logoAlt: 'logo',
        links: [
            { href: 'home.html', text: 'HOME' },
            { href: 'about.html', text: 'ABOUT' },
            { href: 'projects.html', text: 'PROJECTS' },
            { href: 'blog.html', text: 'BLOG' }
        ]
    });
});