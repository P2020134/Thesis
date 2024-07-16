let state = 0; // 0: normal, 1: desaturated, 2: saturated

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





/*trying to fix the cursor enlargment 

let isCursorLarge = false;

// Function to enlarge the cursor
function enlargeCursor() {
  document.body.style.cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEKklEQVRYhe2Xf0hUURTHP3fm7jfbSLaRpBCT6BQEZG3GhAkNFw+BiPZjaLQ0GD+IKhpQ8ExD1QIUdPDhrCahNBMQkYkCBYYUtCRB5Jmgop1Gd2Zdz3a6+bPLt0dI59dXzmXnPmc++b+/ZZxzvPCFJFG4Q/zoBWvEHLgADwHQAXOYgNHiB+5K+B5qAS5AVos2w0G99WyG4X8IgVjZomxToICRQwQBS8mgTa1kKHGG3j4t7tbDssptP4ug6XeDbLwX0N1A02FcKhnCXTXLgsvryJZ1PwC+ANFJ6dwp1ocZJFM0swLPzsycmiWtfzBICMyDKLyMC7qOEr0dZQs7HAoPmtI9GAOhYrTMiwGBK4h7ubDJTIBeA5GaHZiAWntffHFqY9AmvhFgf2N7CrU7Q8M0yCXxHrsbP08+xUgkeQGQ5C1gc8HF9rwM8PzAoVJUtT0mtefyHV9+EkiTLUG+Au8fgblA43ML5BAJ8SwA4M5AwlKgT7M8INAfNpjMI7tMSobUBYc8HpfajBIzocHeNyoAI4Q6IIBOewFI6vwMAWA9qNXzIP2TC5AlYE3hMfJ3EPkPgDAq08MIZUKy3NIBOJfJBB4BOJ7KI5OW+Jyf2n5OdtWpeWtpaPkcN6k5U5JEt/OBPZpwlmAxkHrkiWy94ef8F1ebU3IbMccvGwIUIt8+AFAMUuhdbdNMrwhEnZ9dx8WBxUp44CWGfqxUccYqZj/QkSEzMyxptQsyJMLflAb9DUKnTspYcXYrJ7vFbGYvdwGwfdxAxuV5K48FcKLl2QImSoRoRT5WtD47BSYzHEC8QwDjIuICV4IGzD+IsDnI2V4LTvG7IuGaLYE2D/jO0dMIIE55j0C5AMwEbJifMkh13gmjctD5SG2z2zXZZhFcmjTWQHixkPRbNHEj3x3XJ1d63adysMkHyNc5cAWsPbSyjAwNTXuDqg9hHEdo9a71wHIZ2R4vXxs1ufzgeykG9uNbiS22qAp6GnWudMDOZpIt1dx1eaOxLemF5SV1vaMKOluva9LXNYeBD+41AYElvQtwF4xfnNCds+gJtXp5KmM/w9WPaXqWcrTwAfv3fU7OfYpOAAAAAElFTkSuQmCC") 16 16, auto';
}

// Function to restore the original cursor
function restoreCursor() {
  document.body.style.cursor = 'auto';
}

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("Message received:", message);
  if (message.command === "toggleCursorSize") {
    if (isCursorLarge) {
      restoreCursor();
      isCursorLarge = false;
      sendResponse({ result: "Cursor restored to normal size" });
    } else {
      enlargeCursor();
      isCursorLarge = true;
      sendResponse({ result: "Cursor enlarged" });
    }
  }
});
*/