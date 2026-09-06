import { db, auth } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ============================
// ELEMENTS
// ============================

const addressesContainer =
    document.getElementById("addressesContainer");

const addAddressBtn =
    document.getElementById("addAddressBtn");

const addressModal =
    document.getElementById("addressModal");

const closeAddressModal =
    document.getElementById("closeAddressModal");

const addressForm =
    document.getElementById("addressForm");


// ============================
// OPEN ADDRESS MODAL
// ============================

addAddressBtn.addEventListener("click", () => {

    addressModal.classList.add("show-address-modal");

});


// ============================
// CLOSE ADDRESS MODAL
// ============================

closeAddressModal.addEventListener("click", () => {

    addressModal.classList.remove("show-address-modal");

});


// ============================
// LOAD ADDRESSES
// ============================

async function loadAddresses() {

    const currentUser = auth.currentUser;

    if (!currentUser) {

        window.location.href = "login.html";

        return;

    }

    try {

        const addressQuery = query(

            collection(db, "addresses"),

            where(
                "userId",
                "==",
                currentUser.uid
            )

        );


        const snapshot =
            await getDocs(addressQuery);


        // NO ADDRESSES

        if (snapshot.empty) {

            addressesContainer.innerHTML = `

                <div class="no-addresses">

                    <i class="fa-solid fa-location-dot"></i>

                    <h3>No Saved Addresses</h3>

                    <p>
                        Add an address to make checkout faster.
                    </p>

                </div>

            `;

            return;

        }


        addressesContainer.innerHTML = "";


        // DISPLAY ADDRESSES

        snapshot.forEach((addressDoc) => {

            const address =
                addressDoc.data();


            addressesContainer.innerHTML += `

                <div class="saved-address-card">

                    <div class="saved-address-icon">

                        <i class="fa-solid fa-location-dot"></i>

                    </div>


                    <div class="saved-address-info">

                        <h3>
                            ${address.name}
                        </h3>

                        <p>
                            ${address.phone}
                        </p>

                        <p>
                            ${address.address}
                        </p>

                        <p>
                            ${address.city} - ${address.pincode}
                        </p>

                    </div>


                    <button
                        class="delete-address-btn"
                        onclick="deleteAddress('${addressDoc.id}')"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(
            "Error loading addresses:",
            error
        );

    }

}


// ============================
// SAVE ADDRESS
// ============================

addressForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


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
                .getElementById("addressName")
                .value
                .trim();


        const phone =
            document
                .getElementById("addressPhone")
                .value
                .trim();


        const address =
            document
                .getElementById("addressText")
                .value
                .trim();


        const city =
            document
                .getElementById("addressCity")
                .value
                .trim();


        const pincode =
            document
                .getElementById("addressPincode")
                .value
                .trim();


        // PHONE VALIDATION

        if (phone.length !== 10) {

            alert(
                "Please enter valid 10-digit phone number"
            );

            return;

        }


        // PINCODE VALIDATION

        if (pincode.length !== 6) {

            alert(
                "Please enter valid 6-digit pincode"
            );

            return;

        }


        try {

            await addDoc(

                collection(db, "addresses"),

                {

                    userId:
                        currentUser.uid,

                    name: name,

                    phone: phone,

                    address: address,

                    city: city,

                    pincode: pincode,

                    createdAt:
                        serverTimestamp()

                }

            );


            alert(
                "Address saved successfully! 📍"
            );


            // RESET FORM

            addressForm.reset();


            // CLOSE MODAL

            addressModal.classList.remove(
                "show-address-modal"
            );


            // RELOAD ADDRESSES

            loadAddresses();


        }

        catch (error) {

            console.error(
                "Error saving address:",
                error
            );

            alert(
                "Unable to save address"
            );

        }

    }
);


// ============================
// DELETE ADDRESS
// ============================

async function deleteAddress(addressId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this address?"
        );


    if (!confirmDelete) return;


    try {

        await deleteDoc(

            doc(
                db,
                "addresses",
                addressId
            )

        );


        alert(
            "Address deleted successfully"
        );


        loadAddresses();


    }

    catch (error) {

        console.error(
            "Delete address error:",
            error
        );

        alert(
            "Unable to delete address"
        );

    }

}


// MAKE FUNCTION AVAILABLE

window.deleteAddress =
    deleteAddress;


// ============================
// AUTH CHECK
// ============================

onAuthStateChanged(auth, (user) => {

    if (user) {

        loadAddresses();

    }

    else {

        window.location.href =
            "login.html";

    }

});