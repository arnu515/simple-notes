<script lang="ts">
  import { onMount } from "svelte";

  export let content: string;
  export let id: string = "3-content";

  onMount(() => {
    window["tinymce"].init({
      selector: "#" + id,
      menubar: false,
      toolbar:
        "undo redo | styleselect fontsizeselect | hr anchor charmap emoticons | forecolor backcolor | numlist bullist alignleft aligncenter alignright alignjustify | image media table | help",
      plugins:
        "advlist lists anchor autolink charmap emoticons help hr image media table",
      image_uploadtab: false,
      setup: (editor: any) => {
        if (content) editor.setContent(content);
        editor.on("change keyup compositionend setcontent", () => {
          content = editor.getContent({ format: "html" });
        });
      },
    });
  });
</script>

<textarea {id} rows={15} />
