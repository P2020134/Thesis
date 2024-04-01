chrome.runtime.onInstalled.addListener((e) => {
  if (e.reason === chrome.runtime.OnInstalledReason.INSTALL) {

    chrome.runtime.setUninstallURL(
      "https://forms.gle/TwXH77zFgNnfY1rX6" //unistall page 
    )

    chrome.tabs.create({
      url: "onboardingsite/onboarding1.1.html" //onboarding page
    })
  }
})


// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveInitialState") {
    // Save the initial state in Chrome storage
    chrome.storage.local.set({ initialState: message.initialState }, () => {
      console.log("Initial state saved:", message.initialState);
    });
  }
});




chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Check if the message is requesting to enlarge the cursor
  if (message.command === "enlargeCursor") {
    // Send message to the content script to enlarge the cursor
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { command: "enlargeCursor" });
    });

    // Add a small delay before sending the response
    setTimeout(function() {
      sendResponse({ status: true });
    }, 1);

    // Return true to indicate that a response will be sent asynchronously
    return true;
  }
});



