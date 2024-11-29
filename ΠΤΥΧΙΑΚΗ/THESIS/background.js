// Listen for extension installation event and handle messages
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // Set uninstall URL
    chrome.runtime.setUninstallURL("https://forms.gle/RMD1UuNmb6gmNTGh8");

    // Open onboarding page
    chrome.tabs.create({
      url: "https://p2020134.github.io/OnboardingSite/"
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
    }
  });
});
