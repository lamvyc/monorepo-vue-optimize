<template>
    <div>
        <Navigation />
        <App />
    </div>
</template>

<script setup lang="ts">
import App from '@vue-monorepo/lazy-loading/src/App.vue';
import Navigation from '../components/Navigation.vue';
</script> 