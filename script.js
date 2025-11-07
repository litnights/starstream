// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // 1️⃣ Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 2️⃣ Simulate NAS loading
    setTimeout(() => {
        document.querySelectorAll('.media-loading').forEach(el => {
            el.classList.remove('media-loading');
        });
    }, 1500);

    // 3️⃣ Render media cards
    renderMedia();
});

// NAS connection status (mock)
function checkNASConnection() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 500);
    });
}

// Media player function (mock)
function playMedia(mediaId, mediaType) {
    console.log(`Playing ${mediaType} with ID: ${mediaId}`);
}

// Media Data
const mediaData = [
    { title: "Interstellar", type: "movie", year: "2014", image: "https://static.photos/space/320x240/1" },
    { title: "The Expanse", type: "tv", year: "2015", image: "https://static.photos/space/320x240/2" },
    { title: "Cosmos", type: "tv", year: "2014", image: "https://static.photos/space/320x240/3" },
    { title: "Gravity", type: "movie", year: "2013", image: "https://static.photos/space/320x240/4" },
    { title: "Arrival", type: "movie", year: "2016", image: "https://static.photos/space/320x240/5" },
    { title: "2001: A Space Odyssey", type: "movie", year: "1968", image: "https://static.photos/space/320x240/6" },
    { title: "The Martian", type: "movie", year: "2015", image: "https://static.photos/space/320x240/7" },
    { title: "For All Mankind", type: "tv", year: "2019", image: "https://static.photos/space/320x240/11" },
    { title: "Star Trek: Discovery", type: "tv", year: "2017", image: "https://static.photos/space/320x240/12" }
];

// Grids in the page
const grids = {
    recent: document.getElementById("recent-grid"),
    movies: document.getElementById("movies-grid"),
    tv: document.getElementById("tv-grid"),
};

// Render all media into grids
function renderMedia() {
    Object.values(grids).forEach(grid => grid.innerHTML = ""); // Clear grids

    mediaData.forEach(item => {
        const card = document.createElement("custom-media-card");
        card.setAttribute("title", item.title);
        card.setAttribute("type", item.type);
        card.setAttribute("year", item.year);
        card.setAttribute("image", item.image);

        // Add to Recent
        grids.recent.appendChild(card);

        // Add to specific grids
        if (item.type === "movie") grids.movies.appendChild(card.cloneNode(true));
        if (item.type === "tv") grids.tv.appendChild(card.cloneNode(true));
    });
}

// Search & Filter
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

if (searchInput && filterType) {
    searchInput.addEventListener("input", filterMedia);
    filterType.addEventListener("change", filterMedia);
}

function filterMedia() {
    const query = searchInput.value.toLowerCase();
    const type = filterType.value;

    document.querySelectorAll("custom-media-card").forEach(card => {
        const title = card.getAttribute("title").toLowerCase();
        const cardType = card.getAttribute("type");
        const match = title.includes(query) && (type === "all" || cardType === type);
        card.style.display = match ? "block" : "none";
    });
}

