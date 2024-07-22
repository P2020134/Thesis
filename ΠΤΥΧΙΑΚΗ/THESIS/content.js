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

function enlargeCursor() {
  const style = document.createElement('style');
  style.innerHTML = `
      html {cursor: url("https://i.sstatic.net/wu8CP.png"), auto;}
    `;
  document.head.appendChild(style);
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

    case "enlargeCursorButton":
      enlargeCursor();
      sendResponse({ result: "success" });
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
