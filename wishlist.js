const wishlistContainer =
    document.getElementById("wishlistContainer");


function loadWishlist() {

    const wishlist =
        JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];


    // EMPTY WISHLIST

    if (wishlist.length === 0) {

        wishlistContainer.innerHTML = `

            <div class="empty-wishlist">

                <i class="fa-regular fa-heart"></i>

                <h2>Your Wishlist is Empty</h2>

                <p>
                    Save your favourite jewellery here.
                </p>

                <a href="products.html" class="shop-now-btn">
                    Explore Products
                </a>

            </div>

        `;

        return;
    }


    // CREATE PRODUCTS GRID

    wishlistContainer.innerHTML =
        `<div class="wishlist-products"></div>`;


    const wishlistProducts =
        document.querySelector(".wishlist-products");


    // DISPLAY PRODUCTS

    wishlist.forEach((product) => {

        const productCard =
            document.createElement("div");

        productCard.className = "wishlist-card";


        productCard.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="wishlist-info">

                <h3>${product.name}</h3>

                <p class="wishlist-price">
                    ₹${product.price}
                </p>

                <div class="wishlist-actions">

                    <button class="move-cart-btn">
                        Add to Cart
                    </button>

                    <button class="remove-wishlist-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </div>

        `;


        // ADD TO CART

        const cartBtn =
            productCard.querySelector(".move-cart-btn");

        cartBtn.addEventListener("click", () => {

            addToCart(product);

        });


        // REMOVE FROM WISHLIST

        const removeBtn =
            productCard.querySelector(".remove-wishlist-btn");

        removeBtn.addEventListener("click", () => {

            removeFromWishlist(product.id);

        });


        wishlistProducts.appendChild(productCard);

    });

}



// ADD TO CART

function addToCart(product) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existingProduct =
        cart.find(
            item => item.id === product.id
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        product.quantity = 1;

        cart.push(product);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert(
        product.name +
        " added to cart! 🛒"
    );

}



// REMOVE FROM WISHLIST

function removeFromWishlist(productId) {

    let wishlist =
        JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];


    wishlist =
        wishlist.filter(
            product => product.id !== productId
        );


    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );


    loadWishlist();

}


// LOAD WISHLIST

loadWishlist();