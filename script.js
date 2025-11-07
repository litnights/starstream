<script>
document.addEventListener('DOMContentLoaded', () => {
    // -------------------------
    // 1️⃣ Bootstrap tooltips
    // -------------------------
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // -------------------------
    // 2️⃣ Simulate loading media from NAS
    // -------------------------
    setTimeout(() => {
        document.querySelectorAll('.media-loading').forEach(el => {
            el.classList.remove('media-loading');
        });
    }, 1500);

    // -------------------------
    // 3️⃣ Media Rendering
    // -------------------------
    const mediaData = [
        { title: "Interstellar", type: "movie", year: "2014", image: "https://picsum.photos/320/240?random=1" },
        { title: "The Expanse", type: "tv", year: "2015", image: "https://picsum.photos/320/240?random=2" },
        { title: "Gravity", type: "movie", year: "2013", image: "https://picsum.photos/320/240?random=3" },
        { title: "For All Mankind", type: "tv", year: "2019", image: "https://picsum.photos/320/240?random=4" }
    ];

    const grids = {
        recent: document.getElementById("recent-grid"),
        movies: document.getElementById("movies-grid"),
        tv: document.getElementById("tv-grid")
    };

    function renderMedia() {
        Object.values(grids).forEach(grid => grid.innerHTML = "");

        mediaData.forEach(item => {
            const card = document.createElement("custom-media-card");
            card.setAttribute("title", item.title);
            card.setAttribute("type", item.type);
            card.setAttribute("year", item.year);
            card.setAttribute("image", item.image);

            grids.recent.appendChild(card);
            if (item.type === "movie") grids.movies.appendChild(card.cloneNode(true));
            if (item.type === "tv") grids.tv.appendChild(card.cloneNode(true));
        });
    }

    renderMedia();

    // -------------------------
    // 4️⃣ Search & Filter
    // -------------------------
    const searchInput = document.getElementById("searchInput");
    const filterType = document.getElementById("filterType");

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

    searchInput.addEventListener("input", filterMedia);
    filterType.addEventListener("change", filterMedia);
});

// -------------------------
// 5️⃣ NAS connection status
// -------------------------
function checkNASConnection() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 500);
    });
}

// -------------------------
// 6️⃣ Media player
// -------------------------
function playMedia(mediaId, mediaType) {
    console.log(`Playing ${mediaType} with ID: ${mediaId}`);
}
</script>
