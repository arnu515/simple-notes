<script lang="ts">
  import Navbar from "../../components/Navbar.svelte";
  import joi from "joi";
  import slugify from "slugify";
  import {
    Button,
    Content,
    Form,
    FormGroup,
    InlineLoading,
    Select,
    SelectItem,
    TextInput,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { user } from "../../util/stores";
  import { db, storage } from "../../util/firebase";
  import Markdown from "../../components/content/Markdown.svelte";
  import Wysiwyg from "../../components/content/Wysiwyg.svelte";
  import Document from "../../components/content/Document.svelte";
  import page from "page";

  let title: string = "";
  let grades: string[] | null = null;
  let grade: string | "null" = "null";
  let subjects: string[] | null = null;
  let subject: string | "null" = "null";
  let types: string[] | null = null;
  let noteType: string | "null" = "null";

  let mdContent: string = "# Write some Markdown here";
  let htmlContent: string =
    "<p>Use the buttons on the editor to style your text!</p>";
  let docFile: File | null = null;

  let loading = false;

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
    if (!$user) page.show("/");

    await getGrades();
    await getTypes();
  });

  async function newNote() {
    if (!$user) return page.show("/login");

    if (!grades || !types) return;

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
    if (noteType === "null" || !types.includes(noteType))
      return alert(
        "Pick a valid type. Refresh the page incase anything went wrong."
      );

    const slug = slugify(title, { lower: true }) + Date.now();
    let content: string;
    loading = true;

    switch (noteType) {
      case "wysiwyg":
        content = htmlContent;
        break;
      case "markdown":
        content = mdContent;
        break;
      case "document":
        if (!docFile) return alert("Upload a file first");
        const uri = `userUploaded/notesData/document/${$user.uid}/${slug}/${docFile.name}`;
        try {
          await storage.ref().child(uri).put(docFile);
          content = uri;
        } catch (e) {
          alert(
            "An unknown error occured! Check if you're logged in, and check the console for details."
          );
          console.error("Storage upload error", e);
        }
        break;
      default:
        break;
    }

    if (!content.trim()) return alert("Type some content first!");
    console.log(content);

    await db.collection("notes").doc(slug).set({
      title,
      content,
      grade,
      subject: subject.toLowerCase(),
      type: noteType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      uid: $user.uid,
    });

    page.show("/note/" + slug);
    loading = false;
  }

  $: if (grade && grade !== "null") getSubjects(grade);
</script>

<Navbar />

<Content>
  <h1 style="text-align: center; margin-bottom: 1rem;">New note</h1>
  <div class="card">
    <div class="card-body">
      <Form on:submit={newNote}>
        <FormGroup legendText="1. Metadata">
          <TextInput bind:value={title} labelText="Note title" id="1-title" />

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

          <Select labelText="Subject" bind:selected={subject} id="1-subject">
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

        <FormGroup legendText="3. Content">
          {#if noteType === 'markdown'}
            <Markdown bind:content={mdContent} />
          {:else if noteType === 'wysiwyg'}
            <Wysiwyg bind:content={htmlContent} />
          {:else if noteType === 'document'}
            <Document bind:file={docFile} />
          {:else}
            <p>Select the type of your note first</p>
          {/if}
        </FormGroup>

        {#if !loading}
          <Button kind="secondary" type="submit">Create note</Button>
        {:else}
          <InlineLoading description="Loading..." />
        {/if}
      </Form>
    </div>
  </div>
</Content>
