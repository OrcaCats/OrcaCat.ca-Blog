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
            ...options
        };
        
        this.lastScrollTop = 0;
        this.taskbar = null;
        
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
                padding: 5px;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 1000;
                transition: top 0.3s ease-in-out;
                height: 80px;
                display: flex;
                justify-content: center;
                align-items: center;
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
        
        // Create links before logo
        const beforeLogoLinks = this.options.links.slice(0, Math.ceil(this.options.links.length / 2));
        beforeLogoLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = link.text;
            linkElement.className = 'taskbarLink';
            this.taskbar.appendChild(linkElement);
        });
        
        // Create logo
        const logo = document.createElement('img');
        logo.src = this.options.logoSrc;
        logo.alt = this.options.logoAlt;
        logo.className = 'taskbarLogo';
        this.taskbar.appendChild(logo);
        
        // Create links after logo
        const afterLogoLinks = this.options.links.slice(Math.ceil(this.options.links.length / 2));
        afterLogoLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = link.text;
            linkElement.className = 'taskbarLink';
            this.taskbar.appendChild(linkElement);
        });
        
        // Insert taskbar at the beginning of body
        document.body.insertBefore(this.taskbar, document.body.firstChild);
    }
    
    attachScrollListener() {
        window.addEventListener("scroll", () => {
            let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollTop > this.lastScrollTop && currentScrollTop > 50) {
                // User is scrolling down - hide the navbar
                this.taskbar.style.top = "-100px";
            } else if (currentScrollTop < this.lastScrollTop) {
                // User is scrolling up - show the navbar
                this.taskbar.style.top = "0";
                this.taskbar.style.backgroundColor = "rgba(255,255,255,0.8)";
            }

            this.lastScrollTop = currentScrollTop;
        });
    }
    
    // Method to update links dynamically
    updateLinks(newLinks) {
        this.options.links = newLinks;
        // Clear current taskbar content
        this.taskbar.innerHTML = '';
        
        // Recreate content
        const beforeLogoLinks = this.options.links.slice(0, Math.ceil(this.options.links.length / 2));
        beforeLogoLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = link.text;
            linkElement.className = 'taskbarLink';
            this.taskbar.appendChild(linkElement);
        });
        
        const logo = document.createElement('img');
        logo.src = this.options.logoSrc;
        logo.alt = this.options.logoAlt;
        logo.className = 'taskbarLogo';
        this.taskbar.appendChild(logo);
        
        const afterLogoLinks = this.options.links.slice(Math.ceil(this.options.links.length / 2));
        afterLogoLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.href;
            linkElement.textContent = link.text;
            linkElement.className = 'taskbarLink';
            this.taskbar.appendChild(linkElement);
        });
    }
    
    // Method to show/hide taskbar
    show() {
        this.taskbar.style.top = "0";
    }
    
    hide() {
        this.taskbar.style.top = "-100px";
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