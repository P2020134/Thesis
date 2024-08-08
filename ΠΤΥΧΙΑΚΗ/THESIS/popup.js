// Function to adjust font size
function adjustFontSize(change) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: function (change) {
        let textElements = document.querySelectorAll('nav, p, h1, h2, h3, h4, h5, h6, span');
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

// Function to toggle cursor size
function toggleCursorSize() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "toggleCursorSize" }, function (response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
}

// Function to enable keyboard navigation
function enableKeyboardNavigation() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: function () {
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
    });
  });
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
    var enlargeCursorButton = document.getElementById('enlargeCursorButton');
    var enableOutlineButton = document.getElementById('enableOutlineButton');

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

    enlargeCursorButton.addEventListener('click', toggleCursorSize);

    enableOutlineButton.addEventListener('click', function () {
      enableKeyboardNavigation();
    });
  });
});
