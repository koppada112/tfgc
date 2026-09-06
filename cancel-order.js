import { db, auth } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ============================
// GET ORDER ID FROM URL
// ============================

const params = new URLSearchParams(
    window.location.search
);

const orderId = params.get("orderId");


// ============================
// CHECK LOGIN
// ============================

let currentUser = null;


onAuthStateChanged(auth, async (user) => {

    if (!user) {

        alert("Please login first");

        window.location.href = "login.html";

        return;

    }

    currentUser = user;


    // CHECK ORDER EXISTS

    if (!orderId) {

        alert("Order not found");

        window.location.href = "myorders.html";

        return;

    }


    try {

        const orderRef = doc(
            db,
            "orders",
            orderId
        );

        const orderSnap =
            await getDoc(orderRef);


        if (!orderSnap.exists()) {

            alert("Order not found");

            window.location.href = "myorders.html";

            return;

        }


        const order =
            orderSnap.data();


        // SECURITY CHECK

        if (order.userId !== user.uid) {

            alert(
                "You are not allowed to cancel this order"
            );

            window.location.href =
                "myorders.html";

            return;

        }


        // CHECK IF ALREADY SHIPPED / DELIVERED

        if (
            order.status === "Shipped" ||
            order.status === "Delivered" ||
            order.status === "Cancelled"
        ) {

            alert(
                "This order cannot be cancelled"
            );

            window.location.href =
                "myorders.html";

        }


    } catch (error) {

        console.error(
            "Error loading order:",
            error
        );

    }

});


// ============================
// CANCEL ORDER
// ============================

window.cancelOrder = async function () {

    if (!currentUser) {

        alert("Please login first");

        return;

    }


    const selectedReason = document.querySelector(
        'input[name="cancelReason"]:checked'
    );


    if (!selectedReason) {

        alert(
            "Please select a cancellation reason"
        );

        return;

    }


    let cancellationReason =
        selectedReason.value;


    // OTHER REASON

    if (cancellationReason === "Other") {

        const otherReason =
            document
                .getElementById("otherReason")
                .value
                .trim();


        if (!otherReason) {

            alert(
                "Please enter cancellation reason"
            );

            return;

        }


        cancellationReason =
            otherReason;

    }


    try {

        const orderRef = doc(
            db,
            "orders",
            orderId
        );


        await updateDoc(
            orderRef,
            {

                status: "Cancelled",

                cancellationReason:
                    cancellationReason,

                cancelledAt:
                    serverTimestamp()

            }
        );


        alert(
            "Your order has been cancelled successfully"
        );


        window.location.href =
            "myorders.html";


    } catch (error) {

        console.error(
            "Cancellation Error:",
            error
        );


        alert(
            "Unable to cancel order. Please try again."
        );

    }

};