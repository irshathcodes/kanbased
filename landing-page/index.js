document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector(".nav");

  function onScroll() {
    if (window.scrollY > 20) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll);

  const year = document.getElementById("year");
  year.textContent = new Date().getFullYear();
});
