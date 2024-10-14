let currentImageIndex = 0;
let currentThumbnailSet = 0;
const mainImg = document.getElementById("main-img");
const thumbnailList = document.getElementById("thumbnail-list");
const beforeImg = document.getElementById('before-img');
const afterImg = document.getElementById('after-img');

let c_width = document.body.clientWidth;
let d_width = 1440;
let r = c_width / d_width;

const thumbnailSets = [
  [
    "https://picsum.photos/200/300?random=1", 
    "https://picsum.photos/200/300?random=2",
    "https://picsum.photos/200/300?random=3",
    "https://picsum.photos/200/300?random=4",
    "https://picsum.photos/200/300?random=5",
    "https://picsum.photos/200/300?random=6",
    "https://picsum.photos/200/300?random=7",
    "https://picsum.photos/200/300?random=8",
    "https://picsum.photos/200/300?random=9",
    "https://picsum.photos/200/300?random=10",
    "https://picsum.photos/200/300?random=11",
    "https://picsum.photos/200/300?random=12",
    "https://picsum.photos/200/300?random=13",
    "https://picsum.photos/200/300?random=14", 
    "https://picsum.photos/200/300?random=15",
    "https://picsum.photos/200/300?random=16",
    "https://picsum.photos/200/300?random=17",
    "https://picsum.photos/200/300?random=18",
    "https://picsum.photos/200/300?random=19",
    "https://picsum.photos/200/300?random=20",
    "https://picsum.photos/200/300?random=21"
  ],
  [
    "https://picsum.photos/200/300?random=22", 
    "https://picsum.photos/200/300?random=23",
    "https://picsum.photos/200/300?random=24",
    "https://picsum.photos/200/300?random=25",
    "https://picsum.photos/200/300?random=26",
    "https://picsum.photos/200/300?random=27",
    "https://picsum.photos/200/300?random=28",
    "https://picsum.photos/200/300?random=29",
    "https://picsum.photos/200/300?random=30",
    "https://picsum.photos/200/300?random=31",
    "https://picsum.photos/200/300?random=32",
    "https://picsum.photos/200/300?random=33",
    "https://picsum.photos/200/300?random=34",
    "https://picsum.photos/200/300?random=35",
    "https://picsum.photos/200/300?random=36",
    "https://picsum.photos/200/300?random=37",
    "https://picsum.photos/200/300?random=38",
    "https://picsum.photos/200/300?random=39",
    "https://picsum.photos/200/300?random=40",
    "https://picsum.photos/200/300?random=41",
    "https://picsum.photos/200/300?random=42" 
    // ... (rest of t2 array)
  ],
  [
    "https://picsum.photos/200/300?random=43", 
    "https://picsum.photos/200/300?random=44",
    "https://picsum.photos/200/300?random=45",
    "https://picsum.photos/200/300?random=46",
    "https://picsum.photos/200/300?random=47",
    "https://picsum.photos/200/300?random=48",
    "https://picsum.photos/200/300?random=49",
    "https://picsum.photos/200/300?random=50",
    "https://picsum.photos/200/300?random=51",
    "https://picsum.photos/200/300?random=52",
    "https://picsum.photos/200/300?random=53",
    "https://picsum.photos/200/300?random=54",
    "https://picsum.photos/200/300?random=55",
    "https://picsum.photos/200/300?random=56",
    "https://picsum.photos/200/300?random=57",
    "https://picsum.photos/200/300?random=58",
    "https://picsum.photos/200/300?random=59",
    "https://picsum.photos/200/300?random=60",
    "https://picsum.photos/200/300?random=61",
    "https://picsum.photos/200/300?random=62",
    "https://picsum.photos/200/300?random=63"
    // ... (rest of t3 array)
  ]
];



const topTexts = [
    "BREATHTAKING", "INNOVATIVE", "", "SEAMLESS", "INSIGHTFUL", "FLATTERING", "PERSONALIZED", "COMPREHENSIVE", "VERSATILE", "VERSATILE", "AMAZING",
    "STUNNING", "CUSTOMIZED", "COMPLEMENTARY", "TAILORED", "CURATED", "SIGNATURE", "EFFECTIVE", "EFFECTIVE", "CAPITVATING", "ALL OF IT"
];

const bottomTexts = [
    "COVER", "VIRTUAL TRY-ON", "", "LOOK BOOK", 
    "FACIAL ANALYSIS", "HAIRSTYLE RECOMMENDATIONS", "MAKEUP GUIDE", 
    "BODY ASSESSMENT", "OUTFIT INSPIRATIONS", "OUTFIT INSPIRATIONS", "SEASONAL TRENDS", "OCCASION-BASED LOOKS", 
    "SHOPPING LIST", "ACCESSORY SUGGESTIONS", "SKINCARE ROUTINE", "PRODUCT RECOMMENDATIONS", "FRAGRANCE RECOMMENDATIONS", 
    "LIFESTYLE TIPS", "LIFESTYLE TIPS", "STYLE PROFILE", `AT JUST {price}`
];

const bottomTextColors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#F7AC89", "#000000", "#FF69B4", 
    "#4682B4", "#9932CC", "#5733FF", "#FF3357", "#57FF33", "#3399FF", "#FFD700", 
    "#F7C6B1", "#0000ff", "#DDA0DD", "#33AAFF", "#FF57AA", "#FFAA57", "#FF4500"
];

// Before and after images (from chan.js)
const beforeImages = [
  "https://via.placeholder.com/800x400/FFDDC1/333333?text=Before+1",
  "https://picsum.photos/200/300?random=22",
  "https://picsum.photos/200/300?random=43", 
];

const afterImages = [
  "https://via.placeholder.com/800x400/98C1D9/333333?text=After+1",
  "https://via.placeholder.com/800x400/4682B4/333333?text=After+2",
  "https://via.placeholder.com/800x400/6495ED/333333?text=After+3"
];

// Thumbnail sets (from chan.js)

document.addEventListener("DOMContentLoaded", function() {
  updateThumbnailSet();
    updateMainImage(currentImageIndex);

    // Set up event listeners
    document.getElementById("up-button")?.addEventListener('click', scrollUp);
    document.getElementById("down-button")?.addEventListener('click', scrollDown);

    // Left and right arrows for changing thumbnail sets
    const leftArrow = document.querySelector('.le') || document.getElementById('left-arrow');
    const rightArrow = document.querySelector('.ri') || document.getElementById('right-arrow');

    if (leftArrow) {
        leftArrow.addEventListener('click', prevThumbnailSet);
    } else {
        console.error("Left arrow button not found");
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', nextThumbnailSet);
    } else {
        console.error("Right arrow button not found");
    }

    // Log the current state for debugging
    console.log("Initial thumbnail set:", currentThumbnailSet);
    console.log("Number of thumbnail sets:", thumbnailSets.length);
});

function updateMainImage(index) {
  mainImg.classList.remove("fade-animation");
  setTimeout(() => {
      mainImg.src = thumbnailSets[currentThumbnailSet][index];
      mainImg.classList.add("fade-animation");
  }, 100);

  updateTopText(index);
  updateBottomText(index);
  updateThumbnails(index);
  updateBeforeAfterImages();
  resetSlideInterval();
}

function updateTopText(index) {
  const topText = topTexts[index];
  const topTextContainer = document.getElementById('image-text-top');
  
  topTextContainer.style.fontSize = getFontSize(topText);
  topTextContainer.innerHTML = '';
  
  topText.split('').forEach((letter, i) => {
      const span = document.createElement('span');
      span.classList.add('letter');
      span.style.animationDelay = `${i * 0.1}s`;
      span.innerText = letter;
      topTextContainer.appendChild(span);
  });
}

function updateBottomText(index) {
  const bottomText = bottomTexts[index];
  const bottomTextContainer = document.getElementById('image-text-bottom');
  if (index === bottomTexts.length - 1) {
    // This is the last item, which should show the price
    const price = window.price || '$49'; // Fallback to $49 if window.price is not set
    bottomTextContainer.innerText = bottomText.replace('{price}', price);
  } else {
    bottomTextContainer.innerText = bottomText;
  }
  
  bottomTextContainer.style.color = bottomTextColors[index];
}

function updateThumbnails(index) {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const thumbnailHeight = thumbnails[0].clientHeight + 10;
  let scrollAmount = thumbnailHeight * index;
  thumbnailList.style.transform = `translateY(-${scrollAmount}px)`;

  thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
  thumbnails[index].classList.add('active');
}

function updateBeforeAfterImages() {
  if (beforeImg && afterImg) {
      beforeImg.src = beforeImages[currentThumbnailSet];
      afterImg.src = afterImages[currentThumbnailSet];
  }
}

function getFontSize(text) {
  if (text === 'BREATHTAKING' || text === 'PERSONALIZED') {
      return `${54 * r}px`;
  } else if (text === 'COMPREHENSIVE' || text === 'COMPLEMENTARY') {
      return `${52 * r}px`;
  }
 
}



function selectImage(index) {
  currentImageIndex = index;
  updateMainImage(currentImageIndex);
}

let slideInterval = setInterval(nextImage, 7000);

function resetSlideInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextImage, 7000);
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % thumbnailSets[currentThumbnailSet].length;
  updateMainImage(currentImageIndex);
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + thumbnailSets[currentThumbnailSet].length) % thumbnailSets[currentThumbnailSet].length;
  updateMainImage(currentImageIndex);
}

function scrollUp() {
  currentImageIndex = Math.max(0, currentImageIndex - 1);
  updateMainImage(currentImageIndex);
}

function scrollDown() {
  currentImageIndex = Math.min(thumbnailSets[currentThumbnailSet].length - 1, currentImageIndex + 1);
  updateMainImage(currentImageIndex);
}

function nextThumbnailSet() {
  console.log("Next thumbnail set called");
  currentThumbnailSet = (currentThumbnailSet + 1) % thumbnailSets.length;
  currentImageIndex = 0;
  updateThumbnailSet();
  updateMainImage(currentImageIndex);
  console.log("Current thumbnail set after next:", currentThumbnailSet);
}

function prevThumbnailSet() {
  console.log("Previous thumbnail set called");
  currentThumbnailSet = (currentThumbnailSet - 1 + thumbnailSets.length) % thumbnailSets.length;
  currentImageIndex = 0;
  updateThumbnailSet();
  updateMainImage(currentImageIndex);
  console.log("Current thumbnail set after prev:", currentThumbnailSet);
}

function updateThumbnailSet() {
  console.log("Updating thumbnail set to:", currentThumbnailSet);
  thumbnailList.innerHTML = '';
  thumbnailSets[currentThumbnailSet].forEach((src, index) => {
      const thumbnail = document.createElement('img');
      thumbnail.src = src;
      thumbnail.className = 'thumbnail';
      thumbnail.onclick = () => selectImage(index);
      thumbnailList.appendChild(thumbnail);
  });
  updateBeforeAfterImages();
}


// Initial setup
updateThumbnailSet();
updateMainImage(currentImageIndex);