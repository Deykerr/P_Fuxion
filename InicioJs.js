document.addEventListener('DOMContentLoaded', function () {
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    let productCards = document.querySelectorAll('.product-card');
    const realCardCount = productCards.length;
    let currentIndex = 0;
    let cardWidth = productCards[0].offsetWidth + 20; // Incluye margen
    let isTransitioning = false;
    let autoplayInterval;

    // Clonar tarjetas para efecto infinito
    function cloneCards() {
        // Clonar las primeras tarjetas y añadirlas al final
        for (let i = 0; i < 3; i++) {
            const clone = productCards[i].cloneNode(true);
            carouselTrack.appendChild(clone);
        }

        // Clonar las últimas tarjetas y añadirlas al inicio
        for (let i = realCardCount - 3; i < realCardCount; i++) {
            const clone = productCards[i].cloneNode(true);
            carouselTrack.insertBefore(clone, productCards[0]);
        }

        // Actualizar lista de tarjetas
        productCards = document.querySelectorAll('.product-card');
        currentIndex = realCardCount; // Empezar en la primera tarjeta real
        updateCarousel(false);
    }

    // Actualizar métricas
    function updateMetrics() {
        cardWidth = productCards[0].offsetWidth + 20;
    }

    // Mover carrusel
    function moveToIndex(index, animate = true) {
        if (isTransitioning) return;

        isTransitioning = true;
        currentIndex = index;
        updateCarousel(animate);

        // Resetear posición después de transición
        setTimeout(() => {
            isTransitioning = false;

            // Si llegamos al final de los clones, saltar al inicio real
            if (currentIndex >= productCards.length - 3) {
                currentIndex = realCardCount;
                updateCarousel(false);
            }

            // Si llegamos al inicio de los clones, saltar al final real
            if (currentIndex <= 0) {
                currentIndex = realCardCount;
                updateCarousel(false);
            }
        }, 600);
    }

    // Actualizar posición del carrusel
    function updateCarousel(animate = true) {
        carouselTrack.style.transition = animate ? 'transform 0.6s ease-in-out' : 'none';
        const offset = -currentIndex * cardWidth;
        carouselTrack.style.transform = `translateX(${offset}px)`;
        updateIndicators();
    }

    // Actualizar indicadores
    function updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        let activeIndicator = currentIndex % realCardCount;
        if (activeIndicator < 0) activeIndicator += realCardCount;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndicator);
        });
    }

    // Crear indicadores
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < realCardCount; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    // Ir a slide específico
    function goToSlide(index) {
        const diff = index - (currentIndex % realCardCount);
        moveToIndex(currentIndex + diff);
    }

    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            moveToIndex(currentIndex + 1);
        }, 3000);
    }

    // Event listeners
    function setupEventListeners() {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoplayInterval);
            moveToIndex(currentIndex - 1);
            setTimeout(startAutoplay, 10000);
        });

        nextBtn.addEventListener('click', () => {
            clearInterval(autoplayInterval);
            moveToIndex(currentIndex + 1);
            setTimeout(startAutoplay, 10000);
        });

        // Touch events
        let touchStartX = 0;
        let touchEndX = 0;

        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
            clearInterval(autoplayInterval);
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
            setTimeout(startAutoplay, 5000);
        }, { passive: true });

        function handleSwipe() {
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) {
                moveToIndex(currentIndex + 1);
            } else if (touchEndX > touchStartX + threshold) {
                moveToIndex(currentIndex - 1);
            }
        }

        // Redimensionamiento
        window.addEventListener('resize', () => {
            updateMetrics();
            updateCarousel(false);
        });
    }

    // Inicializar
    cloneCards();
    createIndicators();
    setupEventListeners();
    startAutoplay();
});

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Cerrar otros items abiertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Alternar el item actual
            item.classList.toggle('active');
        });
    });
});

// Actualizar año en el footer
document.addEventListener('DOMContentLoaded', function () {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});