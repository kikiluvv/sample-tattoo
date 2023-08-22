const closeButton = document.getElementById("burger");
const menu = document.querySelector(".mobile-nav-container");

closeButton.addEventListener("click", () => {
  // Toggle the class on the menu element
  menu.classList.toggle("menu-open");
  
  // Toggle the class on the burger icon
  closeButton.classList.toggle("ri-close-line");
  closeButton.classList.toggle("ri-menu-line");
});
