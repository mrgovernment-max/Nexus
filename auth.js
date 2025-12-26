const API_BASE = "https://backendroutes-lcpt.onrender.com";

// SIGN UP
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const first_name = document.getElementById("first_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(first_name, email, password);

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Account created. Please log in.");
      window.location.href = "login.html";
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  });
}

// LOGIN
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Store user session
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "index.html";
    } catch (err) {
      alert(err.message || "Login failed");
    }
  });
}
