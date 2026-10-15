
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeButtons = document.querySelectorAll("[data-theme-toggle]");
  const savedTheme = localStorage.getItem("storybook-theme");
  if (savedTheme === "dark") body.classList.add("dark");
  themeButtons.forEach(btn => btn.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("storybook-theme", body.classList.contains("dark") ? "dark" : "light");
  }));

  document.querySelectorAll("[data-like]").forEach(btn => {
    const key = "storybook-like-" + btn.dataset.like;
    const update = () => {
      const liked = localStorage.getItem(key) === "yes";
      btn.classList.toggle("liked", liked);
      btn.setAttribute("aria-pressed", String(liked));
      btn.textContent = liked ? "♥ Liked" : "♡ Like";
    };
    update();
    btn.addEventListener("click", () => {
      localStorage.setItem(key, localStorage.getItem(key) === "yes" ? "no" : "yes");
      update();
    });
  });

  const genre = document.querySelector("#genreFilter");
  const cards = [...document.querySelectorAll(".book-card")];
  const applyFilter = () => {
    if (!genre) return;
    const g = genre.value;
    let count = 0;
    cards.forEach(card => {
      const matches = !g || (card.dataset.genre || "").trim().toLowerCase() === g.trim().toLowerCase();
      card.hidden = !matches;
      if (matches) count++;
    });
    const empty = document.querySelector("#emptyState");
    if (empty) empty.hidden = count !== 0;
    const resultCount = document.querySelector("#resultCount");
    if (resultCount) resultCount.textContent = `${count} ${count === 1 ? "story" : "stories"} found`;
  };
  if (genre) genre.addEventListener("change", applyFilter);
  applyFilter();

  const synopsisToggle = document.querySelector("[data-synopsis-toggle]");
  if (synopsisToggle) synopsisToggle.addEventListener("click", () => {
    const panel = document.querySelector("#fullSynopsis");
    const isHidden = panel.hidden;
    panel.hidden = !isHidden;
    synopsisToggle.textContent = isHidden ? "Hide synopsis" : "Show synopsis";
  });

  const modal = document.querySelector("#bookModal");
  document.querySelectorAll("[data-details]").forEach(btn => btn.addEventListener("click", () => {
    if (!modal) return;
    document.querySelector("#modalTitle").textContent = btn.dataset.title;
    document.querySelector("#modalAuthor").textContent = "By " + btn.dataset.author;
    document.querySelector("#modalGenre").textContent = btn.dataset.genre;
    document.querySelector("#modalSynopsis").textContent = btn.dataset.synopsis;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }));
  if (modal) {
    modal.querySelectorAll("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => {
      modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
    }));
    modal.addEventListener("click", e => { if (e.target === modal) { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); } });
    document.addEventListener("keydown", e => { if (e.key === "Escape") { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); } });
  }

  const reader = document.querySelector("#readingArea");
  const progress = document.querySelector("#progressFill");
  const progressText = document.querySelector("#progressText");
  if (reader && progress) {
    const updateProgress = () => {
      const rect = reader.getBoundingClientRect();
      const total = reader.offsetHeight - window.innerHeight;
      const passed = Math.max(0, -rect.top);
      const percent = total <= 0 ? (rect.top < window.innerHeight ? 100 : 0) : Math.min(100, Math.max(0, passed / total * 100));
      progress.style.width = percent + "%";
      if (progressText) progressText.textContent = Math.round(percent) + "% read";
    };
    window.addEventListener("scroll", updateProgress, {passive:true});
    updateProgress();
  }
});
