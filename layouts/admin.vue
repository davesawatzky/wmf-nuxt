<script setup lang="ts"></script>

<template>
  <div>
    <v-app>
      <v-system-bar color="grey-darken-3"></v-system-bar>

      <v-navigation-drawer
        color="blue-darken-4"
        permanent
        width="200"></v-navigation-drawer>

      <v-app-bar
        color="blue"
        height="48"
        flat></v-app-bar>

      <v-main>
        <slot />
      </v-main>

      <v-footer
        color="grey-lighten-2"
        app
        height="auto"></v-footer>
    </v-app>
  </div>
</template>

<style lang="scss" scoped></style>
