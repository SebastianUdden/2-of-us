import "firebaseui/dist/firebaseui.css";

import * as firebaseui from "firebaseui";

import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";

export const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    {
      provider: GoogleAuthProvider.PROVIDER_ID,
      customParameters: {
        prompt: "select_account",
      },
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false, // Prevents redirect after sign in
  },
};

export const ui = new firebaseui.auth.AuthUI(auth);
