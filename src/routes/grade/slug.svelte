<script lang="ts">
  import { Content, SkeletonText, Button } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import Navbar from "../../components/Navbar.svelte";
  import { db } from "../../util/firebase";
  import type { Subject } from "../../util/types";

  export let params: { grade: string };
  let subjects: Subject[] | null = null;

  onMount(async () => {
    const data = await db
      .collection("subjects")
      .where("grades", "array-contains", params.grade)
      .get();
    subjects = data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any;
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
  <h1 style="text-align: center">Grade {params.grade}</h1>
  <p style="text-align: center">Choose a subject</p>

  <div class="card" style="margin-top: 1rem;">
    <div class="card-body">
      {#if subjects}
        <div class="btns">
          {#each subjects as subject}
            <Button kind="ghost" href="/grade/{params.grade}/{subject.id}">
              {subject.name}
            </Button>
          {/each}
        </div>
      {:else}
        <SkeletonText />
      {/if}
    </div>
  </div>
</Content>
