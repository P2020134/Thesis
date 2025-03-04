let state = 0; // 0: normal, 1: desaturated, 2: oversaturated
let isFocusModeEnabled = false; // Track whether focus mode is enabled

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
        console.log("Current state:Website Desaturated ", state); 
        sendResponse({ result: "Website desaturated" });
      } else if (state === 1) {
        saturateWebsite();
        console.log("Current state:Website Saturated ", state); 
        sendResponse({ result: "Website saturated" });
      } else {
        removeFilters();
        console.log("Current state:Filters removed ", state); 
        sendResponse({ result: "Filters removed" });
      }
      state = (state + 1) % 3;
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


