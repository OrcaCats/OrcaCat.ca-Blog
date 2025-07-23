class TaskbarComponent {
    constructor(options = {}) {
        this.options = {
            logoSrc: options.logoSrc || 'assets/logo.png',
            logoAlt: options.logoAlt || 'logo',
            links: options.links || [
                { href: 'home.html', text: 'HOME' },
                { href: 'about.html', text: 'ABOUT' },
                { href: 'projects.html', text: 'PORTFOLIO' },
                { href: 'blog.html', text: 'BLOG' }
            ],
            socialLinks: options.socialLinks || [
                { href: 'https://github.com', icon: 'assets/icons/github.png', label: 'GitHub', color: '#333', isMain: true },
                { href: 'https://twitter.com', icon: 'assets/icons/twitter.png', label: 'Twitter', color: '#000' },
                { href: 'https://linkedin.com', icon: 'assets/icons/linkedin.png', label: 'LinkedIn', color: '#0077B5' },
                { href: 'https://instagram.com', icon: 'assets/icons/instagram.png', label: 'Instagram', color: '#E4405F' },
                { href: 'mailto:kelper22c@gmail.com', icon: 'assets/icons/email.png', label: 'Email', color: '#EA4335' },
                { href: 'https://discord.com', icon: 'assets/icons/discord.png', label: 'Discord', color: '#5865F2', expandable: true },
                { icon: 'assets/icons/wechat.png', label: 'Wechat', color: '#FF0000', expandable: true }
            ],
            ...options
        };
        
        this.lastScrollTop = 0;
        this.taskbar = null;
        this.socialRing = null;
        this.activeTile = null;
        
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
                width: 200px;
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
                z-index: 99999;
                pointer-events: none;
            }
            
            .taskbar-social-ring .social-icon {
                position: absolute;
                pointer-events: auto;
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
            
            /* Social Tile Overlay Styles */
            .social-tile-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .social-tile-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .social-tile {
                width: 400px;
                height: 350px;
                background: rgba(255, 255, 255, 0.60);
                backdrop-filter: blur(40px);
                -webkit-backdrop-filter: blur(40px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                transform: scale(0.8) translateY(50px);
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                overflow: hidden;
            }
            
            .social-tile-overlay.active .social-tile {
                transform: scale(1) translateY(0);
            }
            
            .social-tile::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.15) 0%, 
                    rgba(255, 255, 255, 0.08) 50%, 
                    rgba(255, 255, 255, 0.15) 100%);
                border-radius: 20px;
                z-index: 1;
            }
            
            .social-tile-content {
                position: relative;
                z-index: 2;
                text-align: center;
                padding: 30px;
                color: #222;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .social-tile-qr {
                width: 120px;
                height: 120px;
                background: #fff;
                border: 2px solid #eee;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                font-size: 12px;
                color: #666;
                text-align: center;
                line-height: 1.3;
            }
            
            .social-tile-id {
                font-family: 'Courier New', monospace;
                font-size: 16px;
                font-weight: 600;
                color: #444;
                background: rgba(255, 255, 255, 0.7);
                padding: 8px 16px;
                border-radius: 20px;
                margin: 10px 0 20px 0;
                border: 1px solid rgba(0, 0, 0, 0.1);
                display: inline-block;
            }
            
            .social-tile-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .social-tile-icon img {
                width: 50px;
                height: 50px;
                object-fit: contain;
            }
            
            .social-tile-title {
                font-size: 28px;
                font-weight: 600;
                margin-bottom: 15px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .social-tile-description {
                font-size: 16px;
                opacity: 0.8;
                line-height: 1.5;
                margin-bottom: 25px;
            }
            
            .social-tile-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            
            .social-tile-button {
                padding: 12px 24px;
                border-radius: 25px;
                border: none;
                background: rgba(255, 255, 255, 0.9);
                color: #333;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            
            .social-tile-button:hover {
                background: rgba(255, 255, 255, 1);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            }
            
            .social-tile-button.primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .social-tile-button.primary:hover {
                background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
            }
            
            .social-tile-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                z-index: 3;
            }
            
            .social-tile-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }
            
            .social-tile-close::before,
            .social-tile-close::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 2px;
                background: #333;
                border-radius: 1px;
            }
            
            .social-tile-close::before {
                transform: rotate(45deg);
            }
            
            .social-tile-close::after {
                transform: rotate(-45deg);
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
                z-index: 999999999;
                cursor: pointer;
            }

            .social-icon img {
                width: 70%;
                height: 70%;
                object-fit: contain;
                transition: all 0.3s ease;
                display: block;
                margin: auto;
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            /* Main icon styles */
            .social-icon.main-icon {
                width: 40px;
                height: 40px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2;
            }
            
            /* Position 6 icons around the main icon in a circular ring */
            .social-icon:nth-child(2)  { transform: rotate(0deg)    translate(100px) rotate(-0deg); }
            .social-icon:nth-child(3)  { transform: rotate(60deg)   translate(100px) rotate(-60deg); }
            .social-icon:nth-child(4)  { transform: rotate(120deg)  translate(100px) rotate(-120deg); }
            .social-icon:nth-child(5)  { transform: rotate(180deg)  translate(100px) rotate(-180deg); }
            .social-icon:nth-child(6)  { transform: rotate(240deg)  translate(100px) rotate(-240deg); }
            .social-icon:nth-child(7)  { transform: rotate(300deg)  translate(100px) rotate(-300deg); }

            .social-icon.main-icon:hover {
                width: 46px;
                height: 46px;
                z-index: 3;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                background: rgba(255, 255, 255, 0.97);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
            }

            .social-icon.main-icon:hover img {
                width: 75%;
                height: 75%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            /* Updated secondary icon styles */
            .social-icon:not(.main-icon) {
                width: 15px;
                height: 15px;
            }

            .social-icon:not(.main-icon):hover {
                width: 16px;
                height: 16px;
                z-index: 2;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                background: rgba(255, 255, 255, 0.97);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
            }

            .social-icon:not(.main-icon) img {
                width: 190%;
                height: 190%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .social-icon:not(.main-icon):hover img {
                width: 220%;
                height: 220%;
                top: 50%;
                left: 50%;
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
                
                .social-tile {
                    width: 90vw;
                    height: auto;
                    min-height: 350px;
                    margin: 20px;
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
    
    createSocialTile(social) {
        const overlay = document.createElement('div');
        overlay.className = 'social-tile-overlay';
        
        const tile = document.createElement('div');
        tile.className = 'social-tile';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'social-tile-close';
        closeButton.onclick = () => this.closeSocialTile();
        
        const content = document.createElement('div');
        content.className = 'social-tile-content';
        
        const iconContainer = document.createElement('div');
        iconContainer.className = 'social-tile-icon';
        iconContainer.style.background = `linear-gradient(135deg, ${social.color}20, ${social.color}10)`;
        
        const icon = document.createElement('img');
        icon.src = social.icon;
        icon.alt = social.label;
        iconContainer.appendChild(icon);
        
        const title = document.createElement('h2');
        title.className = 'social-tile-title';
        title.textContent = social.label;
        
        const description = document.createElement('p');
        description.className = 'social-tile-description';
        
        const actions = document.createElement('div');
        actions.className = 'social-tile-actions';
        
        // Customize content based on platform
        if (social.label === 'Discord') {
            description.textContent = 'Join our Discord community for real-time discussions, gaming sessions, and exclusive updates.';
            
            const joinButton = document.createElement('a');
            joinButton.href = social.href;
            joinButton.target = '_blank';
            joinButton.rel = 'noopener noreferrer';
            joinButton.className = 'social-tile-button primary';
            joinButton.textContent = 'Join Discord';
            
            const copyButton = document.createElement('button');
            copyButton.className = 'social-tile-button';
            copyButton.textContent = 'Copy Invite';
            copyButton.onclick = () => {
                navigator.clipboard.writeText(social.href);
                copyButton.textContent = 'Copied!';
                setTimeout(() => copyButton.textContent = 'Copy Invite', 2000);
            };
            
            actions.appendChild(joinButton);
            actions.appendChild(copyButton);
        } else if (social.label === 'Wechat') {
            description.textContent = 'Connect with me on WeChat for instant messaging and updates. Scan the QR code or add by ID.';
            
            const addButton = document.createElement('button');
            addButton.className = 'social-tile-button primary';
            addButton.textContent = 'Add Contact';
            addButton.onclick = () => {
                alert('WeChat ID: YourWeChatID\nScan QR code to add');
            };
            
            const qrButton = document.createElement('button');
            qrButton.className = 'social-tile-button';
            qrButton.textContent = 'Show QR Code';
            qrButton.onclick = () => {
                alert('QR Code functionality would open here');
            };
            
            actions.appendChild(addButton);
            actions.appendChild(qrButton);
        }
        
        content.appendChild(iconContainer);
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(actions);
        
        tile.appendChild(closeButton);
        tile.appendChild(content);
        overlay.appendChild(tile);
        
        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                this.closeSocialTile();
            }
        };
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeSocialTile();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        return overlay;
    }
    
    openSocialTile(social) {
        if (this.activeTile) {
            this.closeSocialTile();
        }
        
        this.activeTile = this.createSocialTile(social);
        document.body.appendChild(this.activeTile);
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.activeTile.classList.add('active');
        });
    }
    
    closeSocialTile() {
        if (this.activeTile) {
            this.activeTile.classList.remove('active');
            setTimeout(() => {
                if (this.activeTile && this.activeTile.parentNode) {
                    this.activeTile.parentNode.removeChild(this.activeTile);
                }
                this.activeTile = null;
            }, 400);
        }
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
            socialLink.className = social.isMain ? 'social-icon main-icon' : 'social-icon';
            socialLink.title = social.label;
            
            // Handle expandable items differently
            if (social.expandable) {
                socialLink.onclick = (e) => {
                    e.preventDefault();
                    this.openSocialTile(social);
                };
            } else {
                socialLink.href = social.href;
                socialLink.target = '_blank';
                socialLink.rel = 'noopener noreferrer';
            }
            
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
            socialLink.className = social.isMain ? 'social-icon main-icon' : 'social-icon';
            socialLink.title = social.label;
            
            // Handle expandable items
            if (social.expandable) {
                socialLink.onclick = (e) => {
                    e.preventDefault();
                    this.openSocialTile(social);
                };
            } else {
                socialLink.href = social.href;
                socialLink.target = '_blank';
                socialLink.rel = 'noopener noreferrer';
            }
            
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
        if (this.activeTile) {
            this.closeSocialTile();
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