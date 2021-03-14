<script lang="ts">
  import { onMount } from "svelte";
  import { auth } from "../util/firebase";

  export let query: { next?: string };

  onMount(async () => {
    await auth.signOut();
    window.location.href = query.next || "/";
  });
</script>

<h1>Please wait, logging out...</h1>
