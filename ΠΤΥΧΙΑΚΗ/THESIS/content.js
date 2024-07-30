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


function applyCustomCursor() {
  console.log("applyCustomCursor function called");
  const existingCursor = document.querySelector('.kursor');
  if (existingCursor) {
    console.log("Cursor already applied");
    return;
  }

  const kursorScript = document.createElement('script');
  kursorScript.src = chrome.runtime.getURL('js/kursor.min.js');
  document.body.appendChild(kursorScript);

  kursorScript.onload = () => {
    console.log("kursor.min.js loaded successfully");
    new kursor({
      type: 4,
      color: '#000000',
      el: 'body',
      removeDefaultCursor: true
    });
  };

  // Ensure no other CSS rules are hiding the cursor
  document.body.style.cursor = 'default !important';
}

function toggleCursorSize() {
  console.log("toggleCursorSize function called");
  const body = document.body;
  if (!body) return;

  if (body.style.cursor === 'none') {
    body.style.cursor = ''; // Reset to default cursor
    console.log("Default cursor restored");
  } else {
    body.style.cursor = 'none'; // Hide the default cursor
    console.log("Default cursor hidden");
  }
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "restoreInitialState") {
    // Restore the initial state by reloading the page
    location.reload();
    sendResponse("Initial state restored.");
    return; // Exit the function after handling this action
  }

  switch (message.command) {
    case "applyArialFont":
      applyArialFont();
      sendResponse({ result: "Font applied" });
      break;

    case "applyCustomCursor":
      applyCustomCursor();
      sendResponse({ result: "Cursor applied" });
      break;

    case "toggleCursorSize":
      toggleCursorSize();
      sendResponse({ result: "Cursor size toggled" });
      break;

    case "toggleDesaturation":
      console.log("Toggling state...");
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
      state = (state + 1) % 3; // Cycle state between 0, 1, and 2
      break;

    default:
      console.log("Unknown command:", message.command);
      sendResponse({ result: "Unknown command" });
      break;
  }
});
