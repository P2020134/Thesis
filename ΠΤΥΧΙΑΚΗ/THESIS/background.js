// Listen for extension installation event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // Set uninstall URL
    chrome.runtime.setUninstallURL("https://forms.gle/TwXH77zFgNnfY1rX6");

    // Open onboarding page
    chrome.tabs.create({
      url: "onboardingsite/onboarding1.1.html"
    });
  }
});

// Handle message to save initial state
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveInitialState") {
    // Save the initial state in Chrome storage
    chrome.storage.local.set({ initialState: message.initialState }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving initial state:", chrome.runtime.lastError.message);
      } else {
        console.log("Initial state saved:", message.initialState);
      }
    });
  }
});

// Handle message to enlarge cursor
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "enlargeCursor") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["content.js"], // Specify the content script file
          function: () => {
            if (chrome.runtime.lastError) {
              console.error("Error executing content script:", chrome.runtime.lastError.message);
            } else {
              console.log("Content script executed successfully.");
            }
          }
        });
      } else {
        console.error("No active tabs found.");
      }
    });
  }
});

/*
// Keep track of the current state: 'none', 'desaturate', 'oversaturate'
let currentState = 'none';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "toggleSaturation") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        let nextCommand;
        if (currentState === 'none' || currentState === 'oversaturate') {
          nextCommand = 'desaturate';
          currentState = 'desaturate';
        } else if (currentState === 'desaturate') {
          nextCommand = 'oversaturate';
          currentState = 'oversaturate';
        }

        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (command) => {
            if (command === 'desaturate') {
              document.body.style.filter = "grayscale(100%)";
            } else if (command === 'oversaturate') {
              document.body.style.filter = "saturate(200%)";
            }
          },
          args: [nextCommand]
        }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error executing content script:", chrome.runtime.lastError.message);
          } else {
            console.log("Content script executed successfully with command:", nextCommand);
          }
        });
      } else {
        console.error("No active tabs found.");
      }
    });
  }
    
});
*/