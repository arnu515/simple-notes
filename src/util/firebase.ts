import firebase from "firebase/app";
import config from "./firebase.config";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

export const app = firebase.initializeApp(config);

export const auth = firebase.auth();
export const Google = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();

export const storage = firebase.storage();
