<script setup lang="ts">
import { ref } from "vue";
</script>

<template>
  <div class="stolen-schedule-container">
    <h1 class="title">Упс! Розклад вкрали ¯\_(ツ)_/¯</h1>
    <div class="gif-container">
      <img src="/assets/Z2kv.gif" alt="Розклад вкрали" class="stolen-gif" />
    </div>
  </div>
</template>

<style scoped>
.stolen-schedule-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 15px;
  text-align: center;
}

.title {
  color: #fff;
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.gif-container {
  margin: 10px 0;
  max-width: 400px;
  width: 100%;
}

.stolen-gif {
  width: 90%;
  border-radius: 8px;
  height: 300px !important;
}

@media (max-width: 600px) {
  .title {
    font-size: 1.6rem;
  }

  .gif-container {
    max-width: 350px;
  }
}
</style>
