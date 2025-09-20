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
        let theme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        localStorage.setItem('theme', theme);
    });

    // 3. TYPING EFFECT
    const typingText = document.getElementById('typing-text');
    if (typingText) {
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
        if (window.pageYOffset > 300) {
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
    }, { rootMargin: '0px 0px -50px 0px' });
    titles.forEach(title => {
        observer.observe(title);
    });

    // 8. CURSOR TRAIL EFFECT
    if (!window.matchMedia("(pointer: coarse)").matches) {
        document.addEventListener('mousemove', (e) => {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            trail.style.left = `${e.clientX}px`;
            trail.style.top = `${e.clientY}px`;
            setTimeout(() => {
                trail.remove();
            }, 500);
        });
    }

    // 9. CUSTOM VIDEO MODAL (CORRECTED LOGIC)
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        const modalIframe = document.getElementById('video-iframe');
        const closeModalBtn = document.querySelector('.video-modal-close');
        
        document.querySelectorAll('.video-link').forEach(link => {
            // THIS IS THE FIX: Only apply the pop-up logic to Google Drive links
            if (link.href.includes('drive.google.com')) {
                link.addEventListener('click', function(event) {
                    event.preventDefault(); // Stop the link from opening a new tab
                    const videoUrl = this.getAttribute('href');
                    modalIframe.setAttribute('src', videoUrl);
                    videoModal.style.display = 'block';
                });
            }
            // All other links (like your mailto:) will now work normally.
        });

        const closeModal = () => {
            videoModal.style.display = 'none';
            modalIframe.setAttribute('src', ''); // Stop video from playing
        };

        closeModalBtn.addEventListener('click', closeModal);
        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) {
                closeModal();
            }
        });
    }

    // 10. 3D TILT EFFECT FOR CARDS
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = -y / 20; // Adjust divisor for sensitivity
            const rotateY = x / 20;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });

    // 11. MAGNETIC BUTTON EFFECT
    const magneticButton = document.querySelector('.magnetic-button');
    if (magneticButton) {
        const wrapper = document.querySelector('.magnetic-wrapper');
        wrapper.addEventListener('mousemove', function(e) {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            magneticButton.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        wrapper.addEventListener('mouseleave', function() {
            magneticButton.style.transform = 'translate(0, 0)';
        });
    }
// 12. POP-UP CONTACT FORM LOGIC
    const body = document.body;
    const hireBtn = document.querySelector("#hireBtn");
    const closeBtns = document.querySelectorAll("#closeBtn");
    const contactForm = document.getElementById('popup-contact-form');
    
    if (hireBtn) {
        hireBtn.addEventListener("click", () => {
            body.classList.add("show-popup");
        });
    }

    if (closeBtns) {
        closeBtns.forEach(cBtn => {
            cBtn.addEventListener("click", () => {
                body.classList.remove("show-popup");
            });
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop the default form submission

            // --- IMPORTANT: PASTE YOUR WEB APP URL HERE ---
            const scriptURL = 'https://script.google.com/macros/s/AKfycbyB2LIOd048NAela6PxQtM7UFah9i-giu1Ptev-wQE2fDWkJbRD3zQmi7_AP2r9CrE6/exec'; 
            const form = e.target;
            const sendButton = form.querySelector('.send');
            
            sendButton.disabled = true;
            sendButton.textContent = 'Sending...';

            const formData = {
                email: form.email.value,
                message: form.message.value
            };

            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(formData),
                mode: 'no-cors', // Required for simple POST requests to Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(() => {
                // Since 'no-cors' mode prevents reading the response, we assume success
                alert('Message sent successfully! Thank you.');
                body.classList.remove("show-popup");
                form.reset();
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('An error occurred. Please try again later.');
            })
            .finally(() => {
                sendButton.disabled = false;
                sendButton.textContent = 'Send';
            });
        });
    }
});



