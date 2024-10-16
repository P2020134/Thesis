
console.log("Popup script loaded");

document.getElementById('increaseButton').addEventListener('click', function() {
  console.log("Increase button clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log("Sending message to content script");
    chrome.tabs.sendMessage(tabs[0].id, { action: 'adjustFontSize', value: 'larger' });
  });
});

document.getElementById('decreaseButton').addEventListener('click', function() {
  console.log("Decrease button clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log("Sending message to content script");
    chrome.tabs.sendMessage(tabs[0].id, { action: 'adjustFontSize', value: 'smaller' });
  });
});



