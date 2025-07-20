/**
 * OrcaCat Taskbar Initialization Script
 * Simple initialization with custom configuration
 */

// Initialize taskbar with custom options
document.addEventListener('DOMContentLoaded', function() {
    // Custom configuration for your site
    const taskbarConfig = {
        logoSrc: 'assets/logo.png',
        logoAlt: 'OrcaCat Logo',
        links: [
            { text: 'HOME', href: 'home.html' },
            { text: 'ABOUT', href: 'about.html' },
            { text: 'PROJECTS', href: 'projects.html' },
            { text: 'BLOG', href: 'blog.html' }
        ],
        hideOnScroll: true,
        scrollThreshold: 50
    };

    // Initialize the taskbar
    window.orcaCatTaskbar = new OrcaCatTaskbar(taskbarConfig);

    // Optional: Add custom event listeners
    setupCustomTaskbarEvents();
});

function setupCustomTaskbarEvents() {
    // Example: Smooth scrolling for internal links
    document.addEventListener('click', function(e) {
        if (e.target.matches('.taskbar-link[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    // Example: Highlight active section on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const correspondingLink = document.querySelector(`.taskbar-link[href="#${id}"]`);
                
                // Remove active class from all links
                document.querySelectorAll('.taskbar-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current link
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe sections if they exist
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });
}

// Utility functions for taskbar management
window.TaskbarUtils = {
    // Update navigation links dynamically
    updateNavigation: function(newLinks) {
        if (window.orcaCatTaskbar) {
            window.orcaCatTaskbar.updateLinks(newLinks);
        }
    },

    // Change logo dynamically
    changeLogo: function(src, alt = 'Logo') {
        if (window.orcaCatTaskbar) {
            window.orcaCatTaskbar.setLogo(src, alt);
        }
    },

    // Show/hide taskbar programmatically
    showTaskbar: function() {
        if (window.orcaCatTaskbar) {
            window.orcaCatTaskbar.show();
        }
    },

    hideTaskbar: function() {
        if (window.orcaCatTaskbar) {
            window.orcaCatTaskbar.hide();
        }
    },

    // Get current taskbar instance
    getTaskbar: function() {
        return window.orcaCatTaskbar;
    }
};