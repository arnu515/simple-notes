<script lang="ts">
  import { db } from "../../util/firebase";
  import {
    Content,
    SkeletonPlaceholder,
    ClickableTile,
    SkeletonText,
  } from "carbon-components-svelte";
  import Navbar from "../../components/Navbar.svelte";
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import marked from "marked";
  import hljs from "highlight.js";
  import { storage } from "../../util/firebase";
  import type { Note } from "../../util/types";
  import type firebase from "firebase";

  const handlebarsContext = {
    time: dayjs().format("HH:mm:ss"),
    date: dayjs().format("DD MMM, YYYY"),
  };

  function markdown(content: string) {
    return marked(window["Handlebars"].compile(content)(handlebarsContext));
  }

  export let params: { noteId: string };
  let note: Note | null = null;
  let author: firebase.User | null = null;
  let mdContent: string = "Loading...";
  let documentData: any;
  let documentDownloadUri: string;

  onMount(async () => {
    note = (await db.doc("notes/" + params.noteId).get()).data() as Note;
    if (!note) return window.location.assign("/404");
    author = (await db.doc("users/" + note.uid).get()).data() as firebase.User;

    const Handlebars = window["Handlebars"];

    Handlebars.registerHelper("spoiler", (text: any, options: any) => {
      console.log(text, this);
      return new Handlebars.SafeString(
        `<details><summary>${
          typeof text === "string" ? text : "Spoiler"
        }</summary>\n${(options || text).fn(this)}</details>`
      );
    });
    Handlebars.registerHelper(
      "code",
      (language: any, inline: any, options: any) => {
        options = !!options ? options : !!inline ? inline : language;

        if (!language || typeof language !== "string") language = "plaintext";
        const code = options.fn(this);

        let inlineString = "";
        if (inline ?? true) {
          inlineString = `<div class="l"><span class="w3-border w3-border-gray w3-white" style="display: inline; padding: 5px; text-transform: uppercase">Copy</span> <span class="w3-border w3-border-gray w3-white" style="display: inline; padding: 5px; text-transform: uppercase">${language.toUpperCase()}</div>\n`;
        }

        return `<pre class="c" style="margin: 0">${inlineString}<code class="language-${language}">${Handlebars.Utils.escapeExpression(
          code
        )}</code></pre>`;
      }
    );
    Handlebars.registerHelper("video", (href: any) => {
      href = typeof href === "string" ? href : "";
      return new Handlebars.SafeString(
        `<video src="${Handlebars.Utils.escapeExpression(
          href
        )}" controls></video>`
      );
    });
  });

  $: if (note && note.type === "markdown") mdContent = markdown(note.content);
  $: if (mdContent) hljs.highlightAll();
  $: if (note && note.type === "document") {
    const ref = storage.ref().child(note.content);
    ref.getMetadata().then((metadata) => {
      documentData = metadata;
    });
    ref.getDownloadURL().then((uri) => (documentDownloadUri = uri));
  }
</script>

<style>
  .file {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .type {
    text-transform: uppercase;
    color: #555;
    margin-bottom: auto;
    margin-top: 12px;
  }
</style>

<Navbar />

{#if note && author}
  <Content>
    <h1 style="text-align: center">{note.title}</h1>
    <p style="text-align: center">By {author.displayName}</p>

    <div class="card" style="margin-top: 2rem">
      <div class="card-body">
        <p
          style="display: flex; align-items: center; justify-content: space-between">
          <span>On: {dayjs(note.createdAt).format('DD MMM, YYYY')}</span>
          <span>Grade {note.grade}, {note.subject.toUpperCase()}</span>
        </p>

        <div style="margin-top: 0.75rem">
          {#if note.type === 'wysiwyg'}
            {@html note.content}
          {:else if note.type === 'markdown'}
            {@html mdContent}
          {:else if note.type === 'document'}
            <h4>Attached files:</h4>
            {#if documentData}
              <ClickableTile href={documentDownloadUri || '/404'}>
                <div class="file">
                  <div class="meta">
                    <h5>{documentData.name}</h5>
                    <p style="font-size: 14px">
                      <span>{documentData.size} bytes</span>
                    </p>
                  </div>
                  <div class="type">
                    {documentData.name
                      .split('.')
                      [documentData.name.split('.').length - 1].toUpperCase()}
                  </div>
                </div>
              </ClickableTile>
            {:else}
              <SkeletonText />
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </Content>
{:else}
  <Content>
    <SkeletonPlaceholder
      style="width: 90%; height: 10rem; margin: 1rem auto;" />
  </Content>
{/if}
