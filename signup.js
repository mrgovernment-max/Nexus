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

  // Form submission - EXACT SAME LOGIC AS YOU PROVIDED
  const signupForm = document.getElementById("signup-form");
  const submitButton = document.querySelector(".submit-btn");
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

  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const first_name = document.getElementById("first_name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Basic validation
      if (!first_name || !email || !password) {
        showMessage("Please fill in all fields", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address", "error");
        return;
      }

      if (password.length < 6) {
        showMessage("Password must be at least 6 characters", "error");
        return;
      }

      // Add loading state
      submitButton.classList.add("loading");
      submitButton.disabled = true;

      try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ first_name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Signup failed");
        }

        // Show success message
        showMessage(
          "✓ Account created successfully! Redirecting to login...",
          "success"
        );

        // Redirect after delay
        setTimeout(() => {
          alert("Account created. Please log in.");
          window.location.href = "login.html";
        }, 1500);
      } catch (err) {
        // Show error message
        showMessage(err.message || "Signup failed", "error");

        // Remove loading state on error
        submitButton.classList.remove("loading");
        submitButton.disabled = false;
      }
    });
  }
});
