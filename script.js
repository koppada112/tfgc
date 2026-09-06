// ============================
// NAVIGATION ACTIVE
// ============================

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");

    });

});


// ============================
// CATEGORY CLICK
// ============================

const categories = document.querySelectorAll(".category");

categories.forEach(category => {

    category.addEventListener("click", () => {

        const categoryName =
            category.querySelector("p").innerText;

        console.log(
            "Selected Category:",
            categoryName
        );

    });

});


// ============================
// SEARCH
// ============================

const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                const searchTerm =
                    searchInput.value.trim();

                if (searchTerm !== "") {

                    window.location.href =
                        "products.html?search=" +
                        encodeURIComponent(searchTerm);

                }

            }

        }
    );

}


// ============================
// CART COUNT
// ============================

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    let totalItems = 0;


    cart.forEach(item => {

        totalItems +=
            Number(item.quantity) || 1;

    });


    const cartBadges =
        document.querySelectorAll(
            ".cart-count"
        );


    cartBadges.forEach(badge => {

        badge.textContent =
            totalItems;


        if (totalItems === 0) {

            badge.style.display =
                "none";

        } else {

            badge.style.display =
                "flex";

        }

    });

}


// ============================
// LOAD CART COUNT
// ============================

document.addEventListener(
    "DOMContentLoaded",
    updateCartCount
);


window.addEventListener(
    "pageshow",
    updateCartCount
);
localStorage.setItem(
    "cart",
    JSON.stringify(cart)
);

updateCartCount();