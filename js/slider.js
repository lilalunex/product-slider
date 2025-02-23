document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slides");
    const slideContainer = document.querySelector(".slider-container"); // Parent container
    const slides = document.querySelectorAll(".slide");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    if (!slider || slides.length === 0 || !slideContainer) {
        console.error("Slider, slides, or container not found!");
        return;
    }

    let currentIndex = 0;
    let isDown = false;
    let startX, scrollLeft;

    function updateSliderPosition() {
        const slideWidth = slides[0].offsetWidth;
        const containerWidth = slideContainer.offsetWidth;
        const maxScroll = slider.scrollWidth - containerWidth; // Max scroll distance

        let translateX = -(currentIndex * slideWidth);

        // Ensure we don't overscroll past the last slide
        if (-translateX > maxScroll) {
            translateX = -maxScroll;
        }

        slider.style.transition = "transform 0.6s ease-in-out";
        slider.style.transform = `translateX(${translateX}px)`;

        updateButtons();
    }

    function updateButtons() {
        const slideWidth = slides[0].offsetWidth;
        const containerWidth = slideContainer.offsetWidth;
        const maxScroll = slider.scrollWidth - containerWidth;

        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = Math.abs(currentIndex * slideWidth) >= maxScroll;
    }

    function moveSlide(direction) {
        const slideWidth = slides[0].offsetWidth;
        const containerWidth = slideContainer.offsetWidth;
        const maxScroll = slider.scrollWidth - containerWidth;

        if (direction === "next" && Math.abs(currentIndex * slideWidth) < maxScroll) {
            currentIndex++;
        } else if (direction === "prev" && currentIndex > 0) {
            currentIndex--;
        }

        updateSliderPosition();
    }

    prevButton.addEventListener("click", () => moveSlide("prev"));
    nextButton.addEventListener("click", () => moveSlide("next"));

    // Mouse Scroll Event (Wheel)
    slider.addEventListener("wheel", (event) => {
        event.preventDefault();

        const slideWidth = slides[0].offsetWidth;
        const containerWidth = slideContainer.offsetWidth;
        const maxScroll = slider.scrollWidth - containerWidth;

        if (event.deltaY > 0 && Math.abs(currentIndex * slideWidth) < maxScroll) {
            moveSlide("next");
        } else if (event.deltaY < 0 && currentIndex > 0) {
            moveSlide("prev");
        }
    });

    // Touch Swipe Event (Mobile)
    let touchStartX = 0;

    slider.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
    });

    slider.addEventListener("touchend", (event) => {
        let touchEndX = event.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) {
            moveSlide("next");
        } else if (touchEndX - touchStartX > 50) {
            moveSlide("prev");
        }
    });

    // Mouse Dragging
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

        const slideWidth = slides[0].offsetWidth;
        const containerWidth = slideContainer.offsetWidth;
        const maxScroll = slider.scrollWidth - containerWidth;

        if (walk > 20 && currentIndex > 0) {
            moveSlide("prev");
            isDown = false;
        } else if (walk < -20 && Math.abs(currentIndex * slideWidth) < maxScroll) {
            moveSlide("next");
            isDown = false;
        }
    });

    updateSliderPosition();
});
