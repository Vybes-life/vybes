const slider = document.querySelector('.slider');
const handle = document.querySelector('.handle');
const whiteLine = document.querySelector('.white-line');
const afterImage = document.querySelector('.after');
let isDragging = false;
let autoSlideInterval;
let autoSlideActive = true;

function moveSlider(xPosition) {
  const sliderWidth = slider.offsetWidth;
  const position = Math.min(Math.max(0, xPosition), sliderWidth);
  const percentage = (position / sliderWidth) * 100;
 
  handle.style.left = `${percentage}%`;
  whiteLine.style.left = `${percentage}%`;
  afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
}

// Drag functionality for mouse and touch
function startDrag(e) {
  isDragging = true;
  clearInterval(autoSlideInterval);
  autoSlideActive = false;
  if (e.cancelable) {
    e.preventDefault(); // Prevent image selection during drag
  }
}

function stopDrag() {
  if (isDragging) {
    isDragging = false;
    startAutoSlide();
  }
}

function duringDrag(e) {
  if (isDragging) {
    const rect = slider.getBoundingClientRect();
    let xPosition;
    if (e.touches) {
      // Handle touch event
      xPosition = e.touches[0].clientX - rect.left;
    } else {
      // Handle mouse event
      xPosition = e.clientX - rect.left;
    }
    moveSlider(xPosition);
  }
}

// Event listeners for mouse events
handle.addEventListener('mousedown', startDrag);
whiteLine.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', duringDrag);
window.addEventListener('mouseup', stopDrag);

// Event listeners for touch events (for mobile) with passive option
handle.addEventListener('touchstart', startDrag, { passive: false });
whiteLine.addEventListener('touchstart', startDrag, { passive: false });
window.addEventListener('touchmove', duringDrag, { passive: true });
window.addEventListener('touchend', stopDrag);

// Automatic sliding functionality
function startAutoSlide() {
  if (autoSlideActive) return; // Prevent restarting if already active
 
  let direction = 1;
  autoSlideInterval = setInterval(() => {
    let handlePosition = handle.offsetLeft + direction * 2; // Adjust speed
    if (handlePosition >= slider.offsetWidth || handlePosition <= 0) {
      direction *= -1; // Reverse direction
    }
   
    moveSlider(handlePosition);
  }, 50*Math.sqrt(design_width/custom_width)); // Adjust the speed of movement
  autoSlideActive = true;
}

// Stop auto-slide when user interacts
handle.addEventListener('mousedown', () => clearInterval(autoSlideInterval));
handle.addEventListener('touchstart', () => clearInterval(autoSlideInterval), { passive: true });
window.addEventListener('mouseup', startAutoSlide);
window.addEventListener('touchend', startAutoSlide);

// Start the auto-slide initially
startAutoSlide();
