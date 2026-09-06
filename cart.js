const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");


function displayCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItemsContainer.innerHTML = "";


    // Empty Cart
    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <div class="empty-cart">

                <div class="cart-icon">
                    <i class="fa-solid fa-cart-shopping"></i>
                </div>

                <h2>Your Cart is Empty</h2>

                <p>
                    Looks like you haven't added any jewellery yet.
                </p>

                <a href="products.html" class="shop-now-btn">
                    Start Shopping
                </a>

            </div>
        `;

        cartTotal.textContent = "₹0";
        return;
    }


    let total = 0;


    cart.forEach((product, index) => {

        total += product.price * product.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img src="${product.image}" alt="${product.name}">

            <div class="cart-item-details">

                <h3>${product.name}</h3>

                <p>${product.category}</p>

                <h3>₹${product.price}</h3>

                <div class="quantity-controls">

                    <button onclick="changeQuantity(${index}, -1)">−</button>

                    <span>${product.quantity}</span>

                    <button onclick="changeQuantity(${index}, 1)">+</button>

                </div>

            </div>

            <button class="remove-btn"
                onclick="removeFromCart(${index})">
                Remove
            </button>

        `;

        cartItemsContainer.appendChild(cartItem);

    });


    cartTotal.textContent = "₹" + total;

}



function changeQuantity(index, change) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}



function removeFromCart(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}


displayCart();