let chatState = {
  currentQuestion: 0,
  answers: [],
  isComplete: false
};

const questions = [
  {
    text: "Hey there! 👋 I'm Sarah, your personal style buddy. What's bring you here today?",
    options: [
      "Improve everyday style",
      "Update work clothes",
      "Dress for special event",
      { text: "Something else", allowOther: true }
    ]
  },
  {
    text: "Awesome! Let's dive in. How would you describe your style vibe right now?",
    options: [
      "Casual and comfy",
      "Neat and proper",
      "Up-to-date and trendy",
      "Timeless classic",
      { text: "My own unique flavor", allowOther: true }
    ]
  },
  {
    text: "Alright, superstar! Which style squad do you roll with?",
    options: [
      "Women's fashion",
      "Men's fashion",
      "Gender-neutral fashion",
      { text: "My own fabulous category", allowOther: true }
    ]
  },
  {
    text: "Colors can totally change the game! Any shades that make you feel like a superstar? Or ones that just aren't your jam?",
    input: "text",
    placeholder: "Spill the tea on your color loves and not-so-loves..."
  },
  {
    text: "Now, let's talk fit. What kind of clothes make you strut with confidence?",
    options: [
      "Tight and close-fitting",
      "Well-fitted, not too tight",
      "Loose and roomy",
      "Mix of different fits"
    ]
  },
  {
    text: "When you're out shopping, what's your usual game plan?",
    options: [
      "Buy expensive brands",
      "Look for afforable options",
      "Mix of both"
    ]
  },
  {
    text: "We all have those style crushes! Any fashion icons who make you go 'Wow, I want that look!'?",
    input: "text",
    placeholder: "Who's your style inspiration?"
  },
  {
    text: "Okay, this is where the magic happens! Mind sharing a couple of pics? It'll help me visualize the fabulous you!",
    multipleImages: [
      { label: "Selfie (Click to Upload)", placeholder: "Show off that beautiful face!" },
      { label: "Full body (Click to Upload)", placeholder: "Let's see your full style game!" }
    ]
  },
  {
    text: "Fashion is all about expressing yourself! Any looks you're dying to try? Or styles that are a hard pass? (links,texts etc)",
    input: "text",
    placeholder: "Tell me all about your fashion dreams and nightmares..."
  },
  {
    text: "How tall are you, gorgeous? This helps me pick the perfect pieces for you!",
    input: "text",
    placeholder: "In feet and inches or centimeters, whatever works!"
  },
  {
    text: "We all have those features we love to flaunt or maybe want to downplay a bit. Anything specific on your mind?",
    input: "text",
    placeholder: "Your body, your rules - what makes you feel amazing?"
  },
  {
    text: "Last but not least, what's a typical day like for you? This helps me suggest outfits that fit your lifestyle perfectly!",
    options: [
      "Always on the move",
      "Conquering the corporate world",
      "Laid-back and loving it",
      { text: "A little bit of everything", allowOther: true }
    ]
  },
  {
    text: "You're absolutely fantastic! I'm so excited to create your personalized style report. What's your name and where are you from? Let's make this official!",
    input: "text",
    placeholder: "e.g., Sarah from Canada"
  },
  {
    text: "Last thing, I promise! Where can I send your fabulous style recommendations?",
    input: "email",
    placeholder: "your.fabulous.email@example.com"
  }
];

const instructions = [
    "Edit answers: Click back, choose a new option or type, then press Enter or Send.",
    "Be honest - there are no wrong answers in style!",
    "Your responses shape your custom style guide - have fun with it!",
    "For multiple-choice, click to select. For text, type and hit Enter/Send.",
    "Upload clear, recent photos for the best style recommendations.",
    "Provide accurate email, name, and country for your personalized style report.",
    "Scroll up anytime to review or change your previous answers.",
    "Almost done? Double-check your answers before the final submission.",
    "Questions or issues? Contact support@vybex.life for assistance.",
];

let currentInstructionIndex = 0;
const instructionsElement = document.querySelector('.instructions');

function updateInstruction() {
  instructionsElement.style.transform = 'translateY(-100%)';
  setTimeout(() => {
      currentInstructionIndex = (currentInstructionIndex + 1) % instructions.length;
      instructionsElement.textContent = instructions[currentInstructionIndex];
      instructionsElement.style.transform = 'translateY(0)';
  }, 500);
}

// Initial instruction
instructionsElement.textContent = instructions[0];

// Rotate instructions every 5 seconds
setInterval(updateInstruction, 5000);

async function loadChatState() {
  const savedState = localStorage.getItem('chatState');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      
      // Restore images to IndexedDB
      for (const [index, imageInfo] of Object.entries(parsedState.images || {})) {
        if (imageInfo.base64) {
          try {
            const blob = await base64ToBlob(imageInfo.base64);
            await saveToIndexedDB(parseInt(index), blob);
            
            // Update the preview
            const preview = document.querySelector(`#image-preview-${index}`);
            if (preview) {
              preview.style.display = 'block';
              preview.src = URL.createObjectURL(blob);
            }
          } catch (error) {
            console.error(`Error processing image ${index}:`, error);
          }
        }
      }
      
      // Remove base64 data from chatState to keep it light
      delete parsedState.images;
      chatState = parsedState;
      
      return true;
    } catch (error) {
      console.error('Error parsing saved state:', error);
      return false;
    }
  }
  return false;
}

// Helper function to convert Base64 to Blob
function base64ToBlob(base64) {
  try {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    throw error;
  }
}

// Modified saveChatState function
async function saveChatState() {
  const imagesToSave = {};
  
  for (const [index, imageInfo] of Object.entries(chatState.images || {})) {
    try {
      const imageBlob = await getFromIndexedDB(parseInt(index));
      if (imageBlob) {
        const base64 = await blobToBase64(imageBlob);
        imagesToSave[index] = {
          ...imageInfo,
          base64: base64
        };
      }
    } catch (error) {
      console.error(`Error retrieving image ${index} from IndexedDB:`, error);
    }
  }
  
  const stateToSave = {
    ...chatState,
    images: imagesToSave
  };
  
  localStorage.setItem('chatState', JSON.stringify(stateToSave));
}
// Utility function to convert Blob to Base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function clearChatState() {
  localStorage.removeItem('chatState');
  chatState = {
    currentQuestion: 0,
    answers: [],
    images: {},
    isComplete: false
  };
}

function loadPayPalScript(currency, callback) {
  var script = document.createElement('script');
  script.src = `https://www.paypal.com/sdk/js?client-id=AULAbl8hVQCkgkcBIT2-pwqUMR1ZX_50Idda9ByF5MEsAFC3QOkm35g9qrY51Crv-ZGH0GTcix8q34Cn&currency=${currency}&components=buttons,card-fields&enable-funding=venmo`;
  script.onload = function () {
      if (typeof callback === 'function') {
          callback();
      }
  };
  script.onerror = function () {
      console.error('PayPal SDK script could not be loaded.');
  };
  document.head.appendChild(script);
}

// Event Listeners
document.getElementById('getStyledBtn').addEventListener('click', () => {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex';
  setTimeout(() => {
    overlay.style.opacity = '1';
    document.getElementById('formContainer').style.opacity = '1';
    document.getElementById('formContainer').style.transform = 'translateY(0)';
    startConversation();
  }, 50);
});

// Modify the close button event listener
document.querySelector('.close-btn').addEventListener('click', async () => {
  const overlay = document.getElementById('overlay');
  overlay.style.opacity = '0';
  try {
    await saveChatState(); // Wait for saveChatState to complete
  } catch (error) {
    console.error('Error saving chat state:', error);
  }
  setTimeout(() => overlay.style.display = 'none', 300);
});

function startConversation() {
  const hasExistingState = loadChatState();
  if (hasExistingState) {
    rebuildConversation();
  } else {
    showTypingIndicator()
      .then(() => askQuestion(0));
  }
}

function showTypingIndicator() {
  return new Promise(resolve => {
    const typingHTML = `
          <div class="message assistant">
              <div class="typing-indicator">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
              </div>
          </div>
      `;

    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML += typingHTML;
    chatContainer.scrollTop = chatContainer.scrollHeight;

    setTimeout(resolve, 1500);
  });
}

function rebuildConversation() {
  const chatContainer = document.getElementById('chatContainer');
  chatContainer.innerHTML = ''; // Clear existing content

  // Rebuild all answered questions and their answers
  for (let i = 0; i < chatState.currentQuestion; i++) {
    // Add the question
    const question = questions[i];
    let questionHTML = `
          <div class="message assistant">
              <div class="message-content">
                  ${question.text}
                  ${question.illustration ? `<img src="${question.illustration}" alt="Question illustration" class="question-illustration">` : ''}
              </div>
      `;

    // Add the appropriate input interface based on question type
    if (question.multipleImages) {
      questionHTML += createMultiImageInterface(i);
    } else if (question.options) {
      questionHTML += createOptionsInterface(question, i);
    } else if (question.input) {
      questionHTML += createInputInterface(question);
    }

    questionHTML += '</div>';
    chatContainer.innerHTML += questionHTML;

    // Add the saved answer if it exists
    if (chatState.answers[i]) {
      chatContainer.innerHTML += `
              <div class="message user">
                  <div class="message-content">${chatState.answers[i]}</div>
              </div>
          `;
    }
  }

  // Add the current active question if conversation isn't complete
  if (!chatState.isComplete) {
    const currentQuestion = questions[chatState.currentQuestion];
    let questionHTML = `
          <div class="message assistant">
              <div class="message-content">
                  ${currentQuestion.text}
                  ${currentQuestion.illustration ? `<img src="${currentQuestion.illustration}" alt="Question illustration" class="question-illustration">` : ''}
              </div>
      `;

    if (currentQuestion.multipleImages) {
      questionHTML += createMultiImageInterface(chatState.currentQuestion);
    } else if (currentQuestion.options) {
      questionHTML += createOptionsInterface(currentQuestion, chatState.currentQuestion);
    } else if (currentQuestion.input) {
      questionHTML += createInputInterface(currentQuestion);
    }

    questionHTML += '</div>';
    chatContainer.innerHTML += questionHTML;

    // Add the answer for the current question if it exists
    if (chatState.answers[chatState.currentQuestion]) {
      chatContainer.innerHTML += `
              <div class="message user">
                  <div class="message-content">${chatState.answers[chatState.currentQuestion]}</div>
              </div>
          `;
    }
  } else {
    showPaymentOptions();
  }

  updateProgress();
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function createMultiImageInterface(index) {
  const storedImages = chatState.images || {};

  return `
      <div class="image-upload-container">
          ${questions[index].multipleImages.map((img, idx) => `
              <div class="image-upload-box" onclick="document.getElementById('image-upload-${idx}').click()">
                  <div>${img.label}</div>
                  <input type="file" id="image-upload-${idx}" style="display: none" 
                      accept="image/*" onchange="handleFileUpload(event, ${idx})">
                  <img id="image-preview-${idx}" class="image-preview"
                      ${storedImages[idx] ? `src="${storedImages[idx].base64}" style="display: block;"` : ''}>
              </div>
          `).join('')}
      </div>
      <button class="option-btn" style="margin-top:3%;" onclick="handleAnswer('Images uploaded')">Continue</button>
  `;
}

function createOptionsInterface(question, index) {
  return `
      <div class="options-container">
          ${question.options.map((option, optIndex) => {
    const optionText = typeof option === 'string' ? option : option.text;
    const hasOther = typeof option === 'object' && option.allowOther;
    return `
                  <button class="option-btn" onclick="handleOptionClick(${optIndex}, ${index})">${optionText}</button>
                  ${hasOther ? `
                      <div class="other-input" id="other-input-${index}">
                          <input type="text" class="input-field" placeholder="Please specify..." onkeypress="handleInputKeypress(event,this)">
                          <button class="send-button" onclick="handleSendButtonClick(this)">
                              <i class="fas fa-paper-plane"></i>
                          </button>
                      </div>
                  ` : ''}
              `;
  }).join('')}
      </div>
  `;
}

function createInputInterface(question) {
  return `
      <div class="input-container">
          <input type="${question.input}" class="input-field" 
              placeholder="${question.placeholder || 'Type your answer...'}"
              
              onkeypress="handleInputKeypress(event,this)" >
          <button class="send-button" onclick="handleSendButtonClick(this)">
              <i class="fas fa-paper-plane"></i>
          </button>
      </div>
  `;
}

function askQuestion(index, increment = true) {
  if (index >= questions.length) {
    chatState.isComplete = true;
    saveChatState();
    showPaymentOptions();
    return;
  }

  const question = questions[index];
  const chatContainer = document.getElementById('chatContainer');

  const typingIndicator = chatContainer.querySelector('.typing-indicator')?.parentElement;
  if (typingIndicator) typingIndicator.remove();

  let questionHTML = `
      <div class="message assistant">
          <div class="message-content">
              ${question.text}
              ${question.illustration ? `<img src="${question.illustration}" alt="Question illustration" class="question-illustration">` : ''}
          </div>
  `;

  if (question.multipleImages) {
    questionHTML += `
          <div class="image-upload-container">
              ${question.multipleImages.map((img, idx) => `
                  <div class="image-upload-box" onclick="document.getElementById('image-upload-${idx}').click()">
                      <div>${img.label}</div>
                      <input type="file" id="image-upload-${idx}" style="display: none" 
                          accept="image/*" onchange="handleFileUpload(event, ${idx})">
                      <img id="image-preview-${idx}" class="image-preview">
                  </div>
              `).join('')}
          </div>
          <button class="option-btn" style="margin-top:3%;" onclick="handleAnswer('Images uploaded')">Continue</button>
      `;
  } else if (question.options) {
    questionHTML += `
          <div class="options-container">
              ${question.options.map((option, optIndex) => {
      const optionText = typeof option === 'string' ? option : option.text;
      const hasOther = typeof option === 'object' && option.allowOther;
      return `
                      <button class="option-btn" onclick="handleOptionClick(${optIndex}, ${index})">${optionText}</button>
                      ${hasOther ? `
                          <div class="other-input" id="other-input-${index}">
                              <input type="text" class="input-field" placeholder="Please specify..." onkeypress="handleInputKeypress(event,this)">
                              <button class="send-button" onclick="handleSendButtonClick(this)">
                                  <i class="fas fa-paper-plane"></i>
                              </button>
                          </div>
                      ` : ''}
                  `;
    }).join('')}
          </div>
      `;
  } else if (question.input) {
    questionHTML += `
          <div class="input-container">
              <input type="${question.input}" class="input-field" 
                  placeholder="${question.placeholder || 'Type your answer...'}"
                  
                  onkeypress="handleInputKeypress(event,this)">
              <button class="send-button" onclick="handleSendButtonClick(this)">
                  <i class="fas fa-paper-plane"></i>
              </button>
          </div>
      `;
  }

  questionHTML += '</div>';
  chatContainer.innerHTML += questionHTML;
  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (increment) {
    updateProgress();
  }
}

function handleAnswer(answer) {
  const chatContainer = document.getElementById('chatContainer');
  const allMessages = Array.from(chatContainer.children);
  const questionMessage = allMessages.find((msg, idx) => {
    return msg.classList.contains('message') &&
      msg.classList.contains('assistant') &&
      allMessages.slice(0, idx).filter(m => m.classList.contains('message') && m.classList.contains('assistant')).length === chatState.currentQuestion;
  });

  if (questionMessage) {
    const imageUploadContainer = questionMessage.querySelector('.image-upload-container');
    if (imageUploadContainer) {
      const fileInputs = imageUploadContainer.querySelectorAll('input[type="file"]');
      const allFilesUploaded = Array.from(fileInputs).every(input => {
        const previewImg = document.getElementById(`image-preview-${input.id.split('-').pop()}`);
        return previewImg && previewImg.src && previewImg.src !== '';
      });

      if (!allFilesUploaded) {
        alert("Please upload all required images before proceeding.");
        return; // Don't process if any file upload is missing
      }
    }
    // Remove old answer if it exists
    let currentElement = questionMessage.nextElementSibling;
    while (currentElement && currentElement.classList.contains('message') && currentElement.classList.contains('user')) {
      currentElement.remove();
      currentElement = questionMessage.nextElementSibling;
    }

    // Add new answer
    const newAnswerHtml = `
          <div class="message user">
              <div class="message-content">${answer}</div>
          </div>
      `;
    questionMessage.insertAdjacentHTML('afterend', newAnswerHtml);
  }

  chatState.answers[chatState.currentQuestion] = answer;
  chatState.currentQuestion++;
  saveChatState();

  showTypingIndicator()
    .then(() => askQuestion(chatState.currentQuestion));
}

function handleOptionClick(optionIndex, questionIndex) {
  const option = questions[questionIndex].options[optionIndex];
  const optionText = typeof option === 'string' ? option : option.text;

  if (typeof option === 'object' && option.allowOther) {
    const otherInput = document.querySelector(`#other-input-${questionIndex}`);
    otherInput.classList.add('visible');
  } else {
    // Find all user messages up to this point
    const chatContainer = document.getElementById('chatContainer');
    const allMessages = Array.from(chatContainer.children);
    const questionMessage = allMessages.find((msg, idx) => {
      return msg.classList.contains('message') &&
        msg.classList.contains('assistant') &&
        allMessages.slice(0, idx).filter(m => m.classList.contains('message') && m.classList.contains('assistant')).length === questionIndex;
    });

    if (questionMessage) {
      // Find and remove the old answer message that follows this question
      let currentElement = questionMessage.nextElementSibling;
      while (currentElement && currentElement.classList.contains('message') && currentElement.classList.contains('user')) {
        currentElement.remove();
        currentElement = questionMessage.nextElementSibling;
      }

      // Add the new answer
      const newAnswerHtml = `
              <div class="message user">
                  <div class="message-content">${optionText}</div>
              </div>
          `;
      questionMessage.insertAdjacentHTML('afterend', newAnswerHtml);
    }

    // Update the answer in the state
    chatState.answers[questionIndex] = optionText;
    saveChatState();

    // Only proceed to next question if we're answering the current question
    if (questionIndex === chatState.currentQuestion) {
      chatState.currentQuestion++;
      showTypingIndicator()
        .then(() => askQuestion(chatState.currentQuestion));
    }
  }
}


let isSubmitting = false;

function handleInputSubmit(event) {
  if (isSubmitting) return; // Prevent multiple submissions

  let inputField;
  let sendButton;

  if (event instanceof Event) {
    sendButton = event.target;
    inputField = sendButton.previousElementSibling;
  } else {
    inputField = event;
    sendButton = inputField.nextElementSibling;
  }

  const answer = inputField.value.trim();
  if (!answer) {
    alert("Please fill in the input field before proceeding.");
    return; // Don't process empty answers
  }

  // Check if file upload is required for this question
  const chatContainer = document.getElementById('chatContainer');
  const questionIndex = Array.from(chatContainer.querySelectorAll('.message.assistant'))
    .findIndex(msg => msg.contains(inputField));

  if (questionIndex !== -1) {
    const imageUploadContainer = chatContainer.querySelector('.image-upload-container');
    if (imageUploadContainer) {
      const fileInputs = imageUploadContainer.querySelectorAll('input[type="file"]');
      const allFilesUploaded = Array.from(fileInputs).every(input => {
        const previewImg = document.getElementById(`image-preview-${input.id.split('-').pop()}`);
        return previewImg && previewImg.src && previewImg.src !== '';
      });

      if (!allFilesUploaded) {
        alert("Please upload all required images before proceeding.");
        return; // Don't process if any file upload is missing
      }
    }
  }

  // Disable the button and show loading state
  isSubmitting = true;
  sendButton.disabled = false;
  const originalContent = sendButton.innerHTML;
  // You can replace this with a loading spinner if preferred

  try {
    if (questionIndex !== -1) {
      const allMessages = Array.from(chatContainer.children);
      const questionMessage = allMessages.find((msg, idx) => {
        return msg.classList.contains('message') &&
          msg.classList.contains('assistant') &&
          allMessages.slice(0, idx).filter(m => m.classList.contains('message') && m.classList.contains('assistant')).length === questionIndex;
      });

      if (questionMessage) {
        // Remove old answer if it exists
        let currentElement = questionMessage.nextElementSibling;
        while (currentElement && currentElement.classList.contains('message') && currentElement.classList.contains('user')) {
          currentElement.remove();
          currentElement = questionMessage.nextElementSibling;
        }

        // Add new answer
        const newAnswerHtml = `
                  <div class="message user">
                      <div class="message-content">${answer}</div>
                  </div>
              `;
        questionMessage.insertAdjacentHTML('afterend', newAnswerHtml);
      }

      // Update the answer in the state
      chatState.answers[questionIndex] = answer;
      saveChatState();

      // Clear the input field
      inputField.value = '';

      // Only proceed to next question if we're answering the current question
      if (questionIndex === chatState.currentQuestion) {
        chatState.currentQuestion++;
        showTypingIndicator()
          .then(() => askQuestion(chatState.currentQuestion));
      }
    }
  } catch (error) {
    console.error('Error processing input:', error);
  } finally {
    // Reset button state
    setTimeout(() => {
      isSubmitting = false;
      sendButton.disabled = false;
      sendButton.innerHTML = originalContent;
    }, 500); // Add a small delay to prevent accidental double-clicks
  }
}

function handleInputKeypress(event, inputElement) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    const error = validateInput(inputElement);
    if (!isSubmitting && !error) {
      handleInputSubmit(inputElement);
    }
    else {
      alert(error);
    }
  }
}

function validateInput(inputElement) {
  if (inputElement.type === 'email') {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(inputElement.value)) {
      return "Please enter a valid email address";
    }
  }
  return null; // No error
}

function handleSendButtonClick(buttonElement) {
  const inputElement = buttonElement.previousElementSibling;
  if (inputElement && inputElement.tagName === 'INPUT') {
    const error = validateInput(inputElement);
    if (error) {
      alert(error); // You can replace this with a more user-friendly error display
    } else {
      const event = {
        key: 'Enter',
        shiftKey: false,
        preventDefault: () => { },
      };
      handleInputKeypress(event, inputElement);
    }
  }
}


function compressImage(file, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type, quality);
      };
    };
    reader.onerror = reject;
  });
}

// IndexedDB setup
const dbName = 'StyleProfileDB';
const storeName = 'images';
let db;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onerror = (event) => reject("IndexedDB error: " + event.target.error);
    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore(storeName, { keyPath: "id" });
    };
  });
};

const saveToIndexedDB = (id, imageBlob) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put({ id: id, image: imageBlob });
    request.onerror = (event) => reject("Error saving to IndexedDB: " + event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
  });
};

const getFromIndexedDB = (id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    request.onerror = (event) => reject("Error retrieving from IndexedDB: " + event.target.error);
    request.onsuccess = (event) => resolve(event.target.result ? event.target.result.image : null);
  });
};

// Modified handleFileUpload function
async function handleFileUpload(event, index) {
  const file = event.target.files[0];
  if (file) {
    try {
      await openDB(); // Ensure DB is open
      
      const compressedBlob = await compressImage(file, 1024, 1024, 0.7); // Compress image
      await saveToIndexedDB(index, compressedBlob); // Save to IndexedDB
      
      const preview = document.querySelector(`#image-preview-${index}`);
      preview.style.display = 'block';
      preview.src = URL.createObjectURL(compressedBlob);
      
      // Update chatState without storing the actual image data
      if (!chatState.images) {
        chatState.images = {};
      }
      chatState.images[index] = {
        name: file.name,
        type: file.type,
        size: compressedBlob.size
      };
      saveChatState();
    } catch (error) {
      console.error('Error handling file upload:', error);
      alert('There was an error uploading your image. Please try again.');
    }
  }
}


// Global variable to store the currency code
let currencyCode = 'USD';
let price2= 49.99; 

const styles = `
<style>
  .payment-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-top: 16px;
  }
  .payment-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .price-tag {
    font-size: 32px;
    font-weight: 700;
    color: #4F46E5;
    margin-bottom: 24px;
  }
  #rzp-button {
    width: 100%;
    padding: 12px 16px;
    background-color: #4F46E5;
    color: white;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #rzp-button:hover {
    background-color: #4338CA;
    transform: scale(1.05);
  }
  #rzp-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.5);
  }
  #rzp-button svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  .info-text {
    font-size: 14px;
    color: #4B5563;
    margin-top: 24px;
  }
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .info-item svg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  .animate__fadeIn {
    animation: fadeIn 0.5s ease-in;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
`;

function setPriceForC(countryCod) {
  
  let prices = {
    'AE': { price: 89.99, currency: 'USD' },
    'SA': { price: 79.99, currency: 'USD' },
    'QA': { price: 89.99, currency: 'USD' },
    'KW': { price: 74.99, currency: 'USD' },
    'BH': { price: 68.99, currency: 'USD' },
    'SG': { price: 79.99, currency: 'SGD' },
    'JP': { price: 11990, currency: 'JPY' },
    'KR': { price: 68.99, currency: 'USD' },
    'HK': { price: 588, currency: 'HKD' },
    'AU': { price: 99.95, currency: 'AUD' },
    'NZ': { price: 99.95, currency: 'NZD' },
    'CH': { price: 69.90, currency: 'CHF' },
    'NO': { price: 729, currency: 'NOK' },
    'DK': { price: 449, currency: 'DKK' },
    'SE': { price: 679, currency: 'SEK' },
    'GB': { price: 47.99, currency: 'GBP' },
    'DE': { price: 54.99, currency: 'EUR' },
    'FR': { price: 49.99, currency: 'EUR' },
    'NL': { price: 49.99, currency: 'EUR' },
    'US': { price: 49.99, currency: 'USD' },
    'CA': { price: 69.99, currency: 'CAD' },
    'IT': { price: 44.99, currency: 'EUR' },
    'ES': { price: 39.99, currency: 'EUR' },
    'TW': { price: 1399, currency: 'TWD' },
    'IL': { price: 159, currency: 'ILS' },
    'RU': { price: 3299, currency: 'RUB' },
    'MY': { price: 179, currency: 'MYR' },
    'CN': { price: 279, currency: 'CNY' },
    'TH': { price: 1259, currency: 'THB' },
    'BR': { price: 179, currency: 'BRL' },
    'MX': { price: 599, currency: 'MXN' },
    'TR': { price: 34.99, currency: 'USD' },
    'ZA': { price: 31.99, currency: 'USD' },
    'ID': { price: 28.99, currency: 'USD' },
    'IN': { price: 1499, currency: 'INR' },
    'PH': { price: 1399, currency: 'PHP' }
  };

  
  let priceObj = prices[countryCod] || { price: 49.99, currency: 'USD' };


  price2 = priceObj.price;
  currencyCode = priceObj.currency;  
  // Update the displayed price
}


function showPaymentOptions() {
  const chatContainer = document.getElementById('chatContainer');
  const styleId = Math.floor(100000 + Math.random() * 900000);

  const typingIndicator = chatContainer.querySelector('.typing-indicator')?.parentElement;
  if (typingIndicator) typingIndicator.remove();
  
  chatContainer.innerHTML += `
    <div class="message assistant animate__animated animate__fadeIn">
      <div class="message-content">
        <h3>🎉 Amazing! Your style profile is complete!</h3>
        <p>To receive your personalized style guide, please complete the payment:</p>
        
        <div class="payment-container p-4 bg-white rounded-lg shadow-md mt-4">
        
          <div class="payment-container">
          <h4 class="payment-title">Payment Details</h4>
          <div class="price-tag">${window.price}</div>
          
          <div id="paypal-button-container" style="margin-bottom: 16px;"></div>
          <div id="razorpay-button-container" style="display: none; margin-bottom: 16px;">
            <button id="rzp-button">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              Pay with Razorpay
            </button>
          </div>
          
          <div class="info-text">
            <div class="info-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              Secure payment processing
            </div>
            <div class="info-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              Your Style ID: #${styleId}
            </div>
            <div class="info-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Delivery: 2-24 hours
            </div>
          
        
        </div>
      </div>
    </div>
  `;

  chatState.styleId = styleId;
  setPriceForC(window.countryCode);
  // Render the PayPal button
  if (window.countryCode === 'IN') {
    document.getElementById('paypal-button-container').style.opacity = '0.5';
    document.getElementById('paypal-button-container').style.pointerEvents = 'none';
    document.getElementById('razorpay-button-container').style.display = 'block';
    loadRazorpayScript();
    loadPayPalScript(currencyCode, function() {
      
      renderPayPalButton();

    });
  } else {
    document.getElementById('razorpay-button-container').style.display = 'block';
    
    loadPayPalScript(currencyCode, function() {
      document.getElementById('razorpay-button-container').style.opacity = '0.5';
      document.getElementById('razorpay-button-container').style.pointerEvents = 'none';
      renderPayPalButton();


    });
    loadRazorpayScript();
    
  }

  

}

function loadRazorpayScript() {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = function() {
    initializeRazorpay();
  };
  document.body.appendChild(script);
}

function initializeRazorpay() {
  document.getElementById('rzp-button').onclick = function(e) {
    const options = {
      key: 'rzp_test_LL7ARuVVpKj2iC', // Replace with your actual Razorpay key
      amount: 149900, // Amount in paise
      currency: 'INR',
      name: 'Vybex',
      description: 'Personalized Style Guide',
      handler: function(response) {
        handleSuccessfulPayment('Razorpay', response);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com'
      },
      theme: {
        color: '#3399cc'
      }
    };
    const rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();
  }
}



// Example: Load the script for USD or EUR

function renderPayPalButton() {
  
  setPriceForC(window.countryCode);
  // loadPayPalScript(currencyCode);
  
  paypal.Buttons({
    
    createOrder: function(data, actions) {
      return actions.order.create({
        intent:'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currencyCode,
            value: price2.toString()
          }
        }],
        application_context:{
          shipping_preference:'NO_SHIPPING',
          user_action:'PAY_NOW',
        },
        
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        handleSuccessfulPayment('PayPal', details);
      });
    }
  }).render('#paypal-button-container');
}

function handleSuccessfulPayment(method, details) {
  submitToGoogleSheets({
    answers: chatState.answers,
    images: chatState.images,
    timestamp: new Date().toISOString(),
    styleId: chatState.styleId,
    paymentStatus: `completed Method:${method} Transaction id:${details.id} Amount:${currencyCode} ${price2}`
  });
  showCompletionMessage();
}


function processPayment() {
  const chatContainer = document.getElementById('chatContainer');
  // Show loading state
  const paymentButton = document.querySelector('.payment-form button');
  paymentButton.disabled = true;
  paymentButton.innerHTML = `
      <span class="loading-spinner"></span>
      Processing...
  `;



  // Simulate payment processing
  setTimeout(() => {

    submitToGoogleSheets({
      answers: chatState.answers,
      images: chatState.images,
      timestamp: new Date().toISOString(),
      styleId: chatState.styleId,
      paymentStatus: 'completed'
    });
    showCompletionMessage();
  }, 2000);
}

function showCompletionMessage() {
  const chatContainer = document.getElementById('chatContainer');

  chatContainer.innerHTML += `
      <div class="message assistant animate__animated animate__fadeIn">
          <div class="message-content success-message">
              <div class="success-icon">✨</div>
              <h3>Thank You for Choosing Your Personal Style Journey! 🌟</h3>
              
              <div class="completion-details">
                  <p>Dear ${chatState.answers[12]?.split(' from ')[0] || 'Style Explorer'},</p>
                  
                  <p>We're absolutely thrilled to begin this exciting style transformation with you! Your trust in us means the world, and we can't wait to create a personalized style guide that will help you shine even brighter. 💫</p>
                  
                  <p>What happens next:</p>
                  <ul>
                      <li>🎨 Our style experts are reviewing your preferences</li>
                      <li>📧 Watch your email (${chatState.answers[13]}) for updates</li>
                      <li>⏱️ Your guide will be ready in 2-24 hours</li>
                  </ul>
                  
                  <p>Remember: Style is a way to say who you are without having to speak. We're here to help you tell your unique story!</p>
                  
                  <div class="social-share mt-4">
                      <p>While you wait, why not:</p>
                      <div class="share-buttons">
                          <button onclick="shareOnSocial('pinterest')" class="share-btn pinterest">
                              Share on Pinterest
                          </button>
                          <button onclick="shareOnSocial('instagram')" class="share-btn instagram">
                              Share on Instagram
                          </button>
                      </div>
                  </div>
                  
                  <p class="farewell">Here's to your style evolution! ✨</p>
                  <p class="signature">- Sarah, Your Personal Style Guide</p>
              </div>
          </div>
      </div>
  `;

  chatContainer.scrollTop = chatContainer.scrollHeight;
  clearChatState();
}

function handlePayment(method) {
  submitToGoogleSheets({
    answers: chatState.answers,
    images: chatState.images, // Include the stored images
    timestamp: new Date().toISOString(),
    paymentMethod: method
  }).then(() => {
    clearChatState();
    alert('Payment processed successfully! Check your email for updates.');
  }).catch(error => {
    console.error('Payment processing failed:', error);
    alert('Payment processing failed. Please try again.');
  });
}

function updateProgress() {
  const progress = ((chatState.currentQuestion + 1) / questions.length) * 100;
  document.querySelector('.progress-bar').style.width = `${progress}%`;
}

// Update the submitToGoogleSheets function to handle image submission
async function submitToGoogleSheets(data) {
  const formData = {
    answers: data.answers,
    images: {},
    styleId: data.styleId,
    paymentStatus: data.paymentStatus
  };

  // Process images
  if (data.images) {
    for (let index in data.images) {
      const imageInfo = data.images[index];
      const imageBlob = await getFromIndexedDB(parseInt(index));
      if (imageBlob) {
        const base64 = await blobToBase64(imageBlob);
        formData.images[index] = {
          name: imageInfo.name,
          type: imageInfo.type,
          size: imageInfo.size,
          base64: base64
        };
      }
    }
  }

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycby_neN0G4hy8DtXZn_oiHBjd-hmHaZm99FsPLPXhicdDuPdMyipf_rAJuJKwbZXJJAP/exec', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'no-cors'
    });

    console.log('Submission successful');
    alert('Your form has been successfully submitted!');
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    alert('There was an error submitting your form. Please try again.');
  }
}
