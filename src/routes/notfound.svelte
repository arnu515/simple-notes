<script lang="ts">
  import { Content } from "carbon-components-svelte";
  import Navbar from "../components/Navbar.svelte";

  export let query: { message?: string; title?: string };
  const {
    title = "404 NOT FOUND",
    message = "The page, item or resource you were looking for was not found",
  } = query;
</script>

<Navbar />

<svelte:head>
  <title>{title}</title>
</svelte:head>

<Content>
  <h1 style="text-align: center">{title}</h1>
  <p style="text-align: center">{message}</p>
</Content>
