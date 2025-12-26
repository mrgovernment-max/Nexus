const API_BASE = "https://backendroutes-lcpt.onrender.com";
const cartContent = document.getElementById("cart-content");

// Check login
const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
  cartContent.innerHTML = `
          <div class="login-prompt">
              <i class="fas fa-shopping-bag"></i>
              <h2>Sign In Required</h2>
              <p>Please log in to view your shopping cart and manage your items.</p>
              <a href="login.html" class="login-btn">Sign In to View Cart</a>
          </div>
      `;
} else {
  // Load cart for logged in user
  loadCart();
}

async function loadCart() {
  try {
    // 1️⃣ Get cart rows
    const cartRes = await fetch(`${API_BASE}/cart/${user.id}`);
    const cartItems = await cartRes.json();

    if (cartItems.length === 0) {
      cartContent.innerHTML = `
                  <div class="empty-cart">
                      <i class="fas fa-shopping-cart"></i>
                      <h2>Your Cart is Empty</h2>
                      <p>Looks like you haven't added any items to your cart yet. Start shopping to fill it up!</p>
                      <a href="index.html#products" class="continue-btn">Continue Shopping</a>
                  </div>
              `;
      return;
    }

    // 2️⃣ Extract product IDs
    const productIds = cartItems.map((item) => item.product_id);

    // 3️⃣ Fetch products
    const productRes = await fetch(`${API_BASE}/products/by-ids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    });

    const products = await productRes.json();

    // 4️⃣ Merge cart + product data
    const merged = cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.product_id);
      return {
        ...product,
        size: cartItem.size,
        cart_id: cartItem.id,
      };
    });

    renderCart(merged);

    // Update cart count
    document.getElementById("cart-count").textContent = cartItems.length;
  } catch (err) {
    cartContent.innerHTML = `
              <div class="error-container">
                  <div class="error-icon">
                      <i class="fas fa-exclamation-triangle"></i>
                  </div>
                  <p class="error-text">Failed to load cart. Please check your connection.</p>
                  <button onclick="loadCart()" class="retry-btn">Try Again</button>
              </div>
          `;
  }
}

function renderCart(items) {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    return sum + parseFloat(item.price) * (item.quantity || 1);
  }, 0);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  cartContent.innerHTML = `
          <div class="cart-items-container">
              ${items
                .map(
                  (item) => `
                  <div class="cart-item" data-id="${item.cart_id}">
                      <div class="item-header">
                          <div class="item-image">
                              <img src="${item.img_url}" alt="${item.name}">
                          </div>
                          <div class="item-info">
                              <h3 class="item-name">${item.name}</h3>
                              <div class="item-details">
                                  <p>Size: ${item.size}</p>
                                  <p >Rating: <span style="color: #ff6b35; font-weight: 700;
                                       font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif; 
                                       font-size: 20px;letter-spacing: 0.5px;"> ${
                                         item.rating
                                       } 
                                       </span>
                                       </p>
                              </div>
                              <div class="item-price">$${(
                                parseFloat(item.price) * 1
                              ).toFixed(2)}</div>
                          </div>
                      </div>
                      
                      <div class="item-actions"> 
                          <button class="remove-btn" onclick="removeItem(${
                            item.id
                          })">
                              <i class="fas fa-trash"></i>
                              <span>Remove</span>
                          </button>
                      </div>
                  </div>
              `
                )
                .join("")}
          </div>
          
          <div class="order-summary">
              <h3 class="summary-title">Order Summary</h3>
              <div class="summary-row">
                  <span>Subtotal (${items.length} items)</span>
                  <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                  <span>Shipping</span>
                  <span>${
                    shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`
                  }</span>
              </div>
              <div class="summary-row">
                  <span>Tax</span>
                  <span>$${tax.toFixed(2)}</span>
              </div>
              <div class="summary-row total">
                  <span>Total</span>
                  <span>$${total.toFixed(2)}</span>
              </div>
              
              <button class="checkout-btn" onclick="checkout()">
                  <i class="fas fa-lock"></i> PROCEED TO CHECKOUT
              </button>
          </div>
      `;
}

// Remove item from cart
async function removeItem(productId) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    alert("Please log in to manage your cart.");
    window.location.href = "login.html";
    return;
  }

  if (!confirm("Remove this item from your cart?")) return;

  try {
    const res = await fetch(
      "https://backendroutes-lcpt.onrender.com/cart/remove",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          productId,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    alert("Item removed from cart");
    loadCart(); // Reload cart items
  } catch (err) {
    console.error(err);
    alert("Failed to remove item");
  }
}

function updateQuantity(cartId, action) {
  // In a real app, you would call PATCH /cart/:id
  // fetch(`${API_BASE}/cart/${cartId}`, {
  //     method: 'PATCH',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ action: action })
  // })
  alert(`Quantity ${action === "increase" ? "increased" : "decreased"}`);
  loadCart(); // Reload cart
}

function checkout() {
  alert("Proceeding to checkout...");
  // window.location.href = 'checkout.html';
}
