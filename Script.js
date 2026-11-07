const cartCount = document.querySelector("#cartCount");
const toast = document.querySelector("#toast");
const kitButton = document.querySelector("#kitButton");
const searchInput = document.querySelector(".search input");

let cart = 0;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

kitButton?.addEventListener("click", () => {
  showToast("Seu kit personalizado começa por aqui. Escolha uma modalidade para continuar.");
});

document.querySelectorAll(".product-link").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const name = link.closest(".category-card").querySelector("h3").textContent;
    showToast(`Em breve: catálogo de ${name}.`);
  });
});

searchInput?.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    const term = searchInput.value.trim();
    showToast(term ? `Buscando por “${term}”...` : "Digite um produto para pesquisar.");
  }
});

document.querySelector(".menu-toggle")?.addEventListener("click", () => {
  const nav = document.querySelector(".main-nav");
  const isOpen = nav.dataset.open === "true";
  nav.dataset.open = String(!isOpen);
  nav.style.display = isOpen ? "" : "flex";
  if (!isOpen) {
    nav.style.position = "absolute";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.top = "68px";
    nav.style.padding = "20px";
    nav.style.background = "rgba(3,11,18,.98)";
    nav.style.flexDirection = "column";
    nav.style.alignItems = "flex-start";
    nav.style.borderBottom = "1px solid rgba(0,232,255,.25)";
  }
});
