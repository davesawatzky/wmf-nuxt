<script setup lang="ts"></script>

<template>
  <div class="page-container">
    <header>
      <h1>This is the header</h1>
      <slot name="header"></slot>
    </header>
    <div class="menu">
      <div>This is the menu area</div>
      <slot name="menu"></slot>
    </div>
    <nav>
      <ul>
        <li>Classes</li>
        <li>Venues</li>
        <li>Schedule</li>
        <li>Registrations</li>
      </ul>
      <slot name="sidebar"></slot>
    </nav>
    <main>
      <h1>Main</h1>
      <slot />
    </main>
    <footer>
      <div>This is the Footer</div>
      <slot name="footer"></slot>
    </footer>


  </div>
</template>

<style lang="scss" scoped>

.page-container {
  display: grid;
  width: 100%;
  height: 100vh;
  grid-template: 
    "header header" 80px
    "nav menu" 35px
    "nav main" 1fr
    "nav footer" 30px / 225px 1fr;
}

header {
  background-color: green;
  grid-area: header;
}

.menu {
  background-color: yellow;
  grid-area: menu;
}

nav {
  background-color: #141430;
  grid-area: nav;
  color: #c9c9c9;
}

main {
  grid-area: main;
  overflow:auto;
}

footer {
  background-color: grey;
  grid-area: footer;
}

</style>
