import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const authForm =
    document.getElementById("customerAuthForm");

const switchAuthBtn =
    document.getElementById("switchAuthBtn");

const formTitle =
    document.getElementById("formTitle");

const formSubtitle =
    document.getElementById("formSubtitle");

const authButton =
    document.getElementById("authButton");

const switchText =
    document.getElementById("switchText");

const signupName =
    document.querySelector(".signup-name");


let isSignupMode = false;


// ============================
// SWITCH LOGIN / SIGNUP
// ============================

switchAuthBtn.addEventListener("click", (event) => {

    event.preventDefault();

    isSignupMode = !isSignupMode;


    if (isSignupMode) {

        formTitle.innerText =
            "Create Account";

        formSubtitle.innerText =
            "Sign up to start shopping";

        authButton.innerText =
            "Sign Up";

        switchText.innerText =
            "Already have an account?";

        switchAuthBtn.innerText =
            "Login";

        signupName.style.display =
            "flex";

    }

    else {

        formTitle.innerText =
            "Welcome Back";

        formSubtitle.innerText =
            "Login to continue shopping";

        authButton.innerText =
            "Login";

        switchText.innerText =
            "Don't have an account?";

        switchAuthBtn.innerText =
            "Sign Up";

        signupName.style.display =
            "none";

    }

});


// ============================
// LOGIN / SIGNUP
// ============================

authForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document.getElementById(
                "customerEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "customerPassword"
            ).value.trim();


        const fullName =
            document.getElementById(
                "customerFullName"
            ).value.trim();


        try {

            // =====================
            // SIGNUP
            // =====================

            if (isSignupMode) {

                if (!fullName) {

                    alert(
                        "Please enter your full name"
                    );

                    return;

                }


                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                await updateProfile(
                    userCredential.user,
                    {
                        displayName: fullName
                    }
                );


                alert(
                    "Account created successfully! 🎉"
                );


                window.location.href =
                    "index.html";

            }


            // =====================
            // LOGIN
            // =====================

            else {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                alert(
                    "Login successful! 🎉"
                );


                window.location.href =
                    "index.html";

            }


        } catch (error) {

            console.error(
                "Authentication Error:",
                error
            );


            let message =
                "Something went wrong. Please try again.";


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message =
                    "This email is already registered.";

            }

            else if (
                error.code ===
                "auth/invalid-credential"
            ) {

                message =
                    "Invalid email or password.";

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message =
                    "Password should be at least 6 characters.";

            }


            alert(message);

        }

    }
);