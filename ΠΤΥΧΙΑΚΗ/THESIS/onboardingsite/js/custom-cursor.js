document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");
    try {
        new kursor({
            type: 1,
            removeDefaultCursor: false // Whether to remove the default cursor
        });
        console.log("kursor initialized successfully");
    } catch (error) {
        console.error("Error initializing kursor:", error);
    }
});
