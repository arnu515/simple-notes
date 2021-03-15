<script lang="ts">
  import Navbar from "../../../components/Navbar.svelte";
  import { Content, SkeletonPlaceholder, Tag } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { db } from "../../../util/firebase";
  import dayjs from "dayjs";
  import dayjsPluginRelativeTime from "dayjs/plugin/relativeTime";
  import page from "page";
  import type { Note } from "../../../util/types";

  dayjs.extend(dayjsPluginRelativeTime);

  export let params: { grade: string; subject: string };
  const { grade, subject } = params;
  let notes: Note[] | null = null;

  onMount(async () => {
    const data = await db
      .collection("notes")
      .where("subject", "==", subject)
      .where("grade", "==", grade)
      .orderBy("createdAt", "desc")
      .get();

    notes = data.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any;
  });
</script>

<style global>
  .tag {
    border: 1px gray solid;
  }
  .tag.markdown {
    background-color: aqua;
  }
  .tag.html {
    background-color: orange;
  }
  .tag.document {
    background-color: lime;
    color: black;
  }
</style>

<Navbar />

<Content>
  <h1 style="text-align: center">{params.subject.toUpperCase()}</h1>
  <p style="text-align: center">Notes</p>

  {#if notes}
    {#each notes as note}
      <div
        class="card"
        style="margin-top: 0.5rem; cursor: pointer"
        on:click={() => page.show(`/note/${note.id}`)}>
        <div class="card-body">
          <h4
            style="display: flex; align-items: center; justify-content: space-between">
            <span>{note.title}</span>
            <Tag class="tag {note.type}">{note.type}</Tag>
          </h4>
          <p class="metadata">
            <span>{dayjs().to(dayjs(note.createdAt))}</span><br />
            <span>Grade {note.grade}, {note.subject.toUpperCase()}</span>
          </p>
        </div>
      </div>
    {/each}
  {:else}
    <Content>
      <SkeletonPlaceholder
        style="width: 80%; height: 5rem; margin: 1rem auto" />
    </Content>
  {/if}
</Content>
