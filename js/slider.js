document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slides");
    const slideContainer = document.querySelector(".slider-container"); // Parent container
    const slides = document.querySelectorAll(".slide");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const paginationContainer = document.querySelector(".pagination");

    if (!slider || slides.length === 0 || !slideContainer || !paginationContainer) {
        console.error("Slider, slides, container, or pagination not found!");
        return;
    }

    let currentIndex = 0;
    let isDown = false;
    let startX, scrollLeft;
    const totalSlides = slides.length;

    // Create Pagination Dots
    slides.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.dataset.index = index;
        dot.addEventListener("click", () => goToSlide(index));
        paginationContainer.appendChild(dot);
    });

    function updateSliderPosition() {
        const slideWidth = slides[0].offsetWidth;
        const containerWidth = slideContainer.offsetWidth;
        const maxScroll = slider.scrollWidth - containerWidth;

        let translateX = -(currentIndex * slideWidth);
        if (-translateX > maxScroll) translateX = -maxScroll;

        slider.style.transition = "transform 0.6s ease-in-out";
        slider.style.transform = `translateX(${translateX}px)`;

        updateButtons();
        updatePagination();
    }

    function updateButtons() {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === totalSlides - 1;
    }

    function updatePagination() {
        document.querySelectorAll(".dot").forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentIndex = index;
        updateSliderPosition();
    }

    function moveSlide(direction) {
        if (direction === "next" && currentIndex < totalSlides - 1) {
            currentIndex++;
        } else if (direction === "prev" && currentIndex > 0) {
            currentIndex--;
        }
        updateSliderPosition();
    }

    prevButton.addEventListener("click", () => moveSlide("prev"));
    nextButton.addEventListener("click", () => moveSlide("next"));

    // Mouse Scroll (Wheel)
    slider.addEventListener("wheel", (event) => {
        event.preventDefault();
        event.deltaY > 0 ? moveSlide("next") : moveSlide("prev");
    });

    // Touch Swipe (Mobile)
    let touchStartX = 0;
    slider.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
    });

    slider.addEventListener("touchend", (event) => {
        let touchEndX = event.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) moveSlide("next");
        else if (touchEndX - touchStartX > 50) moveSlide("prev");
    });

    // Mouse Drag
    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX;
        scrollLeft = currentIndex * slides[0].offsetWidth;
        slider.style.cursor = "grabbing";
        slider.style.transition = "none";
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.style.cursor = "grab";
        slider.style.transition = "transform 0.3s ease-in-out";
    });

    slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.style.cursor = "grab";
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        const x = e.pageX;
        const walk = (x - startX) / 5;
        if (walk > 20) moveSlide("prev");
        else if (walk < -20) moveSlide("next");
        isDown = false;
    });

    updateSliderPosition();
});
