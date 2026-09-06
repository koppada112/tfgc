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
// CART
// ============================

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


// ============================
// ELEMENTS
// ============================

const orderItems =
    document.getElementById("orderItems");

const totalAmount =
    document.getElementById("totalAmount");

const savedAddressesCheckout =
    document.getElementById(
        "savedAddressesCheckout"
    );


// ============================
// DISPLAY ORDER ITEMS
// ============================

function displayOrderItems() {

    if (cart.length === 0) {

        orderItems.innerHTML = `
            <p class="empty-cart-message">
                Your cart is empty
            </p>
        `;

        return;

    }


    let total = 0;

    orderItems.innerHTML = "";


    cart.forEach((item) => {

        const price =
            Number(item.price);

        const quantity =
            item.quantity || 1;


        total +=
            price * quantity;


        orderItems.innerHTML += `

            <div class="checkout-product">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="checkout-product-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        ₹${price}
                    </p>

                    <small>
                        Quantity: ${quantity}
                    </small>

                </div>

            </div>

        `;

    });


    totalAmount.innerText =
        "₹" + total;

}


// ============================
// LOAD SAVED ADDRESSES
// ============================

async function loadSavedAddresses(userId) {

    if (!savedAddressesCheckout) return;


    try {

        const addressesQuery = query(

            collection(db, "addresses"),

            where(
                "userId",
                "==",
                userId
            )

        );


        const snapshot =
            await getDocs(addressesQuery);


        if (snapshot.empty) {

            savedAddressesCheckout.innerHTML = `
                <p class="no-saved-address">
                    No saved addresses found.
                </p>
            `;

            return;

        }


        savedAddressesCheckout.innerHTML = "";


        snapshot.forEach((addressDoc) => {

            const address =
                addressDoc.data();


            const addressCard =
                document.createElement("div");


            addressCard.className =
                "checkout-address-card";


            addressCard.innerHTML = `

                <div class="address-select-icon">

                    <i class="fa-regular fa-circle"></i>

                </div>


                <div class="checkout-address-info">

                    <h4>
                        ${address.name || ""}
                    </h4>

                    <p>
                        ${address.phone || ""}
                    </p>

                    <p>
                        ${address.address || ""}
                    </p>

                    <p>
                        ${address.city || ""} -
                        ${address.pincode || ""}
                    </p>

                </div>

            `;


            // SELECT ADDRESS

            addressCard.addEventListener(
                "click",
                () => {


                    // REMOVE SELECTION FROM ALL

                    document
                        .querySelectorAll(
                            ".checkout-address-card"
                        )
                        .forEach(card => {

                            card.classList.remove(
                                "selected-checkout-address"
                            );


                            const icon =
                                card.querySelector("i");


                            icon.classList.remove(
                                "fa-circle-dot"
                            );

                            icon.classList.add(
                                "fa-circle"
                            );

                        });


                    // ADD SELECTION

                    addressCard.classList.add(
                        "selected-checkout-address"
                    );


                    const selectedIcon =
                        addressCard.querySelector("i");


                    selectedIcon.classList.remove(
                        "fa-circle"
                    );

                    selectedIcon.classList.add(
                        "fa-circle-dot"
                    );


                    // AUTO FILL FORM

                    document
                        .getElementById("customerName")
                        .value =
                        address.name || "";


                    document
                        .getElementById("customerPhone")
                        .value =
                        address.phone || "";


                    document
                        .getElementById("customerAddress")
                        .value =
                        address.address || "";


                    document
                        .getElementById("customerCity")
                        .value =
                        address.city || "";


                    document
                        .getElementById("customerPincode")
                        .value =
                        address.pincode || "";

                }
            );


            savedAddressesCheckout.appendChild(
                addressCard
            );

        });


    } catch (error) {

        console.error(
            "Error loading addresses:",
            error
        );

        savedAddressesCheckout.innerHTML = `
            <p class="no-saved-address">
                Unable to load saved addresses.
            </p>
        `;

    }

}


// ============================
// PLACE ORDER
// ============================

window.placeOrder =
async function () {


    const currentUser =
        auth.currentUser;


    if (!currentUser) {

        alert("Please login first");

        window.location.href =
            "login.html";

        return;

    }


    const name =
        document
            .getElementById("customerName")
            .value
            .trim();


    const phone =
        document
            .getElementById("customerPhone")
            .value
            .trim();


    const address =
        document
            .getElementById("customerAddress")
            .value
            .trim();


    const city =
        document
            .getElementById("customerCity")
            .value
            .trim();


    const pincode =
        document
            .getElementById("customerPincode")
            .value
            .trim();


    // VALIDATION

    if (
        !name ||
        !phone ||
        !address ||
        !city ||
        !pincode
    ) {

        alert(
            "Please fill all delivery details"
        );

        return;

    }


    if (phone.length !== 10) {

        alert(
            "Please enter a valid 10-digit mobile number"
        );

        return;

    }


    if (pincode.length !== 6) {

        alert(
            "Please enter a valid 6-digit pincode"
        );

        return;

    }


    if (cart.length === 0) {

        alert("Your cart is empty");

        return;

    }


    // PAYMENT METHOD

    const paymentMethod =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    // CALCULATE TOTAL

    let total = 0;


    cart.forEach((item) => {

        total +=
            Number(item.price) *
            (item.quantity || 1);

    });


    try {


        // SAVE ORDER

        await addDoc(

            collection(db, "orders"),

            {

                // IMPORTANT
                userId:
                    currentUser.uid,

                customerName:
                    name,

                phone:
                    phone,

                address:
                    address,

                city:
                    city,

                pincode:
                    pincode,

                items:
                    cart,

                totalAmount:
                    total,

                paymentMethod:
                    paymentMethod,

                status:
                    "Order Placed",

                createdAt:
                    serverTimestamp()

            }

        );


        // CLEAR CART

        localStorage.removeItem(
            "cart"
        );


        alert(
            "🎉 Order placed successfully!"
        );


        window.location.href =
            "myorders.html";


    } catch (error) {

        console.error(
            "Order Error:",
            error
        );

        alert(
            "Order could not be placed. Please try again."
        );

    }

};


// ============================
// AUTH CHECK
// ============================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            loadSavedAddresses(
                user.uid
            );

        }

        else {

            alert(
                "Please login to continue"
            );

            window.location.href =
                "login.html";

        }

    }
);


// ============================
// INITIAL LOAD
// ============================

displayOrderItems();