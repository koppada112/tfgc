import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const productDetails =
    document.getElementById("productDetails");


const urlParams =
    new URLSearchParams(window.location.search);


const productId =
    urlParams.get("id");



async function loadProductDetails() {

    if (!productId) {

        productDetails.innerHTML = `
            <div class="no-products">
                <h3>Product not found</h3>
            </div>
        `;

        return;
    }


    try {

        const productRef =
            doc(db, "products", productId);


        const productSnap =
            await getDoc(productRef);


        if (!productSnap.exists()) {

            productDetails.innerHTML = `
                <div class="no-products">
                    <h3>Product not found</h3>
                </div>
            `;

            return;
        }


        const product =
            productSnap.data();


        /* =========================
           CHECK WISHLIST
        ========================= */

        let wishlist =
            JSON.parse(
                localStorage.getItem("wishlist")
            ) || [];


        const alreadyInWishlist =
            wishlist.some(
                item => item.id === productSnap.id
            );



        /* =========================
           PRODUCT DETAILS HTML
        ========================= */

        productDetails.innerHTML = `

            <div class="product-details-card">


                <!-- PRODUCT IMAGE -->

                <div class="details-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>



                <!-- PRODUCT INFORMATION -->

                <div class="details-info">

                    <p class="details-category">
                        ${product.category}
                    </p>


                    <h1 class="details-name">
                        ${product.name}
                    </h1>


                    <h2 class="details-price">
                        ₹${product.price}
                    </h2>


                    <div class="details-line"></div>


                    <h3>
                        Product Description
                    </h3>


                    <p class="details-description">
                        ${
                            product.description ||
                            "Beautiful jewellery for every occasion."
                        }
                    </p>



                    <!-- ACTION BUTTONS -->

                    <div class="details-actions">


                        <!-- WISHLIST -->

                        <button
                            id="addDetailsWishlist"
                            class="details-wishlist-btn"
                        >

                            <i class="${
                                alreadyInWishlist
                                    ? "fa-solid"
                                    : "fa-regular"
                            } fa-heart"></i>

                            Wishlist

                        </button>



                        <!-- CART -->

                        <button
                            id="addDetailsCart"
                            class="details-cart-btn"
                        >

                            <i class="fa-solid fa-cart-shopping"></i>

                            Add to Cart

                        </button>


                    </div>



                    <!-- BUY NOW -->

                    <button
                        id="buyNowBtn"
                        class="buy-now-btn"
                    >

                        <i class="fa-solid fa-bolt"></i>

                        Buy Now

                    </button>

                </div>

            </div>

        `;



        /* =========================
           ADD TO CART
        ========================= */

        const addCartBtn =
            document.getElementById(
                "addDetailsCart"
            );


        addCartBtn.addEventListener(
            "click",
            () => {

                addToCart({

                    id: productSnap.id,

                    name: product.name,

                    price: product.price,

                    image: product.image,

                    category: product.category

                });

            }
        );



        /* =========================
           WISHLIST
        ========================= */

        const wishlistBtn =
            document.getElementById(
                "addDetailsWishlist"
            );


        wishlistBtn.addEventListener(
            "click",
            () => {

                let wishlist =
                    JSON.parse(
                        localStorage.getItem("wishlist")
                    ) || [];


                const existingProduct =
                    wishlist.find(
                        item =>
                            item.id === productSnap.id
                    );


                const heartIcon =
                    wishlistBtn.querySelector("i");


                if (existingProduct) {

                    wishlist =
                        wishlist.filter(
                            item =>
                                item.id !== productSnap.id
                        );


                    heartIcon.className =
                        "fa-regular fa-heart";


                    alert(
                        "Removed from wishlist"
                    );


                } else {

                    wishlist.push({

                        id: productSnap.id,

                        name: product.name,

                        price: product.price,

                        image: product.image,

                        category: product.category

                    });


                    heartIcon.className =
                        "fa-solid fa-heart";


                    alert(
                        "Added to wishlist ❤️"
                    );

                }


                localStorage.setItem(
                    "wishlist",
                    JSON.stringify(wishlist)
                );

            }
        );



        /* =========================
           BUY NOW
        ========================= */

        const buyNowBtn =
            document.getElementById(
                "buyNowBtn"
            );


        buyNowBtn.addEventListener(
            "click",
            () => {

                const buyNowProduct = {

                    id: productSnap.id,

                    name: product.name,

                    price: product.price,

                    image: product.image,

                    category: product.category,

                    quantity: 1

                };


                localStorage.setItem(
                    "buyNowProduct",
                    JSON.stringify(buyNowProduct)
                );


                window.location.href =
                    "checkout.html";

            }
        );

    }


    catch (error) {

        console.error(
            "Error loading product:",
            error
        );


        productDetails.innerHTML = `

            <div class="no-products">

                <h3>
                    Error loading product
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}



/* =========================
   ADD TO CART FUNCTION
========================= */

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



/* LOAD PRODUCT */

loadProductDetails();