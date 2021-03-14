<script lang="ts">
  import {
    Header,
    HeaderNav,
    HeaderNavItem,
    SkipToContent,
  } from "carbon-components-svelte";
  import { user } from "../util/stores";
</script>

<Header company="Simple" platformName="Notes">
  <div slot="skip-to-content">
    <SkipToContent />
  </div>

  <HeaderNav style="margin-left: auto">
    <HeaderNavItem href="/" text="Home" />
    {#if !$user}
      <HeaderNavItem href="/auth" text="Login/Register" />
    {:else}
      <HeaderNavItem href="/new" text="New note" />
      <HeaderNavItem href="/logout" text="Logout" />
    {/if}
  </HeaderNav>
</Header>
