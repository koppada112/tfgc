import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const productsGrid = 
    document.getElementById("productsGrid");

const productSearchInput =
    document.getElementById("productSearchInput");

const filterButtons =
    document.querySelectorAll(".filter");

let selectedCategory = "All";
let searchTerm = ""
async function loadProducts() {

    try {

        const querySnapshot = await getDocs(
            collection(db, "products")
        );

        productsGrid.innerHTML = "";
         let foundProducts = 0;

        if (querySnapshot.empty) {

            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fa-solid fa-gem"></i>
                    <h3>No Products Available</h3>
                    <p>New collections coming soon.</p>
                </div>
            `;

            return;
        }


        querySnapshot.forEach((doc) => {

            const product = doc.data();
            const productName =
                (product.name || "").toLowerCase();

          const productCategory =
              (product.category || "").toLowerCase();

if (
    searchTerm !== "" &&
    !productName.includes(searchTerm) &&
    !productCategory.includes(searchTerm)
) {
    return;
}
if (
        selectedCategory !== "All" &&
        productCategory !== selectedCategory.toLowerCase()
    ) {
        return;
    }
foundProducts++;
            const productCard =
                document.createElement("div");

            productCard.className = "product-card";


            // Check wishlist status
            const wishlist =
                JSON.parse(
                    localStorage.getItem("wishlist")
                ) || [];

            const alreadyInWishlist =
                wishlist.some(
                    item => item.id === doc.id
                );


            productCard.innerHTML = `

                <div class="product-image-container">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <button class="wishlist-icon">
                        <i class="${alreadyInWishlist
                            ? "fa-solid"
                            : "fa-regular"} fa-heart"></i>
                    </button>

                </div>


                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <p class="product-price">
                        ₹${product.price}
                    </p>

                    <button class="add-cart-btn">
                        Add to Cart
                    </button>

                </div>

            `;


            /* ADD TO CART */

            const addCartBtn =
                productCard.querySelector(".add-cart-btn");

            addCartBtn.addEventListener("click", () => {

                addToCart({
                    id: doc.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category
                });

            });


            /* WISHLIST */

            const wishlistBtn =
                productCard.querySelector(".wishlist-icon");

            wishlistBtn.addEventListener("click", () => {

                const wishlistProduct = {
                    id: doc.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category
                };


                const isAdded =
                    addToWishlist(wishlistProduct);


                const heartIcon =
                    wishlistBtn.querySelector("i");


                if (isAdded) {

                    heartIcon.classList.remove("fa-regular");
                    heartIcon.classList.add("fa-solid");

                } else {

                    heartIcon.classList.remove("fa-solid");
                    heartIcon.classList.add("fa-regular");

                }

            });
             /* PRODUCT DETAILS */

const productImage =
    productCard.querySelector(".product-image-container img");

const productNameElement =
    productCard.querySelector(".product-info h3");


function openProductDetails() {

    window.location.href =
        "product-details.html?id=" +
        encodeURIComponent(doc.id);

}


productImage.addEventListener(
    "click",
    openProductDetails
);

productNameElement.addEventListener(
    "click",
    openProductDetails
);

            productsGrid.appendChild(productCard);

        });
     if (foundProducts === 0 && searchTerm !== "") {

    productsGrid.innerHTML = `
        <div class="no-products">

            <i class="fa-solid fa-magnifying-glass"></i>

            <h3>Items Not Found</h3>

            <p>
                We couldn't find any jewellery matching
                "${searchTerm}"
            </p>

            <a href="products.html" class="shop-now-btn">
                View All Products
            </a>

        </div>
    `;

}
    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        productsGrid.innerHTML = `
            <div class="no-products">
                <h3>Error loading products</h3>
                <p>Please try again later.</p>
            </div>
        `;

    }

}


/* WISHLIST FUNCTION */

function addToWishlist(product) {

    let wishlist =
        JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];


    const existingProduct =
        wishlist.find(
            item => item.id === product.id
        );


    if (existingProduct) {

        wishlist =
            wishlist.filter(
                item => item.id !== product.id
            );


        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        return false;

    } else {

        wishlist.push(product);


        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        return true;

    }

}

//* CART FUNCTION */

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

        existingProduct.quantity =
            (existingProduct.quantity || 1) + 1;

    } else {

        product.quantity = 1;

        cart.push(product);

    }


    // SAVE CART

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // ============================
    // UPDATE CART COUNT
    // ============================

    let totalItems = 0;

    cart.forEach(item => {

        totalItems +=
            Number(item.quantity) || 1;

    });


    document
        .querySelectorAll(".cart-count")
        .forEach(badge => {

            badge.textContent =
                totalItems;

            badge.style.display =
                totalItems > 0
                    ? "flex"
                    : "none";

        });


    alert(
        product.name +
        " added to cart! 🛒"
    );

}
/* CATEGORY FILTER */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedCategory =
            button.innerText.trim();


        filterButtons.forEach(btn => {

            btn.classList.remove("active-filter");

        });


        button.classList.add("active-filter");


        loadProducts();

    });

});
/* LOAD PRODUCTS */
loadProducts();