document.addEventListener("DOMContentLoaded", () => {
  const stripe = Stripe(
    "pk_live_51Rpsq2LRwcoOq8wgsLstZO5LcuIqjk7M54Kisklu5AbUHZfeC1r1RDaEA6bz7iq6eDxFiR7yqLGrx80PsGYmdqGt007D5oIJL3"
  );

  // Load cart from sessionStorage
  const cart = JSON.parse(sessionStorage.getItem("cart"));
  const checkoutContent = document.getElementById("checkout-content");

  if (!cart || cart.length === 0) {
    checkoutContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your Cart is Empty</h3>
                    <p>You need to add items to your cart before checking out.</p>
                    <a href="index.html" class="shop-btn">Continue Shopping</a>
                </div>
            `;
    return;
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Render checkout page
  checkoutContent.innerHTML = `
            <div class="checkout-grid">
                <!-- Delivery Form -->
                <div class="form-container">
                    <h2 class="form-title">
                        <i class="fas fa-truck"></i>
                        Delivery Details
                    </h2>
                    
                    <form id="checkout-form">
                        <div class="row">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" id="firstName" placeholder="Enter your first name" required />
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" id="lastName" placeholder="Enter your last name" required />
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="street">Street Address</label>
                            <input type="text" id="street" placeholder="123 Main Street" required />
                        </div>
                        
                        <div class="form-group">
                            <label for="houseNumber">House / Flat Number</label>
                            <input type="text" id="houseNumber" placeholder="Apt 4B" required />
                        </div>
                        
                        <div class="row">
                            <div class="form-group">
                                <label for="town">Town / City</label>
                                <input type="text" id="town" placeholder="New York" required />
                            </div>
                            <div class="form-group">
                                <label for="county">County / State</label>
                                <input type="text" id="county" placeholder="New York" />
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="form-group">
                                <label for="postcode">Postcode / ZIP</label>
                                <input type="text" id="postcode" placeholder="10001" required />
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" placeholder="(123) 456-7890" required />
                            </div>
                        </div>
                        
                        <button type="submit" class="submit-btn">
                            <i class="fas fa-lock"></i> Proceed to Payment
                        </button>
                        
                        <div class="secure-message">
                            <i class="fas fa-shield-alt"></i>
                            Secure payment via Stripe
                        </div>
                    </form>
                    
                    <div class="security-badges">
                        <div class="badge">
                            <i class="fas fa-lock"></i>
                            <span>SSL Secure</span>
                        </div>
                        <div class="badge">
                            <i class="fas fa-credit-card"></i>
                            <span>Encrypted Payment</span>
                        </div>
                        <div class="badge">
                            <i class="fas fa-shield-alt"></i>
                            <span>PCI Compliant</span>
                        </div>
                    </div>
                </div>
                
                <!-- Order Summary -->
                <div class="order-summary">
                    <h3 class="summary-title">
                        <i class="fas fa-receipt"></i>
                        Order Summary
                    </h3>
                    
                    <div class="cart-items">
                        ${cart
                          .map(
                            (item) => `
                            <div class="cart-item">
                                <div class="item-image">
                                    <img src="${item.img_url}" alt="${item.name}">
                                </div>
                                <div class="item-info">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-details">
                                        Size: ${item.size}
                                    </div>
                                    <div class="item-price">$${item.price}</div>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                    
                    <div class="totals">
                        <div class="total-row">
                            <span>Subtotal (${cart.length} items)</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span>Shipping</span>
                            <span>${
                              shipping === 0
                                ? "FREE"
                                : `$${shipping.toFixed(2)}`
                            }</span>
                        </div>
                        <div class="total-row">
                            <span>Tax</span>
                            <span>$${tax.toFixed(2)}</span>
                        </div>
                        <div class="total-row final">
                            <span>Total</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

  // Form submission
  const checkoutForm = document.getElementById("checkout-form");
  const submitButton = checkoutForm.querySelector(".submit-btn");

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const cart = JSON.parse(sessionStorage.getItem("cart"));

      if (!cart || cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      // Get form elements
      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const street = document.getElementById("street");
      const houseNumber = document.getElementById("houseNumber");
      const town = document.getElementById("town");
      const county = document.getElementById("county");
      const postcode = document.getElementById("postcode");
      const phone = document.getElementById("phone");

      // Add loading state
      submitButton.classList.add("loading");
      submitButton.disabled = true;

      const payload = {
        customer: {
          firstName: firstName.value,
          lastName: lastName.value,
          phone: phone.value,
          address: {
            street: street.value,
            houseNumber: houseNumber.value,
            town: town.value,
            county: county.value,
            postcode: postcode.value,
          },
        },
        products: cart,
      };

      try {
        const res = await fetch(
          "https://backendroutes-lcpt.onrender.com/checkout",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        // Remove loading state
        submitButton.classList.remove("loading");
        submitButton.disabled = false;

        await stripe.redirectToCheckout({ sessionId: data.id });
      } catch (err) {
        // Remove loading state on error
        submitButton.classList.remove("loading");
        submitButton.disabled = false;

        alert(err.message || "Checkout failed");
      }
    });
  }
});
