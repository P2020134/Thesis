// Function to adjust font size
function adjustFontSize(change) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: function (change) {
        // Select all text-containing elements on the page (paragraphs, headings, spans, etc.)
        let textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
        // Loop through each text-containing element
        textElements.forEach(function (element) {
          // Get the computed style of the element
          let computedStyle = window.getComputedStyle(element);
          // Get the font size property from the computed style
          let fontSize = computedStyle.fontSize;
          // Parse the font size to extract the numeric value (remove "px" or "em" units)
          let numericFontSize = parseFloat(fontSize);
          // Adjust the font size by the specified amount
          let adjustedFontSize = numericFontSize + change;
          // Apply the adjusted font size to the element
          element.style.fontSize = adjustedFontSize + 'px';
        });
      },
      args: [change]
    });
  });
}

// Function to remove images
function removeImages() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: function () {
        // Remove images and videos by setting display: none
        document.querySelectorAll('img, video,[data-section="short_video_reel"]').forEach(element => element.style.display = 'none');
      }
    });
  });
}

// Function to restore initial state
function restoreInitialState() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    // Check if the tab has finished loading and if the content script is ready
    if (tab.status === 'complete') {
      chrome.tabs.sendMessage(tab.id, { action: "restoreInitialState" }, function (response) {
        if (!response) {
          console.log("Failed to send message to content script.");
        }
      });
    } else {
      console.log("Tab is not fully loaded yet. Try again later.");
    }
  });
}


function enlargeCursor() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "enlargeCursor" });
  });
}

function toggleDesaturation() {
  console.log("Sending message to toggle desaturation...");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "toggleDesaturation" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
}

function enableTextSelection() {
  document.addEventListener('mouseup', handleTextSelection);
}

function handleTextSelection(event) {
  var selectedText = window.getSelection().toString();
  if (selectedText.length > 0) {
    // Once text is selected, call a function to summarize it
    summarizeText(selectedText);
  }
}

function summarizeText(text) {
  console.log("Summarizing text:", text); // Log the text being summarized
  const apiUrl = "https://api.ayfie.io/text/v1/summarize";
  const apiKey = "xZjeLoHFDZWUtYYtvDAVotoLdNHDqXojgLXiIlPpsUVPwBdgxQ";
  
  const requestData = {
    text: text,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestData),
  })
  .then(response => response.json())
  .then(data => {
    console.log("Summarized text:", data.summary); // Log the summarized text
    displaySummarizedText(data.summary);
  })
  .catch(error => {
    console.error("Error calling Ayfie API:", error);
  });
}

function displaySummarizedText(summary) {
  var summarizedTextDiv = document.getElementById('summarizedText');
  summarizedTextDiv.textContent = summary;
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialization
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tabId = tabs[0].id;
    var increaseButton = document.getElementById('increaseButton');
    var decreaseButton = document.getElementById('decreaseButton');
    var removeImagesButton = document.getElementById('removeImagesButton');
    var revertButton = document.getElementById('revertButton');
    var SaturationButton= document.getElementById("SaturationButton");
    var selectTextButton = document.getElementById('selectTextButton');

    // Event listeners
    increaseButton.addEventListener('click', function () {
      adjustFontSize(2); // Increase font size by 2 pixels
    });

    decreaseButton.addEventListener('click', function () {
      adjustFontSize(-2); // Decrease font size by 2 pixels
    });

    removeImagesButton.addEventListener('click', function () {
      removeImages();
    });

    revertButton.addEventListener('click', function () {
      restoreInitialState();
    });

    SaturationButton.addEventListener("click", toggleDesaturation);

    selectTextButton.addEventListener('click', function() {
      enableTextSelection();
    });
  });

  // Event listener for enlarging the cursor button
  document.getElementById('enlargeCursorButton').addEventListener('click', function() {
    // Send message to background.js to trigger cursor enlargement
    chrome.runtime.sendMessage({ command: "enlargeCursor" }, function(response) {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully:", response);
      }
    });
  });
});
