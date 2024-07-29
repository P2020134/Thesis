// Listen for extension installation event and handle messages
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // Set uninstall URL
    chrome.runtime.setUninstallURL("https://forms.gle/RMD1UuNmb6gmNTGh8");

    // Open onboarding page
    chrome.tabs.create({
      url: "onboardingsite/onboarding1.1.html"
    });
  }
  
  // Handle messages from content scripts and other sources
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
    } else if (message.command === "enlargeCursor") {
      // Enlarge cursor command
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
});
