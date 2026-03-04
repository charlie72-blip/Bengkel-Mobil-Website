const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

function closeMenu() {
    if (!navMenu || !hamburger) {
        return;
    }

    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.navbar')) {
            closeMenu();
        }
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

const revealTargets = document.querySelectorAll('[data-reveal], .service-card, .why-us-card, .contact-card, .testimonial-card, .gallery-item');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    revealTargets.forEach((element) => revealObserver.observe(element));
} else {
    revealTargets.forEach((element) => element.classList.add('fade-in'));
}

const bookingForm = document.getElementById('bookingForm');
const bookingConfirmation = document.getElementById('bookingConfirmation');
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('input', () => {
        const cleaned = phoneInput.value.replace(/[^\d+\s()-]/g, '');
        if (cleaned !== phoneInput.value) {
            phoneInput.value = cleaned;
        }
    });
}

if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name')?.value.trim() || '';
        const phone = document.getElementById('phone')?.value.trim() || '';
        const vehicle = document.getElementById('vehicle')?.value.trim() || '';
        const serviceSelect = document.getElementById('service');
        const service = serviceSelect?.value || '';
        const serviceLabel = serviceSelect?.selectedOptions[0]?.textContent || '';
        const date = document.getElementById('date')?.value || '';
        const time = document.getElementById('time')?.value || '';
        const notes = document.getElementById('notes')?.value.trim() || '';
        const normalizedPhone = normalizePhone(phone);

        if (!name) {
            showAlert('Nama lengkap wajib diisi.', 'error');
            return;
        }

        if (!isValidPhone(phone)) {
            showAlert('Nomor telepon tidak valid. Gunakan format 0812xxxxxxx atau +62812xxxxxxx.', 'error');
            return;
        }

        if (!vehicle) {
            showAlert('Jenis kendaraan wajib diisi.', 'error');
            return;
        }

        if (!service) {
            showAlert('Silakan pilih jenis layanan.', 'error');
            return;
        }

        if (!date) {
            showAlert('Tanggal servis wajib dipilih.', 'error');
            return;
        }

        if (!time) {
            showAlert('Waktu servis wajib dipilih.', 'error');
            return;
        }

        const selectedDate = new Date(`${date}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showAlert('Tanggal servis tidak boleh di masa lalu.', 'error');
            return;
        }

        const [hoursStr, minutesStr] = time.split(':');
        const hours = Number(hoursStr);
        const minutes = Number(minutesStr);
        const totalMinutes = (hours * 60) + minutes;
        if (Number.isNaN(totalMinutes) || totalMinutes < 480 || totalMinutes >= 1080) {
            showAlert('Waktu servis hanya tersedia antara 08:00 - 18:00.', 'error');
            return;
        }

        const formattedDate = selectedDate.toLocaleDateString('id-ID');
        const whatsappMessage = encodeURIComponent(
            `Halo ProAuto, saya ingin booking servis.\n\n` +
            `Nama: ${name}\n` +
            `Nomor Telepon: ${normalizedPhone}\n` +
            `Kendaraan: ${vehicle}\n` +
            `Layanan: ${serviceLabel}\n` +
            `Tanggal: ${formattedDate}\n` +
            `Waktu: ${time}\n` +
            `${notes ? `Catatan: ${notes}\n` : ''}\n` +
            `Mohon konfirmasi jadwalnya. Terima kasih.`
        );

        const whatsappURL = `https://wa.me/6282112345678?text=${whatsappMessage}`;

        showBookingSuccess();
        bookingForm.reset();
        showAlert('Booking berhasil dibuat. WhatsApp akan dibuka.', 'success');

        setTimeout(() => {
            window.open(whatsappURL, '_blank', 'noopener');
        }, 800);
    });
}

function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (!digits) {
        return false;
    }

    if (digits.startsWith('0')) {
        return digits.length >= 10 && digits.length <= 13;
    }

    if (digits.startsWith('62')) {
        return digits.length >= 11 && digits.length <= 14;
    }

    if (digits.startsWith('8')) {
        return digits.length >= 9 && digits.length <= 12;
    }

    return digits.length >= 10 && digits.length <= 15;
}

function normalizePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (!digits) {
        return '';
    }

    if (digits.startsWith('62')) {
        return `+${digits}`;
    }

    if (digits.startsWith('0')) {
        return `+62${digits.slice(1)}`;
    }

    if (digits.startsWith('8')) {
        return `+62${digits}`;
    }

    return `+${digits}`;
}

function showBookingSuccess() {
    if (!bookingForm || !bookingConfirmation) {
        return;
    }

    bookingForm.style.display = 'none';
    bookingConfirmation.style.display = 'block';
    bookingConfirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        bookingForm.style.display = 'block';
        bookingConfirmation.style.display = 'none';
    }, 3500);
}

function showAlert(message, type = 'info') {
    const oldAlert = document.querySelector('.form-alert');
    if (oldAlert) {
        oldAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `form-alert ${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'alertSlideUp 0.22s ease forwards';
        setTimeout(() => alert.remove(), 220);
    }, 2600);
}

const dateInput = document.getElementById('date');
if (dateInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', `${year}-${month}-${day}`);
}

const timeInput = document.getElementById('time');
if (timeInput) {
    timeInput.setAttribute('min', '08:00');
    timeInput.setAttribute('max', '17:59');
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function onClick(event) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') {
            return;
        }

        const target = document.querySelector(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const sections = Array.from(document.querySelectorAll('header[id], section[id]'));

function updateActiveNav() {
    let currentId = '';

    sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (window.scrollY >= top - 180 && window.scrollY < top + height - 180) {
            currentId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const target = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('active', target === currentId);
    });
}

function updateNavbarState() {
    if (!navbar) {
        return;
    }

    if (window.scrollY > 8) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}

function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

const onScroll = debounce(() => {
    updateActiveNav();
    updateNavbarState();
}, 60);

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('load', () => {
    updateActiveNav();
    updateNavbarState();
});
