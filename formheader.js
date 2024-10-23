const instructions = [
    "Edit answers: Click back, select new option/field, hit Enter/Send.",
    "Be honest - there are no wrong answers in style!",
    "Multiple-choice: Click to select. Text: Type and Enter.",
    "Upload clear, recent photos for best recommendations.",
    "Make sure photos are uploaded",
    "Provide accurate email and name for your style report.",
    "More the detail in answer, better the report",
    "Scroll up to review or change previous answers.",
    "Double-check answers before final submission.",
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
