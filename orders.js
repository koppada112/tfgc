import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


let cart = JSON.parse(localStorage.getItem("cart")) || [];


const orderItems = document.getElementById("orderItems");
const totalAmount = document.getElementById("totalAmount");


function displayOrderItems() {

    if (cart.length === 0) {

        orderItems.innerHTML = `
            <p style="text-align:center;">
                Your cart is empty
            </p>
        `;

        return;
    }


    let total = 0;

    orderItems.innerHTML = "";


    cart.forEach((item) => {

        let price = Number(item.price);
        let quantity = item.quantity || 1;

        total += price * quantity;


        orderItems.innerHTML += `

            <div class="checkout-product">

                <img src="${item.image}" alt="${item.name}">

                <div>

                    <h4>${item.name}</h4>

                    <p>₹${price}</p>

                    <small>Quantity: ${quantity}</small>

                </div>

            </div>

        `;
    });


    totalAmount.innerText = "₹" + total;

}


displayOrderItems();



window.placeOrder = async function () {

    const name = document.getElementById("customerName").value.trim();

    const phone = document.getElementById("customerPhone").value.trim();

    const address = document.getElementById("customerAddress").value.trim();

    const pincode = document.getElementById("customerPincode").value.trim();


    if (!name || !phone || !address || !pincode) {

        alert("Please fill all delivery details");

        return;
    }


    if (cart.length === 0) {

        alert("Your cart is empty");

        return;
    }


    let total = 0;


    cart.forEach((item) => {

        total += Number(item.price) * (item.quantity || 1);

    });


    try {

       const currentUser = auth.currentUser;

if (!currentUser) {

    alert("Please login first");

    window.location.href = "login.html";

    return;
}


await addDoc(collection(db, "orders"), {

    userId: currentUser.uid,

    customerName: name,

    phone: phone,

    address: address,

    pincode: pincode,

    items: cart,

    totalAmount: total,

    paymentMethod: "COD",

    status: "Order Placed",

    createdAt: serverTimestamp()

});
        // Clear Cart
        localStorage.removeItem("cart");

        alert("Order placed successfully! 🎉");


        window.location.href = "myorders.html";


    } catch (error) {

        console.error("Order Error:", error);

        alert("Something went wrong. Try again.");

    }

};