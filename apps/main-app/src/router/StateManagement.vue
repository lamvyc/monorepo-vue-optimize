<template>
  <div>
    <Navigation />
    <App />
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import App from '@vue-monorepo/state-management/src/App.vue';
import Navigation from '../components/Navigation.vue';
import BackToTop from '../components/BackToTop.vue';
</script>
