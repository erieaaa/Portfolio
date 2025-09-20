document.addEventListener('DOMContentLoaded', () => {
    // All existing code (sections 1 through 11 for nav, theme, modals, etc.) should be here...

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
            e.preventDefault();

            // --- IMPORTANT: PASTE YOUR WEB APP URL HERE ---
            const scriptURL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; 
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
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(() => {
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
