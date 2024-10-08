localStorage.setItem("focus_mode", false); // Set the state of focus mode to false

// on item focus (hover)
function elementHover(element) {
    element.target.style.filter = "none"; // Clear the blur for the hovered element
}

// on item leave (stop hover)
function elementStopHover(element) {
    element.target.style.filter = "blur(10px)"; // Apply blur again when hover stops
}

function enableFocusMode() {
    localStorage.setItem("focus_mode", true); // Set focus mode to enabled

    const focusableElements = document.querySelectorAll('div');

    // Page starts clear (no blur initially)
    focusableElements.forEach(element => {
        element.style.filter = "none"; // Ensure no blur on page load
        
        // Apply blur to other elements when hovering over an element
        element.addEventListener('mouseenter', elementHover);

        // Reset the blur effect when the mouse leaves the element
        element.addEventListener('mouseleave', elementStopHover);
    });
}

// Function to disable focus mode
function disableFocusMode() {
    localStorage.setItem("focus_mode", false); // Set focus mode to disabled
    
    // Select all div elements and reset their styles and event listeners
    const focusableElements = document.querySelectorAll('div');
    focusableElements.forEach(element => {
        element.style.filter = "none"; // Clear any blur applied to the elements

        // Remove the hover and leave event listeners to fully disable focus mode
        element.removeEventListener('mouseenter', elementHover); 
        element.removeEventListener('mouseleave', elementStopHover);
    });
}
