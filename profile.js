import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const profileWelcome =
    document.getElementById("profileWelcome");

const profileEmail =
    document.getElementById("profileEmail");

const profileAuthBtn =
    document.getElementById("profileAuthBtn");


// ============================
// CHECK LOGIN STATUS
// ============================

onAuthStateChanged(auth, (user) => {

    if (user) {

        // USER IS LOGGED IN

        const userName =
            user.displayName ||
            user.email.split("@")[0];


        profileWelcome.innerText =
            `Welcome, ${userName} 👋`;


        profileEmail.innerText =
            user.email;


        profileAuthBtn.innerText =
            "Logout";


        // LOGOUT FUNCTION

        profileAuthBtn.onclick =
            async () => {

                try {

                    await signOut(auth);

                    alert(
                        "Logged out successfully!"
                    );

                    window.location.href =
                        "login.html";

                } catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );

                    alert(
                        "Unable to logout"
                    );

                }

            };

    } else {

        // USER NOT LOGGED IN

        profileWelcome.innerText =
            "Welcome to Thapaswini";


        profileEmail.innerText =
            "Login to manage your profile, orders and wishlist.";


        profileAuthBtn.innerText =
            "Login / Sign Up";


        // GO TO LOGIN PAGE

        profileAuthBtn.onclick =
            () => {

                window.location.href =
                    "login.html";

            };

    }

});