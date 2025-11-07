// Display saved profile name
const profileName = localStorage.getItem('starstreamActiveProfile');
if(profileName) {
  document.getElementById('welcomeMsg').innerHTML = `Welcome, <span class="text-indigo-400">${profileName}</span>`;
}

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('starstreamActiveProfile');
  window.location.href = 'profile.html';
});

// MediaCard definition
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

// Sample media data
const mediaData = [
  { title: "Interstellar", type: "movie", year: "2014", image: "https://static.photos/space/320x240/1" },
  { title: "The Expanse", type: "tv", year: "2015", image: "https://static.photos/space/320x240/2" },
  { title: "Gravity", type: "movie", year: "2013", image: "https://static.photos/space/320x240/4" },
  { title: "Arrival", type: "movie", year: "2016", image: "https://static.photos/space/320x240/5" },
  { title: "2001: A Space Odyssey", type: "movie", year: "1968", image: "https://static.photos/space/320x240/6" }
];

const recentGrid = document.getElementById("recent-grid");

// Render media
mediaData.forEach(item => {
  const card = document.createElement('custom-media-card');
  card.setAttribute('title', item.title);
  card.setAttribute('type', item.type);
  card.setAttribute('year', item.year);
  card.setAttribute('image', item.image);
  recentGrid.appendChild(card);
});

// Search/filter
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

searchInput.addEventListener("input", filterMedia);
filterType.addEventListener("change", filterMedia);

function filterMedia() {
  const query = searchInput.value.toLowerCase();
  const type = filterType.value;
  recentGrid.querySelectorAll("custom-media-card").forEach(card => {
    const title = card.getAttribute("title").toLowerCase();
    const cardType = card.getAttribute("type");
    card.style.display = (title.includes(query) && (type === "all" || cardType === type)) ? "block" : "none";
  });
}
