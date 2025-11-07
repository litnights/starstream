document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Simulate loading media from NAS
    setTimeout(() => {
        document.querySelectorAll('.media-loading').forEach(el => {
            el.classList.remove('media-loading');
        });
    }, 1500);
});

// NAS connection status
function checkNASConnection() {
    // This would be replaced with actual NAS connection check
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 500);
    });
}

// Media player function
function playMedia(mediaId, mediaType) {
    console.log(`Playing ${mediaType} with ID: ${mediaId}`);
    // Implementation for playing media would go here
}