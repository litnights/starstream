// ----------------------
// Profile Handling
// ----------------------
const profileName = localStorage.getItem('starstreamActiveProfile');
const welcomeEl = document.getElementById('welcomeMsg');

if (!profileName) {
    // Redirect to profile selection page if no profile
    window.location.href = 'profile.html';
} else {
    welcomeEl.innerHTML = `Welcome, <span class="text-indigo-400">${profileName}</span>`;
}

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('starstreamActiveProfile');
    window.location.href = 'profile.html';
});

// ----------------------
// MediaCard Web Component
// ----------------------
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
        img.src = this.getAttribute('image') || 'https://via.placeholder.com/320x240?text=No+Image';
        img.alt = this.getAttribute('title') || '';
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.display = 'block';

        const title = document.createElement('div');
        const titleText = this.getAttribute('title') || '';
        const yearText = this.getAttribute('year') || '';
        if (titleText) {
            title.textContent = yearText ? `${titleText} (${yearText})` : titleText;
        }
        title.style.padding = '8px';
        title.style.fontWeight = '600';
        title.style.color = '#f3f4f6';
        title.style.textAlign = 'center';

        container.appendChild(img);
        if (titleText) container.appendChild(title); // only add if there's a title
        shadow.appendChild(container);
    }
}
customElements.define('custom-media-card', MediaCard);

// ----------------------
// Media Data
// ----------------------
const mediaData = [
    { title: "Interstellar", type: "movie", year: "2014", image: "https://via.placeholder.com/320x240?text=Interstellar" },
    { title: "The Expanse", type: "tv", year: "2015", image: "https://via.placeholder.com/320x240?text=The+Expanse" },
    { title: "Gravity", type: "movie", year: "2013", image: "https://via.placeholder.com/320x240?text=Gravity" },
    { title: "Arrival", type: "movie", year: "2016", image: "https://via.placeholder.com/320x240?text=Arrival" },
    { title: "2001: A Space Odyssey", type: "movie", year: "1968", image: "https://via.placeholder.com/320x240?text=2001" }
];

// ----------------------
// LocalStorage Sections
// ----------------------
const watchlistRaw = JSON.parse(localStorage.getItem('starstreamWatchlist'));
const watchlist = Array.isArray(watchlistRaw) ? watchlistRaw.filter(i => i && (i.title || i.name)) : [];

const recentlyWatchedRaw = JSON.parse(localStorage.getItem('starstreamRecentlyWatched'));
const recentlyWatched = Array.isArray(recentlyWatchedRaw) ? recentlyWatchedRaw.filter(i => i && (i.title || i.name)) : [];

// ----------------------
// Render Function
// ----------------------
function renderSection(gridId, items) {
    const grid = document.getElementById(gridId);
    if (!items || items.length === 0) {
        const section = grid.closest('section');
        if (section) section.style.display = 'none'; // hide empty sections
        return;
    }
    grid.innerHTML = '';
    items.forEach(item => {
        const itemTitle = item.title || item.name;
        const itemImage = item.image || 'https://via.placeholder.com/320x240?text=No+Image';
        if (!itemTitle) return; // skip items with no title

        const card = document.createElement('custom-media-card');
        card.setAttribute('title', itemTitle);
        card.setAttribute('type', item.type || 'all');
        card.setAttribute('year', item.year || '');
        card.setAttribute('image', itemImage);
        grid.appendChild(card);
    });
}

// ----------------------
// Render All Sections
// ----------------------
renderSection('recent-grid', mediaData);
renderSection('watchlist-grid', watchlist);
renderSection('recently-watched-grid', recentlyWatched);
renderSection('movies-grid', mediaData.filter(m => m.type === 'movie'));
renderSection('tvshows-grid', mediaData.filter(m => m.type === 'tv'));

// ----------------------
// Search & Filter
// ----------------------
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

searchInput.addEventListener("input", filterMedia);
filterType.addEventListener("change", filterMedia);

function filterMedia() {
    const query = searchInput.value.toLowerCase();
    const type = filterType.value;

    document.querySelectorAll("custom-media-card").forEach(card => {
        const title = (card.getAttribute("title") || "").toLowerCase();
        const cardType = card.getAttribute("type") || "all";
        card.style.display = (title.includes(query) && (type === "all" || cardType === type)) ? "block" : "none";
    });
}

// ----------------------
// Feather Icons
// ----------------------
feather.replace();
