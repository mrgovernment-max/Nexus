// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navMenu = document.getElementById("nav-menu");

mobileMenuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  mobileMenuBtn.innerHTML = navMenu.classList.contains("active")
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll("#nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

//Theme toggle

const theme = document.getElementById("theme");

theme.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");

  theme.innerHTML = isDark
    ? `<i class="fas fa-moon"></i>`
    : `<i class="fas fa-sun"></i>`;
});

// Newsletter form submission
const newsletterForm = document.getElementById("subscribe-form");
newsletterForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const emailInput = this.querySelector('input[type="email"]');
  const email = emailInput.value;

  if (email) {
    alert(
      `Thank you for subscribing with ${email}! You'll receive our newsletter soon.`
    );
    emailInput.value = "";
  }
});

// Product card hover effect enhancement
const productCards = document.querySelectorAll(".product-card");
productCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (this.getAttribute("href") !== "#") {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    }
  });
});

//add pics n maybe vids to customer testimonials
//more textimonials and better shoes
