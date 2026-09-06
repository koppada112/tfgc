import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ============================
// GET PRODUCT DETAILS FROM URL
// ============================

const params = new URLSearchParams(
    window.location.search
);

const productName =
    params.get("name");

const productImage =
    params.get("image");

const productPrice =
    params.get("price");


// ============================
// ELEMENTS
// ============================

const ratingProduct =
    document.getElementById("ratingProduct");

const stars =
    document.querySelectorAll(
        ".star-rating i"
    );

const reviewText =
    document.getElementById("reviewText");


// ============================
// VARIABLES
// ============================

let selectedRating = 0;

let currentUser = null;


// ============================
// DISPLAY PRODUCT
// ============================

function displayProduct() {

    if (!productName) {

        ratingProduct.innerHTML = `
            <p>Product details not found.</p>
        `;

        return;

    }


    ratingProduct.innerHTML = `

        <div class="rating-product-info">

            <img
                src="${productImage}"
                alt="${productName}"
            >

            <div>

                <h4>
                    ${productName}
                </h4>

                <p>
                    ₹${productPrice}
                </p>

            </div>

        </div>

    `;

}


// ============================
// STAR SELECTION
// ============================

stars.forEach((star) => {

    star.addEventListener(
        "click",
        () => {

            selectedRating =
                Number(
                    star.dataset.rating
                );


            stars.forEach((item) => {

                const rating =
                    Number(
                        item.dataset.rating
                    );


                if (
                    rating <= selectedRating
                ) {

                    item.classList.add(
                        "active"
                    );

                    item.classList.remove(
                        "fa-regular"
                    );

                    item.classList.add(
                        "fa-solid"
                    );

                }

                else {

                    item.classList.remove(
                        "active"
                    );

                    item.classList.remove(
                        "fa-solid"
                    );

                    item.classList.add(
                        "fa-regular"
                    );

                }

            });

        }
    );

});


// ============================
// CHECK LOGIN
// ============================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            currentUser = user;

        }

        else {

            alert(
                "Please login to rate products"
            );

            window.location.href =
                "login.html";

        }

    }
);


// ============================
// SUBMIT RATING
// ============================

window.submitRating =
async function () {

    if (!currentUser) {

        alert(
            "Please login first"
        );

        return;

    }


    if (!selectedRating) {

        alert(
            "Please select a star rating"
        );

        return;

    }


    if (!productName) {

        alert(
            "Product not found"
        );

        return;

    }


    try {

        // CHECK EXISTING REVIEW

        const reviewQuery = query(

            collection(
                db,
                "reviews"
            ),

            where(
                "userId",
                "==",
                currentUser.uid
            ),

            where(
                "productName",
                "==",
                productName
            )

        );


        const existingReview =
            await getDocs(
                reviewQuery
            );


        if (!existingReview.empty) {

            alert(
                "You have already rated this product"
            );

            return;

        }


        // SAVE REVIEW

        await addDoc(

            collection(
                db,
                "reviews"
            ),

            {

                userId:
                    currentUser.uid,

                userName:
                    currentUser.displayName ||
                    "Customer",

                productName:
                    productName,

                productImage:
                    productImage,

                productPrice:
                    productPrice,

                rating:
                    selectedRating,

                review:
                    reviewText.value.trim(),

                createdAt:
                    serverTimestamp()

            }

        );


        alert(
            "⭐ Thank you for your rating!"
        );


        window.location.href =
            "myorders.html";


    } catch (error) {

        console.error(
            "Rating Error:",
            error
        );

        alert(
            "Unable to submit rating"
        );

    }

};


// ============================
// INITIAL LOAD
// ============================

displayProduct();