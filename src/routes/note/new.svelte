<script lang="ts">
  import Navbar from "../../components/Navbar.svelte";
  import {
    Button,
    Content,
    Form,
    FormGroup,
    Select,
    SelectItem,
    TextInput,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { user } from "../../util/stores";
  import { db } from "../../util/firebase";

  let grades: string[] | null = null;
  let grade: string | "null" = "null";
  let subjects: string[] | null = null;
  let types: string[] | null = null;
  let noteType: string | "null" = "null";

  async function getGrades() {
    const data = await db.collection("grades").get();
    grades = data.docs.map((doc) => doc.id);
  }

  async function getTypes() {
    const data = await db.collection("noteTypes").get();
    types = data.docs.map((doc) => doc.id);
  }

  async function getSubjects(g?: string | "null") {
    if (!g || g === "null") return;
    const data = await db
      .collection("subjects")
      .where("grades", "array-contains", g)
      .get();
    subjects = data.docs.map((doc) => doc.data().name);
  }

  onMount(async () => {
    if (!$user) window.location.assign("/");

    await getGrades();
    await getTypes();
  });

  function newNote() {}

  $: if (grade && grade !== "null") getSubjects(grade);
</script>

<Navbar />

<Content>
  <div class="card">
    <div class="card-body">
      <Form on:submit={newNote}>
        <FormGroup legendText="1. Metadata">
          <TextInput labelText="Note title" id="1-title" />

          <Select labelText="Grade" bind:selected={grade} id="1-grade">
            {#if grades}
              <SelectItem value="null" text="Select..." />

              {#each grades as g}
                <SelectItem value={g} text={g} />
              {/each}
            {:else}
              <SelectItem value="null" text="Loading..." />
            {/if}
          </Select>

          <Select labelText="Subject" id="1-subject">
            {#if subjects}
              <SelectItem value="null" text="Select..." />

              {#each subjects as s}
                <SelectItem value={s} text={s} />
              {/each}
            {:else if !grade || grade === 'null'}
              <SelectItem value="null" text="Select grade first" />
            {:else if !subjects}
              <SelectItem value="null" text="Loading..." />
            {/if}
          </Select>
        </FormGroup>

        <FormGroup legendText="2. Type">
          <Select labelText="Type" hideLabel bind:selected={noteType}>
            {#if types}
              <SelectItem value="null" text="Select..." />

              {#each types as t}
                <SelectItem value={t} text={t} />
              {/each}
            {:else}
              <SelectItem value="null" text="Loading..." />
            {/if}
          </Select>
        </FormGroup>

        <FormGroup label="3. Content" />

        <Button kind="secondary" type="submit">Create note</Button>
      </Form>
    </div>
  </div>
</Content>
