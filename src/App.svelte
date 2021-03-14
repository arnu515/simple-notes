<script lang="ts">
  import page from "page";
  import qs from "qs";
  import { auth } from "./util/firebase";
  import { user } from "./util/stores";

  import Index from "./routes/index.svelte";
  import Auth from "./routes/auth.svelte";
  import Logout from "./routes/logout.svelte";
  import NotesSlug from "./routes/note/slug.svelte";
  import GradeSlug from "./routes/grade/slug.svelte";
  import GradeSubjectSlug from "./routes/grade/subject/slug.svelte";
  import Notfound from "./routes/notfound.svelte";
  import "carbon-components-svelte/css/white.css";

  let component: any, params: any, query: any;

  auth.onAuthStateChanged((u) => {
    $user = u;
  });

  function route(c: any, path: string) {
    page(
      path,
      (ctx, next) => {
        params = ctx.params;
        query = qs.parse(ctx.querystring);
        next();
      },
      () => (component = c)
    );
  }

  route(Index, "/");
  route(Auth, "/auth");
  route(Logout, "/logout");
  route(NotesSlug, "/note/:noteId");
  route(GradeSlug, "/grade/:grade");
  route(GradeSubjectSlug, "/grade/:grade/:subject");
  route(Notfound, "*");

  page.start();
</script>

<svelte:component this={component} {...{ query, params }} />
