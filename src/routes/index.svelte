<script lang="ts">
  import Navbar from "../components/Navbar.svelte";
  import { Content, Button, SkeletonText } from "carbon-components-svelte";
  import { db } from "../util/firebase";
  import { onMount } from "svelte";

  let grades: string[] | null = null;

  onMount(async () => {
    const data = await db.collection("grades").get();
    grades = data.docs.map((doc) => doc.id);
  });
</script>

<style>
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<Navbar />

<Content>
  <h1 style="text-align: center">SimpleNotes</h1>
  <p style="text-align: center">Choose your grade</p>

  <div class="card" style="margin-top: 1rem;">
    <div class="card-body">
      {#if grades}
        <div class="btns">
          {#each grades.sort((a, b) => parseInt(a) - parseInt(b)) as grade}
            <Button kind="ghost" href="/grade/{grade}">{grade}</Button>
          {/each}
        </div>
      {:else}
        <SkeletonText />
      {/if}
    </div>
  </div>
</Content>
