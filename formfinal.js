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

// Load state from localStorage
function loadChatState() {
  const savedState = localStorage.getItem('chatState');
  if (savedState) {
    chatState = JSON.parse(savedState);
    return true;
  }
  return false;
}

// Save state to localStorage
function saveChatState() {
  localStorage.setItem('chatState', JSON.stringify(chatState));
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

document.querySelector('.close-btn').addEventListener('click', () => {
  const overlay = document.getElementById('overlay');
  overlay.style.opacity = '0';
  saveChatState(); // Save state before closing
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


function handleFileUpload(event, index) {
  const file = event.target.files[0];
  if (file) {
    const preview = document.querySelector(`#image-preview-${index}`);
    preview.style.display = 'block';

    const reader = new FileReader();
    reader.onload = function (e) {
      const base64Image = e.target.result;
      preview.src = base64Image;

      // Store image in chatState
      if (!chatState.images) {
        chatState.images = {};
      }
      chatState.images[index] = {
        base64: base64Image,
        name: file.name,
        type: file.type
      };
      saveChatState();
    }
    reader.readAsDataURL(file);
  }
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
                  <h4 class="text-xl font-semibold mb-4">Payment Details</h4>
                  <div class="price-tag mb-4">
                      <span class="text-3xl font-bold text-primary">${window.price}</span>
                      
                  </div>
                  
                  <div class="payment-form">
                      <div class="mb-4">
                          <label class="block text-gray-700 mb-2">Card Number</label>
                          <input type="text" id="card-number" class="w-full p-2 border rounded" placeholder="4242 4242 4242 4242">
                      </div>
                      <div class="flex gap-4 mb-4">
                          <div class="flex-1">
                              <label class="block text-gray-700 mb-2">Expiry</label>
                              <input type="text" id="card-expiry" class="w-full p-2 border rounded" placeholder="MM/YY">
                          </div>
                          <div class="flex-1">
                              <label class="block text-gray-700 mb-2">CVC</label>
                              <input type="text" id="card-cvc" class="w-full p-2 border rounded" placeholder="123">
                          </div>
                      </div>
                      <button onclick="processPayment()" class="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                          Pay Now
                      </button>
                  </div>
                  
                  <div class="mt-4 text-sm text-gray-600">
                      <p>🔒 Secure payment processing</p>
                      <p>✨ Your Style ID: #${styleId}</p>
                      <p>⏱️ Delivery: 2-24 hours</p>
                  </div>
              </div>
          </div>
      </div>
  `;
  chatState.styleId = styleId;
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
                  <p>Dear ${chatState.answers[11]?.split(' from ')[0] || 'Style Explorer'},</p>
                  
                  <p>We're absolutely thrilled to begin this exciting style transformation with you! Your trust in us means the world, and we can't wait to create a personalized style guide that will help you shine even brighter. 💫</p>
                  
                  <p>What happens next:</p>
                  <ul>
                      <li>🎨 Our style experts are reviewing your preferences</li>
                      <li>📧 Watch your email (${chatState.answers[12]}) for updates</li>
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
      const image = data.images[index];
      formData.images[index] = {
        name: image.name,
        type: image.type,
        base64: image.base64
      };
    }
  }

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbw7GkL6POqMBEYCr0DjXBrKabZutHYyqaTRh-lp5oLcPip2LhjHYdXqgwVdeBlzdiRI/exec', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'no-cors'  // This is important for cross-origin requests to Apps Script
    });

    console.log('Submission successful');
    alert('Your form has been successfully submitted!');
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    alert('There was an error submitting your form. Please try again.');
  }
}