// contentScript.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "restoreInitialState") {
      // Restore the initial state by reloading the page
      location.reload();
      // Alternatively, you can set document.documentElement.innerHTML to the initial state if you have it stored somewhere.
      sendResponse("Initial state restored.");
    }
    if (message.command === "applyArialFont") {
      applyArialFont();
      sendResponse({ result: "Font applied" });
    }
  });


let state = 0; // 0: normal, 1: desaturated, 2: saturated
function saturateWebsite(){
  document.body.style.filter = "saturate(200%)";
}
// Function to desaturate the website
function desaturateWebsite() {
  // Apply CSS filter to desaturate the entire body of the webpage
  document.body.style.filter = "grayscale(100%)";
}
// Function to remove all filters
function removeFilters() {
  document.body.style.filter = "none";
}

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("Message received:", message);
  if (message.command === "toggleDesaturation") {
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
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command === "enlargeCursor") {
    // Construct the complete URL to the custom cursor image
    let customCursorUrl = chrome.runtime.getURL("images/BiggerCursor.png");
    // Set the cursor using the complete URL
    document.body.style.cursor = "url('" + customCursorUrl + "'), auto";
  }
});
/*  POSSIBLE SOLUTION !!!!??

  if (message.command === "enlargeCursor") {
    const style = document.createElement('style');
    style.innerHTML = `
      * { cursor: url('images/BiggerCursor.png'), auto !important; }
    `;
    document.head.appendChild(style);
    sendResponse({ status: "success" });
  }

*/


function applyArialFont() {
  const style = document.createElement("style");
  style.textContent = `
    body, p, h1, h2, h3, h4, h5, h6, span, a, div, li, ul, ol {
      font-family: 'Arial', sans-serif !important;
    }
  `;
  document.head.appendChild(style);
}

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command === "applyArialFont") {
    applyArialFont();
    sendResponse({ result: "Font applied" });
  }
});