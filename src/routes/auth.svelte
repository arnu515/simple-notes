<script lang="ts">
  import Navbar from "../components/Navbar.svelte";
  import { Content, Form, FormGroup, Button } from "carbon-components-svelte";
  import { auth, Google, db } from "../util/firebase";
  import type firebase from "firebase";

  let user: firebase.User | null = null;
  export let query: { next?: string };

  auth.onAuthStateChanged((u) => {
    user = u ?? null;
    if (u) {
      db.collection("users").doc(u.uid).set(u.toJSON());
      setTimeout(() => (window.location.href = query.next || "/"), 3000);
    }
  });

  function google() {
    auth.signInWithRedirect(Google);
  }

  function logout() {
    auth.signOut();
  }
</script>

<Navbar />

<Content>
  {#if !user}
    <h1 style="text-align: center">Login / Register</h1>

    <div class="card" style="margin-top:1rem">
      <div class="card-body">
        <Form>
          <FormGroup legendText="Sign in with OAuth">
            <Button on:click={google} style="width: 100%">
              Sign in with Google
            </Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  {:else}
    <h1 style="text-align: center">Logged in</h1>
    <p style="text-align: center; margin-top: 1rem">
      <Button on:click={logout}>Log out</Button>
    </p>
    <p style="text-align: center; margin-top: 1rem">
      Please wait, redirecting...
    </p>
  {/if}
</Content>
