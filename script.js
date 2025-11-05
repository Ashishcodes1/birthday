document.addEventListener('DOMContentLoaded', () => {

    // --- Audio Elements ---
    const bgMusic = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = muteBtn.querySelector('i');
    let isMuted = false;

    // --- Mute Button Logic ---
    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        bgMusic.muted = isMuted;
        if (isMuted) {
            muteIcon.classList.remove('fa-volume-up');
            muteIcon.classList.add('fa-volume-mute');
        } else {
            muteIcon.classList.remove('fa-volume-mute');
            muteIcon.classList.add('fa-volume-up');
        }
    });

    // --- Utility: Page Management ---
    const pages = document.querySelectorAll('.page');
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');

        // === NEW: Trigger animations when page is shown ===
        if (pageId === 'page-message') {
            animateNicknames();
        }
    }

    // --- Page 1: Intro - Animate Text ---
    const introTextElement = document.getElementById('intro-text');
    const introText = "To my one and only, my Chhoti Bacchi, my everything... click the heart to begin your surprise.❤️";
    
    function animateIntroText() {
        const words = introText.split(' ');
        introTextElement.innerHTML = ''; // Clear text
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word + ' ';
            wordSpan.classList.add('word');
            introTextElement.appendChild(wordSpan);

            setTimeout(() => {
                wordSpan.classList.add('visible');
            }, index * 150); // 150ms delay between words
        });
    }
    animateIntroText(); // Run on page load

    // --- Page 1: Heart Opener ---
    document.getElementById('heart-opener').addEventListener('click', () => {
        // === NEW: Play music on first interaction ===
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Audio play failed: " + e));
        }
        showPage('page-password');
    });

    // --- Page 2: Password ---
    const passwordCard = document.getElementById('password-card');
    const nicknameInput = document.getElementById('nickname-input');
    const submitNicknameBtn = document.getElementById('submit-nickname');
    const errorMessage = document.getElementById('error-message');
    const correctNickname = 'chhoti bacchi';

    submitNicknameBtn.addEventListener('click', checkNickname);
    nicknameInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            checkNickname();
        }
    });

    function checkNickname() {
        const answer = nicknameInput.value.trim().toLowerCase();
        if (answer === correctNickname) {
            showPage('page-cake');
            errorMessage.textContent = '';
        } else {
            errorMessage.textContent = 'Oops! Not quite right, my love. Try again? ❤️';
            nicknameInput.value = '';
            
            // === NEW: Trigger shake animation ===
            passwordCard.classList.add('shake');
            setTimeout(() => {
                passwordCard.classList.remove('shake');
            }, 500); // Must match animation duration
        }
    }

    // --- Page 3: Cake ---
    const cakeContainer = document.getElementById('cake-container');
    const leftHalf = document.getElementById('cake-left');
    const rightHalf = document.getElementById('cake-right');
    const cakeMessage = document.getElementById('cake-message');
    const cutPrompt = document.getElementById('cut-prompt');
    const confettiContainer = document.querySelector('.confetti-container');
    const cakeTitle = document.getElementById('cake-title');

    const confettiColors = ['#ff8fab', '#d6336c', '#ffb3c8', '#a6c1ee', '#fbc2eb'];

    function createConfetti(num) {
        for (let i = 0; i < num; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.setProperty('--confetti-color', confettiColors[Math.floor(Math.random() * confettiColors.length)]);
            confetti.style.setProperty('--start-x', `${(Math.random() - 0.5) * 200}px`);
            confetti.style.setProperty('--start-y', `${(Math.random() - 0.5) * 100}px`);
            confetti.style.setProperty('--end-x', `${(Math.random() - 0.5) * 400}px`);
            confetti.style.setProperty('--end-y', `${window.innerHeight / 2 + Math.random() * 200}px`);
            confetti.style.setProperty('--end-rot', `${Math.random() * 720}deg`);
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confettiContainer.appendChild(confetti);

            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    cakeContainer.addEventListener('click', () => {
        if (leftHalf.classList.contains('split')) return;

        leftHalf.classList.add('split');
        rightHalf.classList.add('split');
        cutPrompt.classList.add('hidden');
        cakeMessage.classList.add('show');
        createConfetti(50);
        cakeTitle.textContent = 'My wish came true!';
        cakeContainer.style.cursor = 'default';

        setTimeout(() => {
            showPage('page-message');

            setTimeout(() => {
                showPage('page-gallery');
                startCarouselAutoRotate();
            }, 8000); // 8 seconds on main message page

        }, 5000); // 5 seconds on split-cake message
    }, { once: true });


    // --- Page 4: Animate Nicknames ---
    function animateNicknames() {
        const nicknames = document.querySelectorAll('.nickname-item');
        nicknames.forEach((item, index) => {
            // Reset animation
            item.classList.remove('visible');
            
            // Trigger animation with a delay
            setTimeout(() => {
                item.classList.add('visible');
            }, (index + 1) * 500); // 500ms delay between each name
        });
    }


    // --- Page 5: Gallery - 3D Carousel ---
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const pauseIcon = pauseBtn.querySelector('i');

    const cells = document.querySelectorAll('.carousel-cell');
    let selectedIndex = 0;
    const cellCount = cells.length;
    const rotateAngle = 360 / cellCount;
    let autoRotateInterval;
    let isAutoRotating = true;

    function rotateCarousel() {
        const angle = selectedIndex * -rotateAngle;
        carousel.style.transform = `translateZ(-300px) rotateY(${angle}deg)`;
    }

    function startCarouselAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        
        autoRotateInterval = setInterval(() => {
            selectedIndex++;
            rotateCarousel();
        }, 3000);

        carousel.classList.add('auto-rotate');
        carousel.classList.remove('paused');
        pauseIcon.classList.remove('fa-play');
        pauseIcon.classList.add('fa-pause');
        isAutoRotating = true;
    }

    function stopCarouselAutoRotate() {
        clearInterval(autoRotateInterval);
        carousel.classList.remove('auto-rotate');
        carousel.classList.add('paused');
        pauseIcon.classList.remove('fa-pause');
        pauseIcon.classList.add('fa-play');
        isAutoRotating = false;
    }

    nextBtn.addEventListener('click', () => {
        stopCarouselAutoRotate();
        selectedIndex++;
        rotateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        stopCarouselAutoRotate();
        selectedIndex--;
        rotateCarousel();
    });

    pauseBtn.addEventListener('click', () => {
        if (isAutoRotating) {
            stopCarouselAutoRotate();
        } else {
            startCarouselAutoRotate();
        }
    });


    // --- Initial Load ---
    showPage('page-intro'); // Start on the intro page
});