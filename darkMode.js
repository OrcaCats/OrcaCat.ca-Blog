// Dark Mode Drop-in Component
// Usage: Just include this script with <script src="darkmode.js"></script>

(function() {
    'use strict';

    // Dark Mode CSS - injected automatically
    const darkModeCSS = `
        /* Dark Mode CSS Variables */
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --primary-color: #667eea;
            --secondary-color: #764ba2;
            --text-primary: #2c3e50;
            --text-secondary: #6c757d;
            --text-muted: #666;
            --background-light: #f8f9fa;
            --background-white: #ffffff;
            --card-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            --card-shadow-hover: 0 15px 40px rgba(0, 0, 0, 0.15);
            --border-radius: 12px;
            --border-radius-small: 5px;
            --transition: all 0.3s ease;
            --border-color: #e9ecef;
            --skill-tag-bg: #f8f9fa;
            --input-bg: #ffffff;
            --hover-bg: #f8f9fa;
        }

        [data-theme="dark"] {
            --text-primary: #e8e6f0;
            --text-secondary: #a8a2b8;
            --text-muted: #d2cedc;
            --background-light: #2d2a3a;
            --background-white: #1a1725;
            --card-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
            --card-shadow-hover: 0 15px 40px rgba(0, 0, 0, 0.6);
            --border-color: #3d3748;
            --skill-tag-bg: #3d3748;
            --input-bg: #2d2a3a;
            --hover-bg: #3d3748;
        }

        /* Universal Dark Mode Transitions */
        *, *::before, *::after {
            transition: background-color var(--transition), 
                        color var(--transition), 
                        border-color var(--transition),
                        box-shadow var(--transition);
        }

        /* Base elements that automatically adapt */
        body, html {
            background-color: var(--background-white);
            color: var(--text-primary);
        }

        h1, h2, h3, h4, h5, h6 {
            color: var(--text-primary);
        }

        p {
            color: var(--text-muted);
        }

        /* Auto-adapting elements */
        .card,
        .section,
        .container,
        [class*="card"]:not(.theme-toggle),
        [class*="section"]:not([class*="header"]) {
            background-color: var(--background-white);
            border-color: var(--border-color);
        }

        /* Form elements */
        input, textarea, select {
            background-color: var(--input-bg);
            color: var(--text-primary);
            border-color: var(--border-color);
        }

        input:focus, textarea:focus, select:focus {
            border-color: var(--primary-color);
        }

        /* Buttons */
        button:not(.theme-toggle) {
            background-color: var(--background-white);
            color: var(--text-primary);
            border-color: var(--border-color);
        }

        button:hover:not(.theme-toggle) {
            background-color: var(--hover-bg);
        }

        /* Links */
        a {
            color: var(--primary-color);
        }

        a:hover {
            color: var(--secondary-color);
        }

        /* Dark Mode Toggle Styles - LEFT SIDE WITH GLOW */
        .theme-toggle {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: var(--background-white);
            border: 2px solid var(--border-color);
            border-radius: 50px;
            padding: 8px;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: var(--card-shadow);
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
        }

        /* Light mode hover glow */
        .theme-toggle:hover {
            box-shadow: var(--card-shadow-hover), 0 0 20px rgba(102, 126, 234, 0.3);
            transform: scale(1.05);
        }

        /* Light mode focus glow */
        .theme-toggle:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
            box-shadow: var(--card-shadow), 0 0 25px rgba(102, 126, 234, 0.4);
        }

        /* Dark mode base glow */
        [data-theme="dark"] .theme-toggle {
            box-shadow: var(--card-shadow), 0 0 15px rgba(102, 126, 234, 0.2);
        }

        /* Dark mode hover glow */
        [data-theme="dark"] .theme-toggle:hover {
            box-shadow: var(--card-shadow-hover), 0 0 25px rgba(102, 126, 234, 0.4);
            transform: scale(1.05);
        }

        /* Dark mode focus glow */
        [data-theme="dark"] .theme-toggle:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
            box-shadow: var(--card-shadow), 0 0 30px rgba(102, 126, 234, 0.5);
        }

        .theme-toggle-inner {
            position: relative;
            width: 50px;
            height: 24px;
            background: var(--primary-gradient);
            border-radius: 50px;
            transition: var(--transition);
        }

        .theme-toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }

        [data-theme="dark"] .theme-toggle-slider {
            transform: translateX(26px);
        }

        /* Dark mode image filters */
        [data-theme="dark"] .club-icon-img,
        [data-theme="dark"] .interest-icon-img,
        [data-theme="dark"] img[class*="icon"] {
            filter: brightness(0.9) contrast(1.1);
        }

        /* Responsive adjustments - LEFT SIDE */
        @media (max-width: 768px) {
            .theme-toggle {
                top: 15px;
                left: 15px;
                padding: 6px;
            }

            .theme-toggle-inner {
                width: 40px;
                height: 20px;
            }

            .theme-toggle-slider {
                width: 16px;
                height: 16px;
            }

            [data-theme="dark"] .theme-toggle-slider {
                transform: translateX(20px);
            }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            .theme-toggle,
            .theme-toggle-inner,
            .theme-toggle-slider {
                transition: none !important;
            }
        }

        /* Focus styles */
        [class*="card"]:focus-within {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
    `;

    // Dark Mode Toggle HTML
    const toggleHTML = `
        <button class="theme-toggle" aria-label="Toggle dark mode">
            <div class="theme-toggle-inner">
                <div class="theme-toggle-slider">
                    <span class="theme-icon">🌙</span>
                </div>
            </div>
        </button>
    `;

    // Dark Mode Functionality
    function toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        
        // Update toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
        
        // Save theme preference to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Add subtle animation feedback
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggle.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // Initialize theme
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        document.body.setAttribute('data-theme', initialTheme);
        
        // Update toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = initialTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Listen for system theme changes
    function setupSystemThemeListener() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.body.setAttribute('data-theme', newTheme);
                const themeIcon = document.querySelector('.theme-icon');
                if (themeIcon) {
                    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
                }
            }
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Toggle click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                e.preventDefault();
                toggleTheme();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.theme-toggle') && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    // Inject CSS
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = darkModeCSS;
        document.head.appendChild(style);
    }

    // Inject HTML
    function injectHTML() {
        const toggleElement = document.createElement('div');
        toggleElement.innerHTML = toggleHTML;
        document.body.appendChild(toggleElement.firstElementChild);
    }

    // Initialize everything
    function init() {
        // Inject CSS first
        injectCSS();
        
        // Inject HTML toggle
        injectHTML();
        
        // Initialize theme
        initializeTheme();
        
        // Setup listeners
        setupEventListeners();
        setupSystemThemeListener();
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose global functions for manual usage if needed
    window.toggleTheme = toggleTheme;
    window.initializeTheme = initializeTheme;

})();