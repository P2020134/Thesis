document.addEventListener('DOMContentLoaded', function() {
    const myKursor = new kursor({
        type: 4, // Type of the kursor
        color: '#ff0000', // Initial color
        el: 'body', // Element to which kursor will be applied
        removeDefaultCursor: true // Whether to remove the default cursor
    });

    // Additional customizations
    myKursor.color(black); // To change the color later

    myKursor.hidden(true); // To hide the kursor
    myKursor.hidden(false); // To show the kursor again

    myKursor.addClass('my-custom-class'); // To add a custom class
    myKursor.removeClass('my-custom-class'); // To remove the custom class
});
