<script lang="ts">
  import { TextArea } from "carbon-components-svelte";
  export let content: string;
  export let id: string = "3-content";
</script>

<TextArea
  labelText="Content"
  bind:value={content}
  {id}
  rows={15}
  hideLabel
  placeholder="Enter some markdown here!" />
<p>
  <small>Learn how to style your content <a href="/docs/markdown">here</a></small>
</p>
