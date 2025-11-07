// ----------------------
// Profile Handling
// ----------------------
const profileName = localStorage.getItem('starstreamActiveProfile');
if (!profileName) {
    // Redirect to profile selection page if no profile
    window.location.href = 'profile.html';
} else {
    document.getElementById('welcomeMsg').innerHTML = `Welcome, <span class="text-indigo-400">${profileName}</span>`;
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
        img.alt = this.getAttribute('title') || 'Untitled';
        img.style.width = '100%';
        img.style.display = 'block';

        const title = document.createElement('div');
        title.textContent = `${this.getAttribute('title') || 'Untitled'} (${this.getAttribute('year') || ''})`;
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
const watchlist = Array.isArray(watchlistRaw) ? watchlistRaw : [];

const recentlyWatchedRaw = JSON.parse(localStorage.getItem('starstreamRecentlyWatched'));
const recentlyWatched = Array.isArray(recentlyWatchedRaw) ? recentlyWatchedRaw : [];

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
        if (!item || !item.title || !item.image) return; // skip invalid
        const card = document.createElement('custom-media-card');
        card.setAttribute('title', item.title);
        card.setAttribute('type', item.type);
        card.setAttribute('year', item.year);
        card.setAttribute('image', item.image);
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
const filterType = document.getElementById("filterTy
