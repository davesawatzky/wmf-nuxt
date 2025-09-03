<script setup lang="ts"></script>

<template>
  <div class="page-container">
    <header>
      <AdminHeader />
    </header>
    <div class="menu">
      <AdminMenu />
    </div>
    <nav class="bg-primary-900">
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
  header {
    grid-area: header;
  }

  .menu {
    grid-area: menu;
  }

  nav {
    grid-area: nav;
    overflow: auto;
  }

  main {
    font-size: 13px;
    grid-area: main;
    overflow: auto;
  }

  footer {
    grid-area: footer;
  }

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
</style>
