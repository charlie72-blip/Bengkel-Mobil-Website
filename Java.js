// ========================================
// MOBILE MENU TOGGLE
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
    }
});

// ========================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all service cards, why-us cards, and contact cards
document.querySelectorAll('.service-card, .why-us-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================
const bookingForm = document.getElementById('bookingForm');
const bookingConfirmation = document.getElementById('bookingConfirmation');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const vehicle = document.getElementById('vehicle').value.trim();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Validation
    if (!name) {
        showAlert('Nama lengkap harus diisi!', 'error');
        return;
    }

    if (!isValidPhone(phone)) {
        showAlert('Nomor telepon tidak valid! (Minimal 10 angka)', 'error');
        return;
    }

    if (!vehicle) {
        showAlert('Jenis kendaraan harus diisi!', 'error');
        return;
    }

    if (!service) {
        showAlert('Pilih jenis layanan!', 'error');
        return;
    }

    if (!date) {
        showAlert('Tanggal servis harus dipilih!', 'error');
        return;
    }

    if (!time) {
        showAlert('Waktu servis harus dipilih!', 'error');
        return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showAlert('Tanggal servis tidak boleh di masa lalu!', 'error');
        return;
    }

    // Validate time is within business hours
    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 8 || hours >= 18) {
        showAlert('Waktu servis harus antara 08:00 - 18:00!', 'error');
        return;
    }

    // Prepare WhatsApp message
    const formattedDate = new Date(date).toLocaleDateString('id-ID');
    const whatsappMessage = encodeURIComponent(
        `Halo, saya ingin melakukan pemesanan servis:\n\n` +
        `Nama: ${name}\n` +
        `Nomor Telepon: ${phone}\n` +
        `Jenis Kendaraan: ${vehicle}\n` +
        `Layanan: ${service}\n` +
        `Tanggal: ${formattedDate}\n` +
        `Waktu: ${time}\n\n` +
        `Terima kasih.`
    );

    // Send to WhatsApp
    const whatsappURL = `https://wa.me/6282112345678?text=${whatsappMessage}`;

    // Show success message
    showBookingSuccess();

    // Reset form
    bookingForm.reset();

    // Open WhatsApp after delay
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 1000);
});

// Validation helper: Phone number
function isValidPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
}

// Show booking success
function showBookingSuccess() {
    bookingForm.style.display = 'none';
    bookingConfirmation.style.display = 'block';
    bookingConfirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Reset after 3 seconds
    setTimeout(() => {
        bookingForm.style.display = 'block';
        bookingConfirmation.style.display = 'none';
    }, 3000);
}

// Custom alert function with styling
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInDown 0.3s ease;
        max-width: 90%;
    `;

    if (type === 'error') {
        alertDiv.style.backgroundColor = '#fee2e2';
        alertDiv.style.color = '#991b1b';
        alertDiv.style.border = '2px solid #fca5a5';
    } else if (type === 'success') {
        alertDiv.style.backgroundColor = '#dcfce7';
        alertDiv.style.color = '#166534';
        alertDiv.style.border = '2px solid #86efac';
    } else {
        alertDiv.style.backgroundColor = '#dbeafe';
        alertDiv.style.color = '#1e40af';
        alertDiv.style.border = '2px solid #93c5fd';
    }

    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// ========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========================================
// HIGHLIGHT ACTIVE NAV LINK ON SCROLL
// ========================================
window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ========================================
// DATE INPUT - SET MINIMUM DATE
// ========================================
const dateInput = document.getElementById('date');
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const minDate = `${year}-${month}-${day}`;
dateInput.setAttribute('min', minDate);

// ========================================
// SERVICE SELECTION ANIMATION
// ========================================
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// ========================================
// LAZY LOADING PLACEHOLDER
// ========================================
if ('IntersectionObserver' in window) {
    console.log('✓ Website loaded successfully!');
    console.log('✓ Intersection Observer enabled for animations');
    console.log('✓ Form validation active');
    console.log('✓ Responsive design implemented');
}

// ========================================
// UTILITY: Add slideInDown animation if not in CSS
// ========================================
if (!document.querySelector('style[data-animation]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animation', 'true');
    style.innerHTML = `
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideOutUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }

        .nav-link.active {
            color: var(--secondary-color);
        }
    `;
    document.head.appendChild(style);
}
