let lastScrollTop = 0;
const navbar = document.getElementById("taskbar");

window.addEventListener("scroll", function() {
    let currentScrollTop = window.screenYOffset || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
        // User is scrolling down - hide the navbar
        navbar.style.top = "-100px";
    } else if (currentScrollTop < lastScrollTop) {
        // User is scrolling up - show the navbar
        navbar.style.top = "0";
        navbar.style.backgroundColor="rgba(255,255,255,0.8)";
    }

    lastScrollTop = currentScrollTop;
});
