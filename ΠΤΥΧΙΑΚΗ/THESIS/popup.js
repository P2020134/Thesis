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

// Function to enable keyboard navigation
function enableKeyboardNavigation() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: function () {
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(element => {
          element.addEventListener('focus', function () {
            element.style.outline = '2px solid blue';
          });
          element.addEventListener('blur', function () {
            element.style.outline = '';
          });
        });

        document.addEventListener('keydown', function (event) {
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
    var darkmodeButton = document.getElementById('darkmodeButton');

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

    enableOutlineButton.addEventListener('click', function () {
      enableKeyboardNavigation();
    });

    darkmodeButton.addEventListener('click', function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: toggleDarkMode
        });
      });
    });
  });
});
