document.addEventListener("DOMContentLoaded", () => {
  // Testimonial Slider
  let currentSlide = 0;
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");

  function showSlide(n) {
    // Hide all slides
    slides.forEach((slide) => {
      slide.style.display = "none";
    });

    // Remove active class from all dots
    dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    // Show the selected slide and activate its dot
    slides[n].style.display = "block";
    dots[n].classList.add("active");
    currentSlide = n;
  }

  // Initialize slider
  showSlide(0);

  // Add click event to dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  // Auto slide change
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 3000);

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

  const loadBtn = document.getElementById("load-products-btn");
  const productsGrid = document.querySelector(".products-grid");

  //Loading shadows

  function showSkeletons(count = 10) {
    productsGrid.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const skel = document.createElement("div");
      skel.className = "product-card skeleton";
      skel.innerHTML = `
        <div class="skeleton-img"></div>
        <div class="product-info">
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
        </div>
      `;
      productsGrid.appendChild(skel);
    }
  }

  loadBtn.addEventListener("click", async () => {
    loadBtn.classList.add("loading");
    loadBtn.disabled = true;

    showSkeletons();

    try {
      const res = await fetch(
        "https://backendroutes-lcpt.onrender.com/products"
      );

      if (!res.ok) throw new Error("Fetch failed");

      const products = await res.json();

      if (!Array.isArray(products) || products.length === 0) {
        throw new Error("No products");
      }

      productsGrid.innerHTML = "";

      products.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.style.animationDelay = `${index * 0.3}s`;

        card.innerHTML = `
          <div class="product-image">
          <img 
          src="${product.img_url}" 
          alt="${product.name}" 
          class="product-img"
          data-id="${product.id}"
        />
        
          </div>
          <div class="product-info">
            <div class="product-category">${product.availability}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">$${product.price}</div>
          </div>
        `;

        productsGrid.appendChild(card);
      });

      //Pass Products Property to dt page

      document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("product-img")) return;

        const id = Number(e.target.dataset.id);

        const product = products.find((p) => p.id === id);
        if (!product) return;

        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "nexusdt.html";
      });

      // Remove button cleanly
      setTimeout(() => {
        loadBtn.remove();
      }, 300);
    } catch (err) {
      console.error(err);
      productsGrid.innerHTML = `<p class="error-text">Could not load products.</p>`;
      loadBtn.classList.remove("loading");
      loadBtn.disabled = false;
    }
  });

  // Newsletter form submission
  // Newsletter form submission
  const form = document.getElementById("subscribe-form");
  const button = form.querySelector("#subscribe-btn");
  const responseMsg = document.getElementById("response-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector("input[type='email']");
    const email = emailInput.value.trim();

    if (!email) {
      responseMsg.style.color = "#dc3545";
      responseMsg.textContent = "Please enter your email address.";
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      responseMsg.style.color = "#dc3545";
      responseMsg.textContent = "Please enter a valid email address.";
      return;
    }

    button.classList.add("loading");
    responseMsg.textContent = "";
    responseMsg.style.color = "";

    try {
      const res = await fetch(
        "https://backendroutes-lcpt.onrender.com/nexus_newsletter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        responseMsg.style.color = "#28a745";
        responseMsg.textContent = data.message;
        form.reset();

        // Clear success message after 5 seconds
        setTimeout(() => {
          if (responseMsg.textContent === data.message) {
            responseMsg.textContent = "";
          }
        }, 5000);
      } else {
        responseMsg.style.color = "#dc3545";
        responseMsg.textContent = data.message || "Something went wrong!";
      }
    } catch (err) {
      console.error("Fetch error:", err);
      responseMsg.style.color = "#dc3545";
      responseMsg.textContent =
        "Network error. Please check your connection and try again.";
    } finally {
      button.classList.remove("loading");
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

  //add pics n maybe vids to customer testimonials
  //more textimonials and better shoes
});
