document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slides");
    const slides = document.querySelectorAll(".slide");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    if (!slider || slides.length === 0) {
        console.error("Slider or slides not found!");
        return;
    }

    let currentIndex = 0;
    let isDown = false;
    let startX, scrollLeft;

    function updateSliderPosition() {
        if (!slides[currentIndex]) {
            console.error("Slide index out of bounds:", currentIndex);
            return;
        }
        slider.style.transition = "transform 0.3s ease-in-out"; // Smooth transition
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function moveSlide(direction) {
        if (direction === "next" && currentIndex < slides.length - 1) {
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

        if (event.deltaY > 0) {
            moveSlide("next");
        } else if (event.deltaY < 0) {
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
        scrollLeft = currentIndex * 100; // Store current position
        slider.style.cursor = "grabbing";
        slider.style.transition = "none"; // Disable transition while dragging
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.style.cursor = "grab";
        slider.style.transition = "transform 0.3s ease-in-out"; // Re-enable transition
    });

    slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.style.cursor = "grab";
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        const x = e.pageX;
        const walk = (x - startX) / 5; // Adjust drag sensitivity
        if (walk > 20) {
            moveSlide("prev");
            isDown = false;
        } else if (walk < -20) {
            moveSlide("next");
            isDown = false;
        }
    });

    updateSliderPosition();

    window.moveSlide = moveSlide;
});
