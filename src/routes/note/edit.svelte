<script lang="ts">
  import {
    Button,
    Content,
    Form,
    Select,
    SelectItem,
    SkeletonText,
    TextInput,
  } from "carbon-components-svelte";
  import joi from "joi";
  import page from "page";
  import { onMount } from "svelte";
  import Navbar from "../../components/Navbar.svelte";
  import { db } from "../../util/firebase";
  import { getGrades, getSubjects, getTypes } from "../../util/helpers";
  import { user } from "../../util/stores";
  import type { Note } from "../../util/types";

  export let params: { noteId: string };
  let { noteId } = params;
  let note: Note | null = null;
  let grades: string[] | null = null;
  let subjects: string[] | null = null;
  let types: string[] | null = null;

  let { grade, subject, type: noteType, title } = note || {};
  let mLoading = false;

  onMount(async () => {
    const data = await db.doc("notes/" + noteId).get();
    if (!data?.data()) return page.show("/404?message=Note not found");

    note = { ...data.data(), id: data.id } as any;

    if (!$user || note.uid !== $user?.uid)
      return page.show(
        "/404?title=401 FORBIDDEN&message=You don't have permission to edit this note"
      );

    grade = note.grade;
    subject = note.subject;
    noteType = note.type;
    title = note.title;

    grades = await getGrades();
    types = await getTypes();
  });

  $: if (grade && grade !== "null")
    getSubjects(grade).then((s) => (subjects = s));

  function editMetadata() {
    if ($user?.uid !== note.uid) return page.show("/login");

    if (!grades) return;

    const schema = joi.object({
      title: joi.string().required().min(4).max(256),
    });

    const { error } = schema.validate({
      title,
    });

    if (error) return alert(error.message);
    if (grade === "null" || !grades.includes(grade))
      return alert(
        "Pick a valid grade. Refresh the page incase anything went wrong."
      );
    if (subject === "null" || !subjects.includes(subject))
      return alert(
        "Pick a valid subject. Refresh the page incase anything went wrong."
      );
    mLoading = true;

    db.doc("notes/" + note.id)
      .update({
        title,
        grade,
        subject: subject.toLowerCase(),
      })
      .then(() => {
        mLoading = false;
        window.location.reload();
      });
  }
</script>

<Navbar />

{#if note}
  <Content>
    <h1 style="text-align: center">Edit note</h1>

    <div class="card">
      <div class="card-body">
        <h3>Metadata</h3>
        <Form on:submit={editMetadata}>
          <TextInput labelText="Title" id="title" bind:value={title} />

          <Select labelText="Grade" bind:selected={grade} id="grade">
            {#if grades}
              <SelectItem value="null" text="Select..." />

              {#each grades as g}
                <SelectItem value={g} text={g} />
              {/each}
            {:else}
              <SelectItem value="null" text="Loading..." />
            {/if}
          </Select>

          <Select labelText="Subject" bind:selected={subject} id="subject">
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
          <p style="margin-top: 1rem;">
            <Button kind="primary" type="submit" skeleton={mLoading}>
              Edit
            </Button>
          </p>
        </Form>
      </div>
    </div>
  </Content>
{:else}
  <SkeletonText />
{/if}
