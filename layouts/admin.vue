<script setup lang="ts"></script>

<template>
  <div class="page-container">
    <header>
      <AdminHeader />
    </header>
    <div class="menu">
      <AdminMenu />
    </div>
    <nav>
      <AdminSidebar />
    </nav>
    <main>
      <slot />
    </main>
    <footer>
      <AdminFooter />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
  .page-container {
    display: grid;
    width: 100%;
    height: 100vh;
    grid-template:
      'header header' auto
      'nav menu' auto
      'nav main' 1fr
      'nav footer' auto / auto 1fr;
  }

  header {
    grid-area: header;
  }

  .menu {
    grid-area: menu;
  }

  nav {
    grid-area: nav;
  }

  main {
    grid-area: main;
    overflow: auto;
  }

  footer {
    grid-area: footer;
  }
</style>
