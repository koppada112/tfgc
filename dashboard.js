import { db, auth } from "./firebase.js";

import * as firebaseFirestore from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ============================
// CLOUDINARY CONFIGURATION
// ============================

const CLOUD_NAME = "ok70vrr4";
const UPLOAD_PRESET = "thapaswini_products";


// ============================
// ADD PRODUCT
// ============================

const productForm = document.getElementById("productForm");

if (productForm) {

    productForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const imageFile =
            document.getElementById("productImage").files[0];

        const productName =
            document.getElementById("productName").value.trim();

        const productPrice =
            document.getElementById("productPrice").value;

        const productCategory =
            document.getElementById("productCategory").value;

        const productDescription =
            document.getElementById("productDescription").value.trim();


        if (!imageFile) {
            alert("Please select a jewellery image!");
            return;
        }


        if (
            !productName ||
            !productPrice ||
            !productCategory ||
            !productDescription
        ) {
            alert("Please fill all product details!");
            return;
        }


        try {

            alert("Uploading product... Please wait ⏳");


            // UPLOAD IMAGE TO CLOUDINARY

            const formData = new FormData();

            formData.append("file", imageFile);

            formData.append(
                "upload_preset",
                UPLOAD_PRESET
            );


            const response = await fetch(

                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

                {
                    method: "POST",
                    body: formData
                }

            );


            const imageData = await response.json();


            if (!imageData.secure_url) {
                throw new Error("Image upload failed");
            }


            // SAVE PRODUCT TO FIRESTORE

            await firebaseFirestore.addDoc(

                firebaseFirestore.collection(db, "products"),

                {
                    name: productName,
                    price: Number(productPrice),
                    category: productCategory,
                    description: productDescription,
                    image: imageData.secure_url,
                    createdAt: new Date()
                }

            );


            alert("Product added successfully! 💎");

            productForm.reset();

            // REFRESH PRODUCT LIST
            loadProducts();


        } catch (error) {

            console.error("Product upload error:", error);

            alert(
                "Error adding product: " +
                error.message
            );

        }

    });

}


// ============================
// LOAD PRODUCTS
// ============================

async function loadProducts() {

    const productsGrid =
        document.getElementById("adminProductsGrid");

    const productCount =
        document.getElementById("productCount");


    if (!productsGrid) return;


    try {

        const snapshot = await firebaseFirestore.getDocs(
            firebaseFirestore.collection(db, "products")
        );


        if (productCount) {

            productCount.textContent =
                `${snapshot.size} Products`;

        }


        // NO PRODUCTS

        if (snapshot.empty) {

            productsGrid.innerHTML = `

                <div class="admin-empty">

                    <i class="fa-solid fa-gem"></i>

                    <h3>No Products Added Yet</h3>

                    <p>
                        Add your first jewellery product above.
                    </p>

                </div>

            `;

            return;
        }


        productsGrid.innerHTML = "";


        // DISPLAY PRODUCTS

        snapshot.forEach((productDoc) => {

            const product = productDoc.data();


            productsGrid.innerHTML += `

                <div class="admin-product-card">

                    <img
                        src="${product.image || ""}"
                        alt="${product.name || "Product"}"
                    >

                    <div class="admin-product-info">

                        <h3>${product.name || "Unnamed Product"}</h3>

                        <p class="admin-product-price">
                            ₹${product.price || 0}
                        </p>

                        <p class="admin-product-category">
                            ${product.category || ""}
                        </p>


                        <div class="admin-product-actions">

                            <button
                                class="edit-product-btn"
                                onclick="editProduct('${productDoc.id}')"
                            >
                                <i class="fa-solid fa-pen"></i>
                                Edit
                            </button>


                            <button
                                class="delete-product-btn"
                                onclick="deleteProduct('${productDoc.id}')"
                            >
                                <i class="fa-solid fa-trash"></i>
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.error("Error loading products:", error);

        productsGrid.innerHTML = `
            <p class="error-text">
                Unable to load products.
            </p>
        `;

    }

}


// ============================
// DELETE PRODUCT
// ============================

// ============================
// DELETE PRODUCT MODAL
// ============================

let selectedProductId = null;


// OPEN DELETE MODAL

function deleteProduct(productId) {

    selectedProductId = productId;

    const deleteModal =
        document.getElementById("deleteProductModal");

    if (deleteModal) {

        deleteModal.classList.add(
            "show-delete-modal"
        );

    }

}


// CLOSE DELETE MODAL

function closeDeleteModal() {

    const deleteModal =
        document.getElementById("deleteProductModal");

    if (deleteModal) {

        deleteModal.classList.remove(
            "show-delete-modal"
        );

    }

    selectedProductId = null;

}


// CONFIRM DELETE PRODUCT

async function confirmDeleteProduct() {

    if (!selectedProductId) return;

    try {

        await firebaseFirestore.deleteDoc(
            firebaseFirestore.doc(db, "products", selectedProductId)
        );

        alert("Product deleted successfully!");

        closeDeleteModal();

        loadProducts();

    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );

        alert("Unable to delete product");

    }

}


// ============================
// OPEN EDIT MODAL
// ============================

async function editProduct(productId) {

    try {

        const productRef =
            firebaseFirestore.doc(db, "products", productId);

        const productSnapshot =
            await firebaseFirestore.getDoc(productRef);


        if (!productSnapshot.exists()) {

            alert("Product not found!");
            return;

        }


        const product =
            productSnapshot.data();


        document.getElementById("editProductId").value =
            productId;

        document.getElementById("editProductName").value =
            product.name || "";

        document.getElementById("editProductPrice").value =
            product.price || "";

        document.getElementById("editProductCategory").value =
            product.category || "";

        document.getElementById("editProductDescription").value =
            product.description || "";


        // SHOW MODAL

        document
            .getElementById("editProductModal")
            .classList.add("show-modal");


    } catch (error) {

        console.error("Edit error:", error);

        alert("Unable to load product details");

    }

}


// ============================
// CLOSE EDIT MODAL
// ============================

function closeEditModal() {

    const modal =
        document.getElementById("editProductModal");

    if (modal) {
        modal.classList.remove("show-modal");
    }

}


// MAKE FUNCTIONS AVAILABLE

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.closeEditModal = closeEditModal;

window.closeDeleteModal = closeDeleteModal;
window.confirmDeleteProduct = confirmDeleteProduct;


// ============================
// UPDATE PRODUCT
// ============================

const editProductForm =
    document.getElementById("editProductForm");


if (editProductForm) {

    editProductForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const productId =
                document.getElementById("editProductId").value;

            const productName =
                document.getElementById("editProductName")
                    .value.trim();

            const productPrice =
                document.getElementById("editProductPrice")
                    .value;

            const productCategory =
                document.getElementById("editProductCategory")
                    .value;

            const productDescription =
                document.getElementById("editProductDescription")
                    .value.trim();


            try {

                await firebaseFirestore.updateDoc(

                    firebaseFirestore.doc(db, "products", productId),

                    {
                        name: productName,
                        price: Number(productPrice),
                        category: productCategory,
                        description: productDescription
                    }

                );


                alert("Product updated successfully! 💎");


                closeEditModal();

                loadProducts();


            } catch (error) {

                console.error("Update error:", error);

                alert("Unable to update product");

            }

        }
    );

}


// ============================
// LOAD CUSTOMER ORDERS
// ============================

async function loadCustomerOrders() {

    const ordersContainer =
        document.getElementById("ordersContainer");


    if (!ordersContainer) return;


    try {

        const ordersQuery = firebaseFirestore.query(

            firebaseFirestore.collection(db, "orders"),

            firebaseFirestore.orderBy("createdAt", "desc")

        );


        const snapshot =
            await firebaseFirestore.getDocs(ordersQuery);


        ordersContainer.innerHTML = "";


        if (snapshot.empty) {

            ordersContainer.innerHTML = `

                <div class="no-orders">

                    <i class="fa-solid fa-box-open"></i>

                    <p>No customer orders yet.</p>

                </div>

            `;

            return;
        }


        snapshot.forEach((orderDoc) => {

            const order =
                orderDoc.data();


            let productsHTML = "";


            (order.items || []).forEach((item) => {

                productsHTML += `

                    <div class="admin-order-product">

                        <img
                            src="${item.image || ""}"
                            alt="${item.name || "Product"}"
                        >

                        <div>

                            <h4>
                                ${item.name || "Product"}
                            </h4>

                            <p>
                                ₹${item.price || 0}
                            </p>

                            <small>
                                Quantity: ${item.quantity || 1}
                            </small>

                        </div>

                    </div>

                `;

            });


            const currentStatus =
                order.status || "Order Placed";


            let orderDate = "Just now";

            if (order.createdAt) {

                if (typeof order.createdAt.toDate === "function") {

                    orderDate =
                        order.createdAt
                            .toDate()
                            .toLocaleDateString();

                }

            }


            ordersContainer.innerHTML += `

                <div class="admin-order-card">

                    <div class="admin-order-header">

                        <div>

                            <h3>
                                Order #${orderDoc.id.slice(0, 8)}
                            </h3>

                            <p>
                                Date: ${orderDate}
                            </p>

                            <p>
                                Customer:
                                ${order.customerName || "N/A"}
                            </p>

                            <p>
                                Phone:
                                ${order.phone || "N/A"}
                            </p>

                        </div>


                        <select
                            class="status-select"

                            onchange="
                                updateOrderStatus(
                                    '${orderDoc.id}',
                                    this.value
                                )
                            "
                        >

                            <option
                                value="Order Placed"
                                ${currentStatus === "Order Placed" ? "selected" : ""}
                            >
                                Order Placed
                            </option>

                            <option
                                value="Confirmed"
                                ${currentStatus === "Confirmed" ? "selected" : ""}
                            >
                                Confirmed
                            </option>

                            <option
                                value="Shipped"
                                ${currentStatus === "Shipped" ? "selected" : ""}
                            >
                                Shipped
                            </option>

                            <option
                                value="Delivered"
                                ${currentStatus === "Delivered" ? "selected" : ""}
                            >
                                Delivered
                            </option>

                        </select>

                    </div>


                    <div class="admin-address">

                        <strong>Delivery Address:</strong>

                        <p>

                            ${order.address || "N/A"},
                            ${order.city || ""}

                            ${order.pincode
                                ? "- " + order.pincode
                                : ""
                            }

                        </p>

                    </div>


                    <div class="admin-order-products">

                        ${productsHTML}

                    </div>


                    <div class="admin-order-total">

                        Total:
                        ₹${order.totalAmount || 0}

                    </div>


                    <p class="admin-payment-method">

                        <strong>Payment:</strong>

                        ${order.paymentMethod || "N/A"}

                    </p>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Error loading customer orders:",
            error
        );


        ordersContainer.innerHTML = `

            <div class="error-text">

                <h3>
                    Unable to load customer orders
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;

    }

}


// ============================
// UPDATE ORDER STATUS
// ============================

async function updateOrderStatus(
    orderId,
    newStatus
) {

    try {

        await firebaseFirestore.updateDoc(

            firebaseFirestore.doc(
                db,
                "orders",
                orderId
            ),

            {
                status: newStatus
            }

        );


        alert(
            "Order status updated to " +
            newStatus
        );


        loadCustomerOrders();


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(
            "Error updating order status"
        );

    }

}


// MAKE AVAILABLE TO HTML

window.updateOrderStatus =
    updateOrderStatus;


// ============================
// INITIAL LOAD
// ============================

loadProducts();

loadCustomerOrders();
// ============================
// ADMIN LOGOUT
// ============================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                alert("Logged out successfully!");

                window.location.href =
                    "admin.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert("Unable to logout");

            }

        }
    );

}