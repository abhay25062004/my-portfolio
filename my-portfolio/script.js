document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-in-out-cubic',
    });

    // Handle Navbar Scrolled State
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // Force small padding if user refreshes midway? No, logic depends.
            // Better logic:
            if(window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Run once on load to catch initial state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Animate Progress Bars on Scroll
    const progressBars = document.querySelectorAll('.custom-progress-bar');
    
    const animateProgress = () => {
        progressBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (barPosition < screenPosition - 50) {
                const target = bar.getAttribute('data-target');
                bar.style.width = target + '%';
            }
        });
    };

    // Run on both scroll and load
    window.addEventListener('scroll', animateProgress);
    // Add small delay for initial load if already in view
    setTimeout(animateProgress, 500);

    // Form submission validation (Bootstrap style)
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                
                // Show loading state
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                
                btn.innerHTML = 'Sending... <i class="bi bi-hourglass ms-2"></i>';
                btn.disabled = true;

                // Prepare EmailJS parameters
                const templateParams = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };

                // Send email using EmailJS API
                try {
                    emailjs.send("service_nxa95ls", "template_99t23we", templateParams)
                        .then(function(response) {
                            // Show success state
                            btn.innerHTML = 'Sent Successfully! <i class="bi bi-check-circle ms-2"></i>';
                            btn.classList.replace('btn-primary', 'btn-success');
                            btn.classList.replace('custom-btn-primary', 'custom-btn-success');
                            
                            form.reset();
                            form.classList.remove('was-validated');
                            
                            setTimeout(() => {
                                btn.innerHTML = originalText;
                                btn.classList.replace('btn-success', 'btn-primary');
                                btn.classList.replace('custom-btn-success', 'custom-btn-primary');
                                btn.disabled = false;
                            }, 3000);
                        }, function(error) {
                            // Show error state
                            console.error('EmailJS Error:', error);
                            const errorMsg = error.text || error.message || 'Unknown Error';
                            alert('EmailJS Error: ' + errorMsg); // Pop up for user to see
                            
                            btn.innerHTML = 'Failed: ' + (error.status || 'Error');
                            btn.classList.replace('btn-primary', 'btn-danger');
                            btn.classList.replace('custom-btn-primary', 'custom-btn-danger');
                            
                            setTimeout(() => {
                                btn.innerHTML = originalText;
                                btn.classList.replace('btn-danger', 'btn-primary');
                                btn.classList.replace('custom-btn-danger', 'custom-btn-primary');
                                btn.disabled = false;
                            }, 3000);
                        });
                } catch (error) {
                    // Synchronous error due to missing keys
                    console.error('Configuration Error:', error);
                    alert('Error: ' + error.message);
                    
                    // Reset button
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            }
            form.classList.add('was-validated');
        }, false);
    });
});
