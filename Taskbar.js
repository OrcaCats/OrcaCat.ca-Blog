let lastScrollTop = 0;
const navbar = document.getElementById("taskbar");

window.addEventListener("scroll", function() {
    let currentScrollTop = window.screenY || document.documentElement.scrollTop;

    if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
        // User is scrolling down - hide the navbar
        navbar.style.top = "-70px";
    } else if (currentScrollTop < lastScrollTop) {
        // User is scrolling up - show the navbar
        navbar.style.top = "0";
    }

    lastScrollTop = currentScrollTop;
});
