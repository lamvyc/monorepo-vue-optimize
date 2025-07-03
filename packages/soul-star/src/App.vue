<template>
  <div class="app">
    <h1>3D Sphere Component</h1>
    <ThreeSphere @ball-clicked="handleBallClick" :autoRotationSpeed="0.0005" :sphereRadius="4.85" :ballRadius="0.15"
      :numPoints="50" />
    <div v-if="clickedBall" class="notification">
      Clicked: {{ clickedBall }}
    </div>
  </div>
</template>

<script>
import ThreeSphere from './components/ThreeSphere/index.vue';

export default {
  name: 'App',
  components: {
    ThreeSphere
  },
  data() {
    return {
      clickedBall: null
    }
  },
  methods: {
    handleBallClick(label) {
      this.clickedBall = label;
      setTimeout(() => {
        this.clickedBall = null;
      }, 2000);
    }
  }
}
</script>

<style>
.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 100;
}
</style>