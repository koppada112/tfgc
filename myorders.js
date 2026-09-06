import { db, auth } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const ordersList =
    document.getElementById("ordersList");


// ============================
// LOAD CUSTOMER ORDERS
// ============================

async function loadOrders(userId) {

    try {

        const ordersQuery = query(

            collection(db, "orders"),

            where(
                "userId",
                "==",
                userId
            ),

        );


        const snapshot =
            await getDocs(ordersQuery);


        // NO ORDERS

        if (snapshot.empty) {

            ordersList.innerHTML = `

                <div class="empty-orders">

                    <i class="fa-solid fa-box-open"></i>

                    <h3>No Orders Yet</h3>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a
                        href="products.html"
                        class="shop-now-btn"
                    >
                        Shop Now
                    </a>

                </div>

            `;

            return;

        }


        ordersList.innerHTML = "";


        // DISPLAY ORDERS

        snapshot.forEach((doc) => {

            const order =
                doc.data();


            let productsHTML = "";


order.items.forEach((item) => {

    productsHTML += `

        <div class="customer-order-product">

            <img src="${item.image}" alt="${item.name}">

            <div class="customer-order-info">

                <h4>${item.name}</h4>

                <p>₹${item.price}</p>

                <small>
                    Quantity: ${item.quantity || 1}
                </small>


                ${
                    order.status === "Delivered"
                    ? `
                        <a
                            href="rating.html?name=${encodeURIComponent(item.name)}&image=${encodeURIComponent(item.image)}&price=${encodeURIComponent(item.price)}"
                            class="rate-product-btn"
                        >
                            <i class="fa-solid fa-star"></i>
                            Rate Product
                        </a>
                    `
                    : ""
                }

            </div>

        </div>

    `;

});

            // ORDER DATE

            const orderDate =
                order.createdAt
                    ? order.createdAt
                        .toDate()
                        .toLocaleDateString(
                            "en-IN"
                        )
                    : "Just now";


            const status =
                order.status ||
                "Order Placed";


            // ORDER CARD

            ordersList.innerHTML += `

                <div class="customer-order-card">


                    <div class="customer-order-header">

                        <div>

                            <strong>

                                Order #
                                ${doc.id.slice(0, 8)}

                            </strong>

                            <p>
                                ${orderDate}
                            </p>

                        </div>


                        <span
                            class="customer-order-status ${status
                                .toLowerCase()
                                .replace(/\s+/g, "-")}"
                        >

                            ${status}

                        </span>

                    </div>


                    <!-- ORDER TRACKER -->

                    <div class="order-tracker">


                        <div
                            class="tracker-step ${[
                                "Order Placed",
                                "Confirmed",
                                "Shipped",
                                "Delivered"
                            ].indexOf(status) >= 0
                                ? "completed"
                                : ""
                            }"
                        >

                            <i
                                class="fa-solid fa-circle-check"
                            ></i>

                            <span>
                                Placed
                            </span>

                        </div>


                        <div
                            class="tracker-step ${[
                                "Confirmed",
                                "Shipped",
                                "Delivered"
                            ].indexOf(status) >= 0
                                ? "completed"
                                : ""
                            }"
                        >

                            <i
                                class="fa-solid fa-circle-check"
                            ></i>

                            <span>
                                Confirmed
                            </span>

                        </div>


                        <div
                            class="tracker-step ${[
                                "Shipped",
                                "Delivered"
                            ].indexOf(status) >= 0
                                ? "completed"
                                : ""
                            }"
                        >

                            <i
                                class="fa-solid fa-truck"
                            ></i>

                            <span>
                                Shipped
                            </span>

                        </div>


                        <div
                            class="tracker-step ${
                                status === "Delivered"
                                    ? "completed"
                                    : ""
                            }"
                        >

                            <i
                                class="fa-solid fa-house"
                            ></i>

                            <span>
                                Delivered
                            </span>

                        </div>


                    </div>


                    <!-- PRODUCTS -->

                    <div
                        class="customer-order-products"
                    >

                        ${productsHTML}

                    </div>


                    <!-- TOTAL -->

                    <div
                        class="customer-order-total"
                    >

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹${order.totalAmount}
                        </strong>

                    </div>


                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        ordersList.innerHTML = `

            <div class="empty-orders">

                <h3>
                    Unable to Load Orders
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


// ============================
// AUTH CHECK
// ============================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            loadOrders(
                user.uid
            );

        }

        else {

            window.location.href =
                "login.html";

        }

    }
);