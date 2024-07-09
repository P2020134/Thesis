// Function to adjust font size
function adjustFontSize(change) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: function (change) {
        // Select all text-containing elements on the page (paragraphs, headings, spans, etc.)
        let textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
        // Loop through each text-containing element
        textElements.forEach(function (element) {
          // Get the computed style of the element
          let computedStyle = window.getComputedStyle(element);
          // Get the font size property from the computed style
          let fontSize = computedStyle.fontSize;
          // Parse the font size to extract the numeric value (remove "px" or "em" units)
          let numericFontSize = parseFloat(fontSize);
          // Adjust the font size by the specified amount
          let adjustedFontSize = numericFontSize + change;
          // Apply the adjusted font size to the element
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
        // Remove images and videos by setting display: none
        document.querySelectorAll('img, video,[data-section="short_video_reel"]').forEach(element => element.style.display = 'none');
      }
    });
  });
}

// Function to restore initial state
function restoreInitialState() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    // Check if the tab has finished loading and if the content script is ready
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

// Function to Enlarge the Cursor 
function enlargeCursor() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "enlargeCursor" });
  });
}

// Function to toggle the Saturation Levels 
function toggleDesaturation() {
  console.log("Sending message to toggle desaturation...");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "toggleDesaturation" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
}

// Function to enable keyboard navigation outline
function enableKeyboardOutline() {
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

// Function to change the font to a more dyslexia friendly one 
function changeFont() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "applyArialFont" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
}

// Function to toggle the cursor size
function toggleCursorSize() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "toggleCursorSize" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
}


document.addEventListener('DOMContentLoaded', function () {
  // Initialization
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tabId = tabs[0].id;
    var increaseButton = document.getElementById('increaseButton');
    var decreaseButton = document.getElementById('decreaseButton');
    var removeImagesButton = document.getElementById('removeImagesButton');
    var revertButton = document.getElementById('revertButton');
    var SaturationButton= document.getElementById("SaturationButton");
    var changeFontButton = document.getElementById("DyslexiaButton");
    var enlargeCursorButton = document.getElementById('enlargeCursorButton');



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
   });

  

  /*
  document.getElementById('enlargeCursorButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({ command: "enlargeCursor" });
  });
 */
  document.getElementById('enableOutlineButton').addEventListener('click', enableKeyboardOutline);


  

});
 