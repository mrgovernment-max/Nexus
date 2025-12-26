document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://backendroutes-lcpt.onrender.com";

  // Password toggle
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const eyeIcon = togglePassword.querySelector("i");

  togglePassword.addEventListener("click", function () {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    eyeIcon.className = type === "text" ? "far fa-eye-slash" : "far fa-eye";
  });

  // Form submission
  const loginForm = document.getElementById("login-form");
  const submitButton = loginForm.querySelector(".submit-btn");
  const messageContainer = document.getElementById("message-container");

  function showMessage(text, type) {
    messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
    const msg = messageContainer.querySelector(".message");
    msg.style.display = "block";

    if (type === "error") {
      setTimeout(() => {
        msg.style.display = "none";
      }, 3000);
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        showMessage("Please fill in all fields", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address", "error");
        return;
      }

      submitButton.classList.add("loading");
      submitButton.disabled = true;

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }

        sessionStorage.setItem("user", JSON.stringify(data.user));
        showMessage("✓ Login successful! Redirecting...", "success");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } catch (err) {
        showMessage(err.message || "Login failed", "error");
        submitButton.classList.remove("loading");
        submitButton.disabled = false;
      }
    });
  }

  // Auto-focus email input on load for better mobile UX
  document.getElementById("email").focus();
});
