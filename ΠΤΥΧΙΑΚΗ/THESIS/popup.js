// Function to adjust font size
function adjustFontSize(change) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: function (change) {
        let textElements = document.querySelectorAll('nav, p, h1, h2, h3, h4, h5, h6, span, ul, ol ,li');
        textElements.forEach(function (element) {
          let computedStyle = window.getComputedStyle(element);
          let fontSize = computedStyle.fontSize;
          let numericFontSize = parseFloat(fontSize);
          let adjustedFontSize = numericFontSize + change;
          element.style.fontSize = adjustedFontSize + 'px';
        });
      },
      args: [change]
    });
  });
}

// Function to remove images
function removeImages() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: function () {
        document.querySelectorAll('img, video, [data-section="short_video_reel"]').forEach(element => element.style.display = 'none');
      }
    });
  });
}

// Function to restore initial state
function restoreInitialState() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    if (tab.status === 'complete') {
      chrome.tabs.sendMessage(tab.id, { action: "restoreInitialState" }, function (response) {
        if (!response) {
          console.log("Failed to send message to content script.");
        }
      });
    } else {
      console.log("Tab is not fully loaded yet. Try again later.");
    }
  });
}

// Function to toggle the Saturation Levels
function toggleDesaturation() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "toggleDesaturation" }, function (response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
}

// Function to change the font to a more dyslexia-friendly one
function changeFont() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "applyArialFont" }, function (response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
}

// Function to toggle dark mode
function toggleDarkMode() {
  const darkModeCSS = `
    body, html, div, section, article, nav, footer, header, main {
      background-color: #121212 !important;
      color: #e0e0e0 !important;
    }
    a {
      color: #bb86fc !important;
    }
    img, video {
      filter: brightness(0.7) !important;
    }
    input, textarea, select, button {
      background-color: #2b2b2b !important;
      color: #e0e0e0 !important;
      border-color: #424242 !important;
    }
    ::placeholder {
      color: #b0b0b0 !important;
    }
  `;

  let styleElement = document.getElementById('dark-mode-style');
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'dark-mode-style';
    styleElement.textContent = darkModeCSS;
    document.head.appendChild(styleElement);
  } else {
    styleElement.remove();
  }
}

let isFocusModeEnabled = false;

// Function to enable focus mode
function enableFocusMode() {
  isFocusModeEnabled = true; // Set focus mode to enabled
  document.body.style.filter = "none"; // Clear any existing blur

  // Add event listeners for hover effect
  const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

  focusableElements.forEach(element => {
    // Apply blur to the body when hovering over an element
    element.addEventListener('mouseenter', function() {
      document.body.style.filter = "blur(10px)"; // Apply blur to the body
      element.style.position = 'relative'; // Set position to relative
      element.style.zIndex = '2'; // Bring the hovered element above the blurred background
    });

    // Reset the hover effect when the mouse leaves the element
    element.addEventListener('mouseleave', function() {
      // Remove the blur from the body only if no other elements are hovered
      const currentlyHovered = document.querySelector(':hover');
      if (!currentlyHovered || currentlyHovered !== element) {
        document.body.style.filter = "none"; // Clear blur if no elements are hovered
        element.style.zIndex = '1'; // Reset zIndex back to 1 or default
        element.style.position = ''; // Reset position
      }
    });
  });
}

// Function to disable focus mode
function disableFocusMode() {
  isFocusModeEnabled = false; // Set focus mode to disabled
  document.body.style.filter = "none"; // Remove any blur effect from the body

  // Remove hover listeners to prevent memory leaks
  const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusableElements.forEach(element => {
    element.removeEventListener('mouseenter', null);
    element.removeEventListener('mouseleave', null);
  });
}

// Function to toggle focus mode
function toggleFocusMode() {
  if (isFocusModeEnabled) {
    disableFocusMode(); // Disable focus mode if it's currently enabled
  } else {
    enableFocusMode(); // Enable focus mode if it's currently disabled
  }
}


document.addEventListener('DOMContentLoaded', function () {
  // Initialization
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var increaseButton = document.getElementById('increaseButton');
    var decreaseButton = document.getElementById('decreaseButton');
    var removeImagesButton = document.getElementById('removeImagesButton');
    var revertButton = document.getElementById('revertButton');
    var SaturationButton = document.getElementById("SaturationButton");
    var changeFontButton = document.getElementById("DyslexiaButton");
    //var enableOutlineButton = document.getElementById('enableOutlineButton');
    var darkmodeButton = document.getElementById('darkmodeButton');
    var focusModeButton = document.getElementById('focusModeButton');
    // Event listeners
    increaseButton.addEventListener('click', function () {
      adjustFontSize(2); // Increase font size by 2 pixels
    });

    decreaseButton.addEventListener('click', function () {
      adjustFontSize(-2); // Decrease font size by 2 pixels
    });

    removeImagesButton.addEventListener('click', function () {
      removeImages();
    });

    revertButton.addEventListener('click', function () {
      restoreInitialState();
    });

    SaturationButton.addEventListener("click", toggleDesaturation);

    changeFontButton.addEventListener("click", changeFont);
    /*
    enableOutlineButton.addEventListener('click', function () {
      enableKeyboardNavigation();
    });
    */
    focusModeButton.addEventListener('click', toggleFocusMode);
  
    darkmodeButton.addEventListener('click', function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: toggleDarkMode
        });
      });
    });

    focusModeButton.addEventListener('click', function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "toggleFocusMode" }, function (response) {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
          } else {
            console.log("Focus mode toggled:", response.result);
          }
        });
      });
    });


  });
});