document.addEventListener('DOMContentLoaded', () => {

    // 1. HAMBURGER MENU & NAVIGATION
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-menu a").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    // Active link highlighting on scroll
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-menu a");
    
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // 2. THEME SWITCHER
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
    }

    themeSwitcher.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        let theme = 'light-mode';
        if (body.classList.contains('dark-mode')) {
            theme = 'dark-mode';
        }
        localStorage.setItem('theme', theme);
    });

    // 3. TYPING EFFECT
    const typingText = document.getElementById('typing-text');
    const words = ["beautiful websites.", "automation scripts.", "intuitive user interfaces.", "engaging designs."];
    let wordIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < words[wordIndex].length) {
            typingText.textContent += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typingText.textContent = words[wordIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 500);
        }
    }
    
    if(typingText) {
        type();
    }
    
    // 4. INITIALIZE AOS (ANIMATE ON SCROLL)
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // 5. PARALLAX EFFECT FOR 'ABOUT ME' IMAGE
    const aboutImg = document.getElementById('about-img');
    // This effect is best on non-touch devices
    if (aboutImg && !window.matchMedia("(pointer: coarse)").matches) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (window.innerWidth / 2 - clientX) / 25;
            const y = (window.innerHeight / 2 - clientY) / 25;

            aboutImg.style.transform = `rotateY(${x / 2}deg) rotateX(${-y / 2}deg) translate(${x}px, ${y}px)`;
        });
    }

    // 6. SCROLL TO TOP BUTTON
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { // Show button after scrolling 300px
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // 7. SECTION TITLE ANIMATION OBSERVER
    const titles = document.querySelectorAll('.section-title');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px' // Trigger a bit before it's fully in view
    });

    titles.forEach(title => {
        observer.observe(title);
    });

  // 8. CURSOR TRAIL EFFECT
    // We only run this on devices that are not touch-based for a better experience
    if (!window.matchMedia("(pointer: coarse)").matches) {
        document.addEventListener('mousemove', (e) => {
            // Create a new div for the trail element
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);

            // Position the trail element at the cursor's coordinates
            // We use clientX/clientY because the element has fixed positioning
            trail.style.left = `${e.clientX}px`;
            trail.style.top = `${e.clientY}px`;

            // Remove the element after its animation finishes to keep the page clean
            setTimeout(() => {
                trail.remove();
            }, 500); // Matches the animation duration in the CSS (0.5s)
        });
    }

}); 
