<script lang="ts">
  import { Button } from "carbon-components-svelte";

  export let file: File;
  $: name = file?.name || "Add files";
  let fileInput: HTMLInputElement;

  function chooseFile() {
    if (!fileInput) return;

    fileInput.click();
  }

  function handleFiles() {
    const f: File = fileInput?.files[0] ?? null;
    if (!f) return;
    if (f.size > 1024 * 1024 * 10) {
      alert("Max file size is 10MB");
      file = null;
      return;
    }
    file = f;
  }
</script>

<h5 style="margin-bottom: 0.5rem">Upload file</h5>
<Button kind="primary" on:click={chooseFile}>{name}</Button>
<input
  type="file"
  on:change={handleFiles}
  bind:this={fileInput}
  style="display: none" />
