
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCYceeUZ8Lo9OyYDQOTywSNbkY1S07WEAo",
    authDomain: "vybes-7f469.firebaseapp.com",
    projectId: "vybes-7f469",
    storageBucket: "vybes-7f469.appspot.com",
    messagingSenderId: "893505541777",
    appId: "1:893505541777:web:e958574cb342e3f023d130",
    measurementId: "G-6WSJJMN18K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchCardData() {
    const cardContainer = document.querySelector('.sliderb');
    
    
    try {
        console.log('Starting to fetch cards...');
        
        const cardsCollection = collection(db, "cards");
        console.log('Cards collection reference created');

        const querySnapshot = await getDocs(cardsCollection);
        console.log('Query snapshot received:', {
            empty: querySnapshot.empty,
            size: querySnapshot.size
        });
        
        const cardsData = [];
        querySnapshot.forEach((doc) => {
            
            
            cardsData.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        if (cardsData.length === 0) {
            cardContainer.innerHTML = 'No cards found in the database.';
            return;
        }
        
        renderCards(cardsData);
        
    } catch (error) {
        console.error("Error details:", {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        cardContainer.innerHTML = `Error loading cards: ${error.message}`;
    }
}

function renderCards(data) {
const cardContainer = document.querySelector('.sliderb');

// Clear any existing cards first, if necessary


data.forEach((card, index) => {
const cardElement = document.createElement('div');
cardElement.className = 'card';
cardElement.dataset.position = positions[index] || 'extra' + (index - positions.length + 1);

cardElement.innerHTML = `
    <img src="${card.image}" 
         alt="${card.title}" 
         onerror="this.src='https://via.placeholder.com/150?text=Image+Not+Found'">
    <div class="caption">
        <h3>${card.title}</h3>
        <p>${card.description}</p>
        <a href="${card.link}" target="_blank">Read More</a>
    </div>
`;
cardContainer.appendChild(cardElement);
});

// Now that cards are rendered, update the `cards` NodeList and reinitialize sliding
initializeSlider();
}

function initializeSlider() {
// Re-fetch the card elements
cards = document.querySelectorAll('.card');

// Reset positions if cards length is greater than initial positions array
if (cards.length > positions.length) {
let extraCount = cards.length - positions.length;
for (let i = 1; i <= extraCount; i++) {
    positions.push(`extra${i}`);
}
}

// Apply the default positions to the newly added cards
cards.forEach((card, index) => {
card.setAttribute('data-position', positions[index]);
});

// Add the sliding event listeners again
document.querySelector('.nex').addEventListener('click', () => {
moveSlide(1);
});

document.querySelector('.pre').addEventListener('click', () => {
moveSlide(-1);
});

// Re-enable touch events for swiping
let startX = 0;
let endX = 0;

document.querySelector('.sliderb').addEventListener('touchstart', (e) => {
startX = e.touches[0].clientX;
});

document.querySelector('.sliderb').addEventListener('touchend', (e) => {
endX = e.changedTouches[0].clientX;
if (startX > endX + 50) {
    moveSlide(1); // Swipe left to move right
} else if (startX < endX - 50) {
    moveSlide(-1); // Swipe right to move left
}
});

console.log('Slider initialized with new cards');
}

// Call this after the initial fetch
initializeSlider();



// Make fetchCardData available globally for the test button
window.testFetch = fetchCardData;

// Initial fetch
fetchCardData();