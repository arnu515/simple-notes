import { writable } from "svelte/store";
import type firebase from "firebase";

export const user = writable<firebase.User | null>(null);
