// contentScript.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "restoreInitialState") {
      // Restore the initial state by reloading the page
      location.reload();
      // Alternatively, you can set document.documentElement.innerHTML to the initial state if you have it stored somewhere.
      sendResponse("Initial state restored.");
    }
  });



// Function to desaturate the website
function desaturateWebsite() {
  // Apply CSS filter to desaturate the entire body of the webpage
  document.body.style.filter = "grayscale(100%)";
}

// Function to remove desaturation from the website
function removeDesaturation() {
  // Reset the CSS filter to remove desaturation
  document.body.style.filter = "none";
}


// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("Message received:", message);
  // Check if the message is to toggle desaturation
  if (message.command === "toggleDesaturation") {
    console.log("Toggling desaturation...");
    // Toggle desaturation by checking the current filter style
    if (document.body.style.filter === "grayscale(100%)") {
      // If already desaturated, remove desaturation
      removeDesaturation();
      sendResponse({ result: "Desaturation removed" });
    } else {
      // Otherwise, desaturate the website
      desaturateWebsite();
      sendResponse({ result: "Website desaturated" });
    }
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command === "enlargeCursor") {
    // Construct the complete URL to the custom cursor image using chrome.runtime.getURL
    let customCursorUrl = chrome.runtime.getURL("/images/BiggerCursor1.png");
    
    // Set the cursor using the complete URL
    document.body.style.cursor = "url('" + customCursorUrl + "'), auto";
  }
});

