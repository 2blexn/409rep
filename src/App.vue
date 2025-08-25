<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { ref, onMounted, computed } from 'vue';

const currentYear = new Date().getFullYear();
const currentSemester = new Date().getMonth() >= 8 ? 1 : 2; 
const semesterText = computed(() => currentSemester === 1 ? 'Весняний' : 'Осінній');

const isLoaded = ref(false);
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

const currentTime = ref(new Date());
const formattedTime = computed(() => {
  const hours = currentTime.value.getHours().toString().padStart(2, '0');
  const minutes = currentTime.value.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
});

setInterval(() => {
  currentTime.value = new Date();
}, 60000);
</script>

<template>
  <header :class="{ 'loaded': isLoaded }">
    <div class="menu">
      <div class="wrapper">
        <div class="header-content">
          <h1 class="title-animation">ІПЗ-409</h1>
          <div class="semester-info">
            <div class="academic-info">
              <span class="academic-year">{{ currentYear }}-{{ currentYear + 1 }}</span>
              <div class="time-display">{{ formattedTime }}</div>
            </div>
            <div class="semester-badge">
              <span class="semester">{{ semesterText }} семестр</span>
            </div>
          </div>
        </div>
        <nav class="nav-container">
          <RouterLink to="/" class="nav-button" custom v-slot="{ navigate, isActive }">
            <button 
              @click="navigate" 
              class="nav-btn" 
              :class="{ 'active': isActive }"
            >
              <div class="btn-content">
                <i class="icon schedule-icon"></i>
                <span class="btn-text">Розклад</span>
              </div>
              <div class="btn-background"></div>
            </button>
          </RouterLink>
          
          <RouterLink to="/teachers" class="nav-button" custom v-slot="{ navigate, isActive }">            <button 
              @click="navigate" 
              class="nav-btn" 
              :class="{ 'active': isActive }"
            >
              <div class="btn-content">
                <i class="icon teachers-icon"></i>
                <span class="btn-text">Викладачі</span>
              </div>
              <div class="btn-background"></div>
            </button>
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>

  <main class="main-content" :class="{ 'loaded': isLoaded }">
    <RouterView v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>
</template>

<style scoped>
header {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

header.loaded {
  opacity: 1;
  transform: translateY(0);
}

.main-content {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.main-content.loaded {
  opacity: 1;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.title-animation {
  position: relative;
  color: transparent;
  background: linear-gradient(45deg, rgb(7, 153, 80) 30%, #4aeea1 50%, rgb(7, 153, 80) 70%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shine 3s linear infinite;
  font-weight: bold;
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.semester-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
  width: 100%;
}

.academic-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
  width: 100%;
}

.academic-year {
  color: rgb(7, 153, 80);
  font-size: 1.2rem;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 5px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.time-display {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  background-color: rgba(7, 153, 80, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.semester-badge {
  position: relative;
  margin-top: 10px;
}

.semester {
  display: inline-block;
  color: #fff;
  font-size: 1rem;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(7, 153, 80, 0.8), rgba(7, 153, 80, 0.4));
  box-shadow: 0 4px 15px rgba(7, 153, 80, 0.3);
  position: relative;
  overflow: hidden;
}

.semester::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shine-effect 3s infinite;
}

@keyframes shine-effect {
  to {
    left: 100%;
  }
}

.menu {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95));
}

header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #000000;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
}

.nav-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  margin-top: 10px;
}

.nav-button {
  text-decoration: none;
  flex: 1;
  max-width: 250px;
}

.nav-btn {
  position: relative;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
  height: 60px;
}

.btn-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px 25px;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  z-index: 2;
  transition: color 0.3s ease;
}

.btn-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgb(7, 153, 80), rgb(9, 187, 98));
  z-index: 1;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1;
}

.nav-btn:hover .btn-background {
  transform: scale(1.05);
}

.nav-btn:hover::before {
  transform: translateX(0);
}

.nav-btn.active .btn-background {
  background: white;
}

.nav-btn.active .btn-content {
  color: rgb(7, 153, 80);
}

.icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease;
}

.nav-btn:hover .icon {
  transform: scale(1.2);
}

.schedule-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z'/%3E%3C/svg%3E");
}

.teachers-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
}

.nav-btn.active .schedule-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307994f'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z'/%3E%3C/svg%3E");
}

.nav-btn.active .teachers-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307994f'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
}

@media (min-width: 1024px) {
  .menu {
    padding: 3rem 0;
  }

  .header-content {
    margin-bottom: 2rem;
  }

  .title-animation {
    font-size: 4rem;
  }

  .academic-year, .time-display {
    font-size: 1.3rem;
  }

  .semester {
    font-size: 1.1rem;
  }

  .nav-container {
    max-width: 700px;
  }

  .nav-btn {
    height: 70px;
  }

  .btn-content {
    font-size: 1.3rem;
  }

  .icon {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 600px) {
  .title-animation {
    font-size: 2.8rem;
  }

  .academic-info {
    flex-direction: column;
    gap: 10px;
  }

  .nav-container {
    flex-direction: column;
    align-items: center;
  }

  .nav-button {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .title-animation {
    font-size: 2.5rem;
  }

  .menu {
    padding: 1.5rem 0;
  }

  .academic-year, .time-display {
    font-size: 1rem;
  }

  .semester {
    font-size: 0.9rem;
  }
}
</style>