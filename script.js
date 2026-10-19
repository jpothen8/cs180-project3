const siteUrl = document.querySelector("#site-url");
if (["http:", "https:"].includes(location.protocol)) {
  const address = location.origin + location.pathname;
  siteUrl.textContent = address;
  siteUrl.href = address;
}

const viewer = document.querySelector("#image-viewer");
const viewerImage = viewer.querySelector("img");
for (const link of document.querySelectorAll("a.image-link")) {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const source = link.querySelector("img");
    const caption = link.closest("figure").querySelector("figcaption").textContent;
    viewerImage.src = source.src;
    viewerImage.alt = source.alt;
    viewer.querySelector("p").textContent = caption;
    viewer.showModal();
  });
}
viewer.querySelector("button").addEventListener("click", () => viewer.close());
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});

const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const link of document.querySelectorAll("nav a")) {
      link.setAttribute("aria-current", String(link.hash === "#" + entry.target.id));
    }
  }
}, { rootMargin:"-5% 0px -65% 0px", threshold:0 });
for (const section of document.querySelectorAll("main section")) sectionObserver.observe(section);

// Request every figure now so native printing also has all comparison variants ready.
const reportImages = Array.from(document.querySelectorAll("main img, header img"));
for (const image of reportImages) image.loading = "eager";
let printState;
window.addEventListener("beforeprint", () => {
  if (printState) return;
  const details = Array.from(document.querySelectorAll("details"));
  printState = details.map((detail) => detail.open);
  for (const detail of details) detail.open = true;
});
window.addEventListener("afterprint", () => {
  if (!printState) return;
  document.querySelectorAll("details").forEach((detail, index) => {
    detail.open = printState[index];
  });
  printState = undefined;
});
