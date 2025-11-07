// ----- PROFILE HANDLING -----
const profileName = localStorage.getItem('starstreamActiveProfile');
if (!profileName) {
    // If no profile exists, redirect to profile page
    window.location.href = 'profile.html';
} else {
    document.getElementById('welcomeMsg').innerHTML = `Welcome, <span class="text-indigo-400">${profileName}</span>`;
}

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('starstreamActiveProfile');
    window.location.href = 'profile.html';
});

// ----- MEDIA DATA -----
// Example media items
const mediaData = [
    { title: "Interstellar", type: "movie", year: "2014", image: "https://static.photos/space/320x240/1" },
    { title: "The Expanse", type: "tv", year: "2015", image: "https://static.photos/space/320x240/2" },
    { title: "Gravity", type: "movie", year: "2013", image: "https://static.photos/space/320x240/4" },
    { title: "Arrival", type: "movie", year: "2016", image: "https://static.photos/space/320x240/5" },
    { title: "2001: A Space Odyssey", type: "movie", year: "1968", image: "https://static.photos/space/320x240/6" },
    { title: "Stranger Things", type: "tv", year: "2016", image: "https://static.photos/space/320x240/7" },
    { title: "The Mandalorian", type: "tv", year: "2019", image: "https://static.photos/space/320x240/8" }
];

// Retrieve watchlist and recently watched from localStorage
const watchlist = JSON.parse(localStorage.getItem('starstreamWatchlist')) || [];
const recentlyWatched = JSON.parse(localStorage.getItem('starstreamRecentlyWatched')) || [];

// ----- CUSTOM MEDIA CARD -----
class MediaCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const container = document.createElement('div');
        container.style.cursor = 'pointer';
        container.style.borderRadius = '8px';
        container.style.overflow = 'hidden';
        container.style.transition = 'transform 0.2s';
        container.style.background = '#1f2937';
        container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        container.addEventListener('mouseenter', () => container.style.transform = 'scale(1.05)');
        container.addEventListener('mouseleave', () => container.style.transform = 'scale(1)');

        const img = document.createElement('img');
        img.src = this.getAttribute('image');
        img.alt = this.getAttribute('title');
        img.style.width = '100%';
        img.style.display = 'block';

        const title = document.createElement('div');
        title.textContent = `${this.getAttribute('title')} (${this.getAttribute('year')})`;
        title.style.padding = '8px';
        title.style.fontWeight = '600';
        title.style.color = '#f3f4f6';
        title.style.textAlign = 'center';

        container.appendChild(img);
        container.appendChild(title);
        shadow.appendChild(container);
    }
}
customElements.define('custom-media-card', MediaCard);

// ----- RENDER MEDIA -----
function renderSection(gridId, items) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = ''; // Clear previous
    if (!items || items.length === 0) {
        // Hide section if empty
        grid.parentElement.style.display = 'none';
        return;
    } else {
        grid.parentElement.style.display = 'block';
    }

    items.forEach(item => {
        const card = document.createElement('custom-media-card');
        card.setAttribute('title', item.title);
        card.setAttribute('type', item.type);
        card.setAttribute('year', item.year);
        card.setAttribute('image', item.image);
        grid.appendChild(card);
    });
}

// Render all sections
renderSection('recent-grid', mediaData); // Recently Added
renderSection('watchlist-grid', watchlist);
renderSection('recently-watched-grid', recentlyWatched);
renderSection('movies-grid', mediaData.filter(m => m.type === 'movie'));
renderSection('tvshows-grid', mediaData.filter(m => m.type === 'tv'));

// ----- SEARCH/FILTER -----
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

searchInput.addEventListener("input", filterMedia);
filterType.addEventListener("change", filterMedia);

function filterMedia() {
    const query = searchInput.value.toLowerCase();
    const type = filterType.value;

    document.querySelectorAll("custom-media-card").forEach(card => {
        const title = card.getAttribute("title").toLowerCase();
        const cardType = card.getAttribute("type");
        card.style.display = (title.includes(query) && (type === "all" || cardType === type)) ? "block" : "none";
    });
}
