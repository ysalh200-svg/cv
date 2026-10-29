/* Menu Button - show/hide */
const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');

menuButton.addEventListener('click', () => {
    menu.classList.toggle('show');
});


/* Go To Top */
const topButton = document.getElementById('topButton');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        topButton.style.display = 'block';
    } else {
        topButton.style.display = 'none';
    }
});

topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* Carousel / Slideshow */
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName('mySlides');
    const dots = document.getElementsByClassName('dot');
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' active', '');
    }
    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += ' active';
}


/* Visitor Counter */
let visitorCount = localStorage.getItem('visitorCount');
visitorCount = visitorCount ? parseInt(visitorCount) + 1 : 1;
localStorage.setItem('visitorCount', visitorCount);
document.getElementById('visitorCount').textContent = visitorCount;


/* Contact Form - verified with the pattern attribute, sanitized here,
   values stored in variables for future use */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

let userName = '';
let userEmail = '';
let userPhone = '';
let userMessage = '';

function sanitize(text) {
    return text.replace(/<[^>]*>/g, '').trim();
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        formStatus.textContent = 'Please fix the highlighted fields.';
        return;
    }

    userName = sanitize(document.getElementById('name').value);
    userEmail = sanitize(document.getElementById('email').value);
    userPhone = sanitize(document.getElementById('phone').value);
    userMessage = sanitize(document.getElementById('message').value);

    console.log(userName, userEmail, userPhone, userMessage);

    formStatus.textContent = 'Thanks, ' + userName + '! Your message has been received.';

    contactForm.reset();
});

/* Bangkok clock - Fetch API */
const clockTime = document.getElementById('clockTime');
const clockNote = document.getElementById('clockNote');
let clockBase = null;
let clockFetchedAt = 0;

function showClock() {
    // Keep the clock running between API requests.
    const now = clockBase === null ? new Date() : new Date(clockBase + (Date.now() - clockFetchedAt));
    clockTime.textContent = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }).format(now);
}

async function fetchClock() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Bangkok');
        if (!response.ok) throw new Error('API unavailable');
        const data = await response.json();
        // unixtime is in seconds since epoch.
        if (typeof data.unixtime !== 'number') throw new Error('Invalid API data');
        clockBase = data.unixtime * 1000;
        clockFetchedAt = Date.now();
        clockNote.textContent = 'Live time synced with Fetch API';
    } catch (error) {
        clockNote.textContent = 'API unavailable: showing Bangkok time from your device';
    }
    showClock();
}

showClock();
fetchClock();
setInterval(showClock, 1000);
setInterval(fetchClock, 60000);
