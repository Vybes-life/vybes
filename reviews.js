const reviews = document.querySelectorAll('.review-grid1');
let currentIndex = 0;
let isAnimating = false;

function showReview(index, direction = 'right') {
    if (isAnimating) return;
    isAnimating = true;

    reviews.forEach((review, i) => {
        // Reset base styles
        review.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        review.style.position = 'absolute';
        review.style.width = '100%';
        review.style.opacity = '0';
        review.style.transform = 'scale(0.8)';
        review.style.filter = 'blur(5px)';

        if (i === index) {
            // Incoming review animation
            review.style.position = 'relative';
            review.style.opacity = '1';
            review.style.transform = 'scale(1)';
            review.style.filter = 'blur(0)';
            
            // Add a subtle bounce effect
            setTimeout(() => {
                review.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    review.style.transform = 'scale(1)';
                }, 150);
            }, 800);

            // Add a subtle glow effect
            review.style.animation = 'glow 2s ease-in-out infinite alternate';
        } else {
            // Set initial position based on direction
            if (direction === 'right') {
                // Moving right: old slides exit to left, new slides enter from right
                if (i === ((index - 1 + reviews.length) % reviews.length)) {
                    // Exiting slide moves left
                    review.style.transform = 'scale(0.8) translateX(-100%)';
                } else {
                    // Others wait on the right
                    review.style.transform = 'scale(0.8) translateX(100%)';
                }
            } else {
                // Moving left: old slides exit to right, new slides enter from left
                if (i === ((index + 1) % reviews.length)) {
                    // Exiting slide moves right
                    review.style.transform = 'scale(0.8) translateX(100%)';
                } else {
                    // Others wait on the left
                    review.style.transform = 'scale(0.8) translateX(-100%)';
                }
            }
        }
    });

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

// Add necessary CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .review-grid1 {
        backface-visibility: hidden;
        perspective: 1000px;
    }

    @keyframes glow {
        from {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
        }
        to {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }
    }
`;
document.head.appendChild(styleSheet);

// Next button - always moves right
document.querySelector('.next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % reviews.length;
    showReview(currentIndex, 'right');
});

// Previous button - moves left
document.querySelector('.prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    showReview(currentIndex, 'left');
});

// Swipe gesture support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - show previous
            currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
            showReview(currentIndex, 'left');
        } else {
            // Swipe left - show next
            currentIndex = (currentIndex + 1) % reviews.length;
            showReview(currentIndex, 'right');
        }
    }
}

// Auto slide always moves right
setInterval(() => {
    if (!isAnimating) {
        currentIndex = (currentIndex + 1) % reviews.length;
        showReview(currentIndex, 'right');
    }
}, 10000);

// Initialize the first review
showReview(currentIndex, 'right');