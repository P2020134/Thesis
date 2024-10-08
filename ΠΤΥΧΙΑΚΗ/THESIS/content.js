let state = 0; // 0: normal, 1: desaturated, 2: oversaturated

function saturateWebsite() {
  document.body.style.filter = "saturate(200%)";
}
function desaturateWebsite() {
  // Apply CSS filter to desaturate the entire body of the webpage
  document.body.style.filter = "grayscale(100%)";
}
// Function to remove all filters for the saturation levels
function removeFilters() {
  document.body.style.filter = "none";
}

function applyArialFont() {
  const style = document.createElement("style");
  style.textContent = `
    body, p, h1, h2, h3, h4, h5, h6, span, a, div, li, ul, ol {
      font-family: 'Arial', sans-serif !important;
    }
  `;
  document.head.appendChild(style);
}


function enableKeyboardNav() {
  document.addEventListener('keydown', keyboardNavHandler);
  localStorage.setItem('keyboardNavEnabled', 'true');
}

function disableKeyboardNav() {
  document.removeEventListener('keydown', keyboardNavHandler);
  localStorage.setItem('keyboardNavEnabled', 'false');
}

function keyboardNavHandler(event) {
  const focusableElements = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  switch (event.key) {
    case 'ArrowUp':
      window.scrollBy(0, -100);
      break;
    case 'ArrowDown':
      window.scrollBy(0, 100);
      break;
    default:
      return;
  }
  event.preventDefault();
}

// Function to setup keyboard navigation
function setupKeyboardNavigation() {
  // Add outline style to all focusable elements
  const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusableElements.forEach(element => {
    element.addEventListener('focus', function () {
      element.style.outline = '2px solid blue'; // Change outline color and width as needed
    });
    element.addEventListener('blur', function () {
      element.style.outline = ''; // Remove outline when focus is lost
    });
  });

  // Scroll page up or down on arrow key press
  document.addEventListener('keydown', function (event) {
    switch (event.key) {
      case 'ArrowUp':
        window.scrollBy(0, -100); // Adjust the value as needed for the desired scrolling distance
        break;
      case 'ArrowDown':
        window.scrollBy(0, 100); // Adjust the value as needed for the desired scrolling distance
        break;
      default:
        return;
    }
    event.preventDefault();
  });

}


let isFocusModeEnabled = false; // Track whether focus mode is enabled

function enableFocusMode() {
  document.body.style.filter = "blur(5px)"; // Example of focus mode behavior
  isFocusModeEnabled = true; // Update the state
}

function disableFocusMode() {
  document.body.style.filter = "none"; // Remove the focus mode effect
  isFocusModeEnabled = false; // Update the state
}

/// Handle message to toggle focus mode
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "restoreInitialState") {
    location.reload();
    sendResponse("Initial state restored.");
    return;
  }

  switch (message.command) {
    case "applyArialFont":
      applyArialFont();
      sendResponse({ result: "Font applied" });
      break;

    case "toggleDesaturation":
      if (state === 0) {
        desaturateWebsite();
        sendResponse({ result: "Website desaturated" });
      } else if (state === 1) {
        saturateWebsite();
        sendResponse({ result: "Website saturated" });
      } else {
        removeFilters();
        sendResponse({ result: "Filters removed" });
      }
      state = (state + 1) % 3;
      break;

    case 'toggleKeyboardNav':
      const currentStatus = localStorage.getItem('keyboardNavEnabled');
      if (currentStatus === 'true') {
        disableKeyboardNav();
        sendResponse({ status: 'Keyboard navigation disabled' });
      } else {
        enableKeyboardNav();
        sendResponse({ status: 'Keyboard navigation enabled' });
      }
      break;

    case "toggleFocusMode":
      if (isFocusModeEnabled) {
        disableFocusMode();
        sendResponse({ result: "Focus mode disabled" });
      } else {
        enableFocusMode();
        sendResponse({ result: "Focus mode enabled" });
      }
      break;

    default:
      console.log("Unknown command:", message.command);
      sendResponse({ result: "Unknown command" });
      break;
  }
});


