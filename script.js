// ----------------------
// Profile Handling
// ----------------------
let profilesRaw = localStorage.getItem('starstreamProfiles');
let profiles = Array.isArray(JSON.parse(profilesRaw)) ? JSON.parse(profilesRaw) : [];

let profileName = localStorage.getItem('starstreamActiveProfile');

const welcomeEl = document.getElementById('welcomeMsg');

if (!profileName) {
    window.location.href = 'profile.html'; // redirect if no profile
} else {
    welcomeEl.innerHTML = `Welcome, <span class="text-indigo-400">${profileName}</span>`;
}

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('starstreamActiveProfile');
    window.location.href = 'profile.html';
});

// ----------------------
// Header Profile Dropdown
// ----------------------
const navEl = document.querySelector('nav');

const profileDropdown = document.createElement('div');
profileDropdown.style.position = 'relative';
profileDropdown.innerHTML = `
  <button id="profileBtn" class="ml-4 text-gray-300 hover:text-white text-sm sm:text-base">Profile ▼</button>
  <div id="profileMenu" style="display:none; position:absolute; right:0; top:100%; background:#1f2937; border-radius:0.5rem; padding:0.5rem; min-width:150px; box-shadow:0 4px 15px rgba(0,0,0,0.5); z-index:100;">
  </div>
`;

navEl.appendChild(profileDropdown);

const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');

function renderProfileMenu() {
    profileMenu.innerHTML = '';
    profiles.forEach(p => {
        const btn = document.createElement('button');
        btn.textContent = p;
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.padding = '0.25rem 0.5rem';
        btn.style.background = 'transparent';
        btn.style.border = 'none';
        btn.style.color = '#fff';
        btn.style.textAlign = 'left';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', () => {
            localStorage.setItem('starstreamActiveProfile', p);
            location.reload();
        });
        profileMenu.appendChild(btn);
    });

    // Settings option
    const settingsBtn = document.createElement('button');
    settingsBtn.textContent = 'Settings';
    settingsBtn.style.display = 'block';
    settingsBtn.style.width = '100%';
    settingsBtn.style.padding = '0.25rem 0.5rem';
    settingsBtn.style.background = 'transparent';
    settingsBtn.style.border = 'none';
    settingsBtn.style.color = '#fff';
    settingsBtn.style.textAlign = 'left';
    settingsBtn.style.cursor = 'pointer';
    settingsBtn.addEventListener('click', () => openSettingsMenu());
    profileMenu.appendChild(settingsBtn);
}

profileBtn.addEventListener('click', () => {
    profileMenu.style.display = profileMenu.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target)) {
        profileMenu.style.display = 'none';
    }
});

renderProfileMenu();

// ----------------------
// Settings Menu
// ----------------------
function openSettingsMenu() {
    const settingsOverlay = document.createElement('div');
    settingsOverlay.style.position = 'fixed';
    settingsOverlay.style.top = 0;
    settingsOverlay.style.left = 0;
    settingsOverlay.style.width = '100%';
    settingsOverlay.style.height = '100%';
    settingsOverlay.style.background = 'rgba(0,0,0,0.7)';
    settingsOverlay.style.display = 'flex';
    settingsOverlay.style.alignItems = 'center';
    settingsOverlay.style.justifyContent = 'center';
    settingsOverlay.style.zIndex = 200;

    const settingsCard = document.createElement('div');
    settingsCard.style.background = '#111827';
    settingsCard.style.padding = '2rem';
    settingsCard.style.borderRadius = '1rem';
    settingsCard.style.color = '#fff';
    settingsCard.style.minWidth = '300px';
    settingsCard.style.maxWidth = '90%';
    settingsCard.innerHTML = `
      <h2 class="text-xl font-bold mb-4">Settings</h2>
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <button id="changeNameBtn">Change Profile Name</button>
        <button id="deleteProfileBtn">Delete This Profile</button>
        <button id="closeSettingsBtn">Close</button>
      </div>
    `;

    settingsOverlay.appendChild(settingsCard);
    document.body.appendChild(settingsOverlay);

    // Button actions
    document.getElementById('changeNameBtn').addEventListener('click', () => {
        const newName = prompt("Enter new profile name:", profileName);
        if (newName && !profiles.includes(newName)) {
            const idx = profiles.indexOf(profileName);
            profiles[idx] = newName;
            localStorage.setItem('starstreamProfiles', JSON.stringify(profiles));
            localStorage.setItem('starstreamActiveProfile', newName);
            location.reload();
        }
    });

    document.getElementById('deleteProfileBtn').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete profile "${profileName}"?`)) {
            profiles = profiles.filter(p => p !== profileName);
            localStorage.setItem('starstreamProfiles', JSON.stringify(profiles));
            localStorage.removeItem(`starstreamWatchlist_${profileName}`);
            localStorage.removeItem(`starstreamRecentlyWatched_${profileName}`);
            localStorage.removeItem('starstreamActiveProfile');
            window.location.href = 'profile.html';
        }
    });

    document.getElementById('closeSettingsBtn').addEventListener('click', () => {
        document.body.removeChild(settingsOverlay);
    });
}

// ----------------------
// Profile-specific storage keys
// ----------------------
const watchlistKey = `starstreamWatchlist_${profileName}`;
const recentlyWatchedKey = `starstreamRecentlyWatched_${profileName}`;

// Load profile data
const watchlistRaw = JSON.parse(localStorage.getItem(watchlistKey)) || [];
const watchlist = Array.isArray(watchlistRaw) ? watchlistRaw.filter(i => i && (i.title || i.name)) : [];

const recentlyWatchedRaw = JSON.parse(localStorage.getItem(recentlyWatchedKey)) || [];
const recentlyWatched = Array.isArray(recentlyWatchedRaw) ? recentlyWatchedRaw.filter(i => i && (i.title || i.name)) : [];

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
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between';
        container.addEventListener('mouseenter', () => container.style.transform = 'scale(1.05)');
        container.addEventListener('mouseleave', () => container.style.transform = 'scale(1)');

        const img = document.createElement('img');
        img.src = this.getAttribute('image') || 'https://via.placeholder.com/320x240?text=No+Image';
        img.alt = this.getAttribute('title') || '';
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.display = 'block';

        const titleText = this.getAttribute('title') || '';
        const yearText = this.getAttribute('year') || '';
        const cardType = this.getAttribute('type') || 'all';

        const title = document.createElement('div');
        if (titleText) {
            title.textContent = yearText ? `${titleText} (${yearText})` : titleText;
        }
        title.style.padding = '8px';
        title.style.fontWeight = '600';
        title.style.color = '#f3f4f6';
        title.style.textAlign = 'center';

        // Action buttons container
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '6px';
        btnContainer.style.padding = '6px';

        // Add to Watchlist button
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Watchlist';
        addButton.style.flex = '1';
        addButton.style.fontSize = '0.7rem';
        addButton.style.padding = '4px';
        addButton.style.borderRadius = '6px';
        addButton.style.background = '#6366f1';
        addButton.style.color = '#fff';
        addButton.style.cursor = 'pointer';
        addButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = { title: titleText, type: cardType, year: yearText, image: img.src };
            if (!watchlist.find(i => i.title === item.title)) {
                watchlist.push(item);
                localStorage.setItem(watchlistKey, JSON.stringify(watchlist));
                renderSection('watchlist-grid', watchlist);
            }
        });

        // Mark as Watched button
        const watchedButton = document.createElement('button');
        watchedButton.textContent = 'Mark as Watched';
        watchedButton.style.flex = '1';
        watchedButton.style.fontSize = '0.7rem';
        watchedButton.style.padding = '4px';
        watchedButton.style.borderRadius = '6px';
        watchedButton.style.background = '#10b981';
        watchedButton.style.color = '#fff';
        watchedButton.style.cursor = 'pointer';
        watchedButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = { title: titleText, type: cardType, year: yearText, image: img.src };
            if (!recentlyWatched.find(i => i.title === item.title)) {
                recentlyWatched.push(item);
                localStorage.setItem(recentlyWatchedKey, JSON.stringify(recentlyWatched));
                renderSection('recently-watched-grid', recentlyWatched);
            }
        });

        btnContainer.appendChild(addButton);
        btnContainer.appendChild(watchedButton);

        container.appendChild(img);
        if (titleText) container.appendChild(title);
        container.appendChild(btnContainer);

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
// Render Function
// ----------------------
function renderSection(gridId, items) {
    const grid = document.getElementById(gridId);
    if (!items || items.length === 0) {
        const section = grid.closest('section');
        if (section) section.style.display = 'none';
        return;
    }
    grid.innerHTML = '';
    items.forEach(item => {
        const itemTitle = item.title || item.name;
        const itemImage = item.image || 'https://via.placeholder.com/320x240?text=No+Image';
        if (!itemTitle) return;

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
