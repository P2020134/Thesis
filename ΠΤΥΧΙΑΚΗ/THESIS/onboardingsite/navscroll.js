// Function to handle scrolling
function handleScroll(event) {
    // Check if the user is scrolling down
    if (event.deltaY > 0) {
      // Get the URL of the next HTML page
      const nextPage = getNextPage();
      // Redirect the user to the next page
      window.location.href = nextPage;
    } else if (event.deltaY < 0) {
      // Get the URL of the previous HTML page
      const prevPage = getPrevPage();
      // Redirect the user to the previous page
      window.location.href = prevPage;
    }
  }
  // Function to get the URL of the next HTML page
  function getNextPage() {
    // Define an array with the filenames of your HTML pages in the desired order
    const pages = ['onboarding1.1.html', 'features.html', 'purpose.html', 'contact.html'];
    // Get the current URL
    const currentUrl = window.location.href;
    // Extract the filename from the URL
    const currentPage = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    // Find the index of the current page in the array
    const currentIndex = pages.indexOf(currentPage);
    // Calculate the index of the next page
    const nextIndex = (currentIndex + 1) % pages.length;
    // Return the URL of the next page
    return pages[nextIndex];
    
  }
  
  // Function to get the URL of the previous HTML page
  function getPrevPage() {
    // Define an array with the filenames of your HTML pages in the desired order
    const pages = ['onboarding1.1.html', 'features.html', 'purpose.html', 'contact.html'];
    // Get the current URL
    const currentUrl = window.location.href;
    // Extract the filename from the URL
    const currentPage = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    // Find the index of the current page in the array
    const currentIndex = pages.indexOf(currentPage);
    // Calculate the index of the previous page
    const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
    // Return the URL of the previous page
    return pages[prevIndex];
  }
  
  // Attach the handleScroll function to the scroll event
  window.addEventListener('wheel', handleScroll);
  