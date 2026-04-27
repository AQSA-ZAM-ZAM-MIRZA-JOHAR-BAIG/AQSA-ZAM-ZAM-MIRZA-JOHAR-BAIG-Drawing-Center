document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Sidebar Toggle ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const navLinks = document.querySelectorAll('.sidebar-nav ul li a');

    // Open Sidebar
    if(sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    // Close Sidebar
    if(sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Close Sidebar when a link is clicked (Mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // --- Scrollspy (Active link highlighting) ---
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.icon');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    const otherIcon = otherItem.querySelector('.icon');
                    if(otherIcon) {
                        otherIcon.classList.remove('fa-minus');
                        otherIcon.classList.add('fa-plus');
                    }
                }
            });
            
            // Toggle current item
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                if(icon) {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
                if(icon) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
            }
        });
    });
    // --- Number Counter Animation (Hero Stats) ---
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower

    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Use Intersection Observer to start animation when hero is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection && counters.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.disconnect(); // Only run once
            }
        }, { threshold: 0.5 });
        
        observer.observe(heroSection);
    }

    // --- Testimonials Slider ---
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (track && prevBtn && nextBtn) {
        const cards = track.querySelectorAll('.testimonial-card');
        const visibleCards = 2;
        let currentIndex = 0;
        const maxIndex = cards.length - visibleCards;

        const updateSlider = () => {
            const cardWidth = cards[0].offsetWidth + 30; // card width + gap
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        };

        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            } else {
                currentIndex = 0;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            } else {
                currentIndex = maxIndex;
                updateSlider();
            }
        });

        // Auto-advance slider every 5 seconds
        setInterval(() => {
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 5000);
    }

    // --- Gallery Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            masonryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.classList.remove('hide');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.classList.add('hide');
                    }, 300);
                }
            });
        });
    });
});

// --- Lightbox Functions (Global Scope) ---
function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const img = element.querySelector('img');

    lightbox.style.display = 'flex';
    // Small delay to allow display block to render before animating opacity
    setTimeout(() => {
        lightbox.classList.add('show');
    }, 10);
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt; // Uses the rich SEO alt text as caption
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('show');
    setTimeout(() => {
        lightbox.style.display = 'none';
    }, 300);
}

// Close lightbox on clicking outside the image
document.addEventListener('click', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// --- Contact Form Submission ---
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Get form data
        const formData = {
            name: document.getElementById('cf-name').value.trim(),
            email: document.getElementById('cf-email').value.trim(),
            phone: document.getElementById('cf-phone').value.trim(),
            subject: document.getElementById('cf-subject').value,
            message: document.getElementById('cf-message').value.trim(),
            timestamp: new Date().toISOString()
        };
        
        // Clear previous messages
        formMessage.style.display = 'none';
        formMessage.innerHTML = '';
        
        // Validate form
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate name length
        if (formData.name.length < 2) {
            showFormMessage('Name must be at least 2 characters long.', 'error');
            return;
        }
        
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Validate message length
        if (formData.message.length < 10) {
            showFormMessage('Message must be at least 10 characters long.', 'error');
            return;
        }
        
        try {
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Log the form data to console
            console.log('Contact Form Submitted:', formData);
            
            // Simulate API call (replace with actual backend endpoint)
            // Example: 
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            // const result = await response.json();
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showFormMessage('Thank you! Your message has been sent. AQSA ZAM ZAM MIRZA JOHAR BAIG will respond soon.', 'success');
            
            // Update button to show success
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.backgroundColor = 'var(--primary-color)';
            
            // Clear form
            contactForm.reset();
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
            }, 3000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('An error occurred. Please try again later.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
    
    // Helper function to show form messages
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.className = `form-message ${type}`;
            formMessage.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            formMessage.style.display = 'flex';
            
            // Auto-hide error messages after 5 seconds
            if (type === 'error') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }
}

// --- Form field validation on input ---
const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-color)';
    });
    input.addEventListener('blur', function() {
        this.style.borderColor = 'var(--border-color)';
    });
});

// --- Newsletter Form Submission ---
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const input = newsletterForm.querySelector('input[type="email"]');
        const button = newsletterForm.querySelector('button');
        const originalButtonHTML = button.innerHTML;
        const email = input.value.trim();
        
        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            button.style.color = '#f44336';
            setTimeout(() => {
                button.style.color = 'var(--primary-color)';
            }, 2000);
            return;
        }
        
        try {
            // Show loading state
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate API call
            console.log('Newsletter subscription:', { email });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.color = '#4caf50';
            
            // Clear input
            input.value = '';
            
            // Reset button
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalButtonHTML;
                button.style.color = 'var(--primary-color)';
            }, 2000);
            
        } catch (error) {
            console.error('Newsletter error:', error);
            button.disabled = false;
            button.innerHTML = originalButtonHTML;
        }
    });
}
