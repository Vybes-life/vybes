// Initialize card elements
let cards = document.querySelectorAll('.card');

// Default positions for cards (visible and central)
let positions = ['left2', 'left1', 'active', 'right1', 'right2'];

// Add additional "extra" positions based on how many extra cards exist
if (cards.length > positions.length) {
    let extraCount = cards.length - positions.length;
    for (let i = 1; i <= extraCount; i++) {
        positions.push(`extra${i}`);
    }
}

// Function to update card positions based on the direction (next/prev)
function updatePositions(direction) {
    if (direction === 1) {
        // Move to the next slide, shift the last position to the front
        positions.unshift(positions.pop());
    } else if (direction === -1) {
        // Move to the previous slide, shift the first position to the end
        positions.push(positions.shift());
    }

    // Reapply the updated positions to the cards
    cards.forEach((card, index) => {
        card.setAttribute('data-position', positions[index]);
    });
}

// Function to handle both automatic and button-triggered sliding
function moveSlide(direction) {
    // Prevent rapid clicks from messing up transitions (debouncing)
    if (transitioning) return; // Exit if another slide transition is in progress
    transitioning = true;

    updatePositions(direction);

    // Wait for the transition to complete before allowing the next click
    setTimeout(() => {
        transitioning = false;
    }, 300); // Assuming 300ms for CSS transition
}

// Add event listeners for next and previous buttons
document.querySelector('.nex').addEventListener('click', () => {
    moveSlide(1); // Slide to the next card
});

document.querySelector('.pre').addEventListener('click', () => {
    moveSlide(-1); // Slide to the previous card
});

// Auto-slide every 5 seconds
setInterval(() => {
    moveSlide(1);
}, 5000);

// Variable to prevent button spam (debouncing)
let transitioning = false;
