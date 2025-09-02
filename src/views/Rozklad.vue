<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import scheduleData from "../assets/rozklad.json";

const currentWeek = ref(1); // 1 - над рискою, 2 - під рискою
const showTeacherModal = ref(false);
const selectedTeacher = ref(null);
const selectedDay = ref("monday");
const schedule = ref(scheduleData.schedule);
const isMobile = ref(false);
const currentTime = ref(new Date());
const currentPair = ref(null);
const selectedSubgroup = ref("both"); // "both", "1", "2"

// Функція для визначення поточного тижня (над/під рискою)
const getCurrentWeek = () => {
  const now = new Date();
  const semesterStart = new Date(2024, 8, 1); // 1 вересня 2024 (осінній семестр)
  
  // Розраховуємо кількість тижнів з початку семестру
  const timeDiff = now.getTime() - semesterStart.getTime();
  const weeksDiff = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
  
  // Перший тиждень семестру - над рискою, другий - під рискою, і так далі
  return (weeksDiff % 2 === 0) ? 1 : 2; // 1 - над рискою, 2 - під рискою
};

// Функція для визначення поточного дня тижня
const getCurrentDay = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = неділя, 1 = понеділок, ..., 6 = субота
  
  const dayMap = {
    1: "monday",
    2: "tuesday", 
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
    0: "sunday"
  };
  
  return dayMap[dayOfWeek] || "monday";
};

// Функція для визначення поточної пари
const getCurrentPair = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;
  
  // Час пар
  const pairTimes = [
    { start: 9 * 60, end: 10 * 60 + 20 },      // 09:00 - 10:20
    { start: 10 * 60 + 30, end: 11 * 60 + 50 }, // 10:30 - 11:50
    { start: 12 * 60 + 30, end: 13 * 60 + 50 }, // 12:30 - 13:50
    { start: 14 * 60, end: 15 * 60 + 20 },      // 14:00 - 15:20
    { start: 15 * 60 + 30, end: 16 * 60 + 50 }, // 15:30 - 16:50
    { start: 17 * 60, end: 18 * 60 + 20 }       // 17:00 - 18:20
  ];
  
  for (let i = 0; i < pairTimes.length; i++) {
    if (currentTimeMinutes >= pairTimes[i].start && currentTimeMinutes <= pairTimes[i].end) {
      return i + 1; // Повертаємо номер пари (1-6)
    }
  }
  
  return null; // Поза часами пар
};

// Функція для оновлення поточного часу
const updateCurrentTime = () => {
  currentTime.value = new Date();
  currentPair.value = getCurrentPair();
};

// Функція для перевірки, чи є пара поточною
const isCurrentPair = (pairNumber, dayKey) => {
  const currentDay = getCurrentDay();
  const actualCurrentWeek = getCurrentWeek();
  return currentPair.value === pairNumber && 
         dayKey === currentDay && 
         currentWeek.value === actualCurrentWeek;
};

const weekText = computed(() => currentWeek.value === 1 ? "над рискою" : "під рискою");

const days = [
  { key: "monday", name: "Понеділок" },
  { key: "tuesday", name: "Вівторок" },
  { key: "wednesday", name: "Середа" },
  { key: "thursday", name: "Четвер" },
  { key: "friday", name: "П'ятниця" }
];

const pairs = [
  { number: 1, time: "09.00 - 10.20" },
  { number: 2, time: "10.30 - 11.50" },
  { number: 3, time: "12.30 - 13.50" },
  { number: 4, time: "14.00 - 15.20" },
  { number: 5, time: "15.30 - 16.50" },
  { number: 6, time: "17.00 - 18.20" }
];

const toggleWeek = () => {
  currentWeek.value = currentWeek.value === 1 ? 2 : 1;
};

const toggleSubgroup = (subgroup) => {
  selectedSubgroup.value = subgroup;
};

const getWeekIndicator = (weekType) => {
  if (weekType === "over") return "↑";
  if (weekType === "under") return "↓";
  if (weekType === "both") return "↕";
  if (weekType === "even") return "2n";
  return "";
};

const shouldShowLesson = (lesson, week) => {
  if (!lesson) return false;
  if (lesson.week === "both") return true;
  if (lesson.week === "over" && week === 1) return true;
  if (lesson.week === "under" && week === 2) return true;
  if (lesson.week === "even" && week === 2) return true;
  return false;
};

const shouldShowSubgroup = (subgroupNumber) => {
  if (selectedSubgroup.value === "both") return true;
  return selectedSubgroup.value === subgroupNumber.toString();
};

const getScheduleForDay = (dayKey, week) => {
  // Спеціальна обробка для вівторка
  if (dayKey === "tuesday") {
    if (week === 1) {
      return schedule.value.tuesday;
    } else {
      return schedule.value.tuesday_under;
    }
  }
  // Спеціальна обробка для середи
  if (dayKey === "wednesday") {
    if (week === 1) {
      return schedule.value.wednesday;
    } else {
      return schedule.value.wednesday_under;
    }
  }
  return schedule.value[dayKey];
};

const isSameLesson = (lesson1, lesson2) => {
  if (!lesson1 || !lesson2) return false;
  return lesson1.name === lesson2.name && 
         lesson1.teacher === lesson2.teacher && 
         lesson1.type === lesson2.type;
};

const showTeacherInfo = (teacherId) => {
  // Знаходимо викладача за ID
  const teacher = teachers.find(t => t.id === teacherId);
  if (teacher) {
    selectedTeacher.value = teacher;
    showTeacherModal.value = true;
  }
};

const closeTeacherModal = () => {
  showTeacherModal.value = false;
  selectedTeacher.value = null;
};

// Дані викладачів (додаємо нових)
const teachers = [
  {
    id: "ageeva",
    name: "Агєєва-Каркашадзе Вікторія Олександрівна",
    telegram: "",
    email: "missis.ageeva@gmail.com",
    courses: "Іноземна мова (за професійним спрямуванням)",
    links: [],
    consultations: "",
    photoName: "default-avatar.jpg",
  },
  {
    id: "antipova",
    name: "Антіпова Катерина Олександрівна",
    telegram: "KaterynaAntipova",
    email: "antipova.katerina@chmnu.edu.ua",
    courses: "ОБД, ООП",
    links: [
      {
        text: "Особисте посилання",
        url: "https://meet.google.com/rou-etmu-yrx",
      },
    ],
    consultations: "",
    photoName: "Antipova.jpg",
  },
  {
    id: "bondarenko",
    name: "Бондаренко Стефанія Віталіївна",
    telegram: "gg_days",
    email: "",
    courses: "Database developement та трьохланкові застосунки, Якість програмного забезпечення та тестування, Професійна практика програмної інженерії, Моделювання та аналіз програмного забезпечення",
    links: [
      {
        text: "Особисте посилання",
        url: "https://meet.google.com/waf-ajkc-ydu",
      },
    ],
    consultations: "",
    photoName: "Bondarenko-2-685x720.jpg",
  },
  {
    id: "borovlova",
    name: "Боровльова Світлана Юріївна",
    telegram: "BSU1952",
    email: "svetlya1952@gmail.com",
    courses: "Мова програмування Python",
    links: [
      {
        text: "Особисте посилання",
        url: "https://meet.google.com/yjv-qxit-wfx",
      },
    ],
    consultations: "",
    photoName: "Borovlova.jpg",
  },
  {
    id: "burovitska",
    name: "Буровицька Юлія Миколаївна",
    telegram: "yuliiia11",
    email: "uliy2005@gmail.com",
    courses: "Іноземна мова",
    links: [],
    consultations: "",
    photoName: "Burovitska.jpg",
  },
  {
    id: "gorban",
    name: "Горбань Гліб Валентинович",
    telegram: "gleb_gorban",
    email: "hlib.horban@chmnu.edu.ua",
    courses: "ООП, Операційні системи, Програмування під операційні системи",
    links: [
      {
        text: "Особисте посилання",
        url: "https://meet.google.com/ahw-vvsv-syi",
      },
    ],
    consultations: "",
    photoName: "Gorban.jpg",
  },
  {
    id: "davidenko",
    name: "Давиденко Євген Олександрович",
    telegram: "DavydenkoYevhen",
    email: "davydenko@chmnu.edu.ua",
    courses: "SPA",
    links: [
      {
        text: "Особисте посилання",
        url: "https://meet.google.com/cat-tnso-ydp",
      },
    ],
    consultations: "",
    photoName: "Davidenko.png",
  },
  {
    id: "kandiba",
    name: "Кандиба Ігор Олександрович",
    telegram: "KandybaIhor",
    email: "ihor.kandyba@chmnu.edu.ua",
    courses: "Мова програмування Python, Адміністрування обчислювальних комплексів",
    links: [
      {
        text: "Особисте посилання",
        url: "https://meet.google.com/wau-wiwx-rsq",
      },
    ],
    consultations: "",
    photoName: "Kandiba.jpg",
  },
  {
    id: "kirej",
    name: "Кірей Катерина Олександрівна",
    telegram: "asd0987655",
    email: "kateryna.kirey@chmnu.edu.ua",
    courses: "ОБД, Операційні системи",
    links: [
      {
        text: "Особисте посилання",
        url: "https://meet.google.com/kjc-mmiz-mhk",
      },
    ],
    consultations: "",
    photoName: "Kirej.jpg",
  },
  {
    id: "ralenko",
    name: "Раленко Віктор Сергійович",
    telegram: "RalenkoVictor",
    email: "ralenko.v@chmnu.edu.ua",
    courses: "Web development, Розробка програмного забезпечення для ОС Android, FullStack web-розробка",
    links: [{ text: "Особисте посилання", url: "" }],
    consultations: "",
    photoName: "Ralenko.jpg",
  },
  {
    id: "stoev",
    name: "Стоєв Євгеній Дмитрович",
    telegram: "stoievyevhenii",
    email: "stoev.evgeny@gmail.com",
    courses: "ASP.NET, Web development",
    links: [{ text: "Особисте посилання", url: "" }],
    consultations: "",
    photoName: "Stoev.jpg",
  },
  {
    id: "salutin",
    name: "Салютін Максим Олександрович",
    telegram: "DropDeadGorge0us",
    email: "",
    courses: "",
    links: [{ text: "Особисте посилання", url: "https://meet.google.com/xco-ukvh-wqn" }],
    consultations: "",
    photoName: "Salutin.jpg",
  },
  {
    id: "shved",
    name: "Швед Альона Володимирівна",
    telegram: "helena_shved",
    email: "avshved@chmnu.edu.ua",
    courses: "Емпіричні методи програмної інженерії",
    links: [
      {
        text: "Особисте посилання",
        url: "https://meet.google.com/aye-qiwa-naq",
      },
    ],
    consultations: "",
    photoName: "SHved.png",
  },
  {
    id: "sherstyuk",
    name: "Шерстюк Людмила Валеріївна",
    telegram: "l_sherstiuk",
    email: "lvsherstiuk@gmail.com",
    courses: "Іноземна мова (англійська)",
    links: [],
    consultations: "",
    photoName: "SHerstyuk.jpg",
  },
  {
    id: "zhuravska",
    name: "Журавська Ірина Миколаївна",
    telegram: "",
    email: "",
    courses: "Технологія захисту програм та даних",
    links: [
      {
        text: "Особисте посилання",
        url: "https://meet.google.com/iyv-nkyo-uxj",
      },
    ],
    consultations: "",
    photoName: "default-avatar.jpg",
  },
  {
    id: "alekseeva",
    name: "Алексєєва Анна Олександрівна",
    telegram: "",
    email: "",
    courses: "Безпека життєдіяльності",
    links: [
      {
        text: "Особисте посилання",
        url: "https://us02web.zoom.us/j/8357252104?pwd=TlFVOXdBKzk0cERhb280czR4bG5tQT09",
      },
    ],
    consultations: "",
    photoName: "default-avatar.jpg",
  },
  {
    id: "atlanov",
    name: "Атланов Віктор Вікторович",
    telegram: "atlanoff",
    email: "",
    courses: "Мультимедіа і гейм-технології",
    links: [],
    consultations: "",
    photoName: "atlanov.jpg",
  },
  {
    id: "togoev",
    name: "Тогоєв Олександр Романович",
    telegram: "",
    email: "",
    courses: "Технологія захисту програм та даних",
    links: [],
    consultations: "",
    photoName: "default-avatar.jpg",
  },
  {
    id: "lysenkova",
    name: "Лисенкова Ірина Петрівна",
    telegram: "",
    email: "",
    courses: "Психологія стресостійкості особистості",
    links: [],
    consultations: "",
    photoName: "default-avatar.jpg",
  },
];

const getTeacherPhoto = (photoName) => {
  if (!photoName || photoName === 'default-avatar.jpg') {
    return '/assets/teacherPhoto/default-avatar.jpg';
  }
  return `/assets/teacherPhoto/${photoName}`;
};

const parseCourses = (coursesString) => {
  if (!coursesString) return [];
  return coursesString.split(/,\s*/).filter(course => course.trim() !== '');
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  // Встановлюємо поточний тиждень та день
  currentWeek.value = getCurrentWeek();
  selectedDay.value = getCurrentDay();
  
  // Оновлюємо час кожну хвилину
  updateCurrentTime();
  setInterval(updateCurrentTime, 60000); // Оновлення кожну хвилину
});
</script>

<template>
  <div class="schedule-container">
    <div class="schedule-header">
      <h1 class="schedule-title">Розклад занять 409 групи</h1>
      <div class="week-toggle">
        <button 
          @click="toggleWeek" 
          class="week-btn"
          :class="{ active: currentWeek === 1 }"
        >
          Над рискою
        </button>
        <button 
          @click="toggleWeek" 
          class="week-btn"
          :class="{ active: currentWeek === 2 }"
        >
          Під рискою
        </button>
      </div>
      <div class="current-week">
        Поточний тиждень: <span class="week-highlight">{{ getCurrentWeek() === 1 ? 'над рискою' : 'під рискою' }}</span>
      </div>
      
      <!-- Фільтр підгруп -->
      <div class="subgroup-filter">
        <button 
          @click="toggleSubgroup('both')" 
          class="subgroup-btn"
          :class="{ active: selectedSubgroup === 'both' }"
        >
          Обидві підгрупи
        </button>
        <button 
          @click="toggleSubgroup('1')" 
          class="subgroup-btn"
          :class="{ active: selectedSubgroup === '1' }"
        >
          1-ша підгрупа
        </button>
        <button 
          @click="toggleSubgroup('2')" 
          class="subgroup-btn"
          :class="{ active: selectedSubgroup === '2' }"
        >
          2-га підгрупа
        </button>
      </div>
      <!-- <div class="displayed-schedule">
        Показано розклад за тиждень: <span class="schedule-highlight">{{ currentWeek === 1 ? 'над' : 'під' }} рискою</span>
      </div> -->
      
      <!-- Мобільний вибір дня -->
      <div class="mobile-day-selector">
        <select v-model="selectedDay" class="day-select">
          <option v-for="day in days" :key="day.key" :value="day.key">
            {{ day.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="schedule-table-container">
      <table class="schedule-table">
        <thead>
          <tr>
            <th class="time-header">Час</th>
            <th v-for="day in (isMobile ? [days.find(d => d.key === selectedDay)] : days)" :key="day.key" class="day-header">
              {{ day.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pair in pairs" :key="pair.number" class="pair-row">
            <td class="time-cell">
              <div class="pair-number">{{ pair.number }}</div>
              <div class="pair-time">{{ pair.time }}</div>
            </td>
            <td 
              v-for="day in (isMobile ? [days.find(d => d.key === selectedDay)] : days)" 
              :key="day.key" 
              class="lesson-cell"
              :class="{ 
                'empty': !getScheduleForDay(day.key, currentWeek)[pair.number],
                'current-pair': isCurrentPair(pair.number, day.key)
              }"
            >
              <div v-if="getScheduleForDay(day.key, currentWeek)[pair.number]" class="lesson-content">
                <!-- Перевіряємо чи однакові пари в обох підгрупах -->
                <template v-if="isSameLesson(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1, getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2) && 
                               shouldShowLesson(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1, currentWeek) && 
                               shouldShowLesson(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2, currentWeek) &&
                               shouldShowSubgroup(1) && shouldShowSubgroup(2)">
                  <!-- Спільна пара для обох підгруп -->
                  <div class="subgroup-lesson common">
                    <div class="lesson-header">
                      <span class="lesson-type">{{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.type }}</span>
                      <span class="week-indicator">↕</span>
                    </div>
                    <div class="lesson-name">{{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.name }}</div>
                    <div class="lesson-teacher">
                      <button 
                        @click="showTeacherInfo(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.teacherId)"
                        class="teacher-btn"
                      >
                        {{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.teacher }}
                      </button>
                    </div>
                    <div v-if="getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.room" class="lesson-room">
                      Ауд: {{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.room }}
                    </div>
                    <a 
                      v-if="getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.link" 
                      :href="getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.link"
                      target="_blank"
                      class="lesson-link"
                    >
                      Приєднатися
                    </a>
                  </div>
                </template>
                
                <template v-else>
                  <!-- Різні пари або тільки в одній підгрупі -->
                  <div class="subgroups-container">
                    <!-- Перша підгрупа -->
                    <div 
                      v-if="shouldShowLesson(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1, currentWeek) && shouldShowSubgroup(1)"
                      class="subgroup-lesson subgroup1"
                    >
                      <div class="lesson-header">
                        <span class="lesson-type">{{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.type }}</span>
                        <span class="week-indicator">{{ getWeekIndicator(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.week) }}</span>
                      </div>
                      <div class="lesson-name">{{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.name }}</div>
                      <div class="lesson-teacher">
                        <button 
                          @click="showTeacherInfo(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.teacherId)"
                          class="teacher-btn"
                        >
                          {{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.teacher }}
                        </button>
                      </div>
                      <div v-if="getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.room" class="lesson-room">
                        Ауд: {{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.room }}
                      </div>
                      <a 
                        v-if="getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.link" 
                        :href="getScheduleForDay(day.key, currentWeek)[pair.number].subgroup1.link"
                        target="_blank"
                        class="lesson-link"
                      >
                        Приєднатися
                      </a>
                    </div>

                    <!-- Друга підгрупа -->
                    <div 
                      v-if="shouldShowLesson(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2, currentWeek) && shouldShowSubgroup(2)"
                      class="subgroup-lesson subgroup2"
                    >
                      <div class="lesson-header">
                        <span class="lesson-type">{{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2.type }}</span>
                        <span class="week-indicator">{{ getWeekIndicator(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2.week) }}</span>
                      </div>
                      <div class="lesson-name">{{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2.name }}</div>
                      <div class="lesson-teacher">
                        <button 
                          @click="showTeacherInfo(getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2.teacherId)"
                          class="teacher-btn"
                        >
                          {{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2.teacher }}
                        </button>
                      </div>
                      <div v-if="getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2.room" class="lesson-room">
                        Ауд: {{ getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2.room }}
                      </div>
                      <a 
                        v-if="getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2.link" 
                        :href="getScheduleForDay(day.key, currentWeek)[pair.number].subgroup2.link"
                        target="_blank"
                        class="lesson-link"
                      >
                        Приєднатися
                      </a>
                    </div>
                  </div>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Легенда -->
    <div class="legend">
      <h3>Легенда:</h3>
      <div class="legend-items">
        <div class="legend-item">
          <div class="legend-color subgroup1-color"></div>
          <span>1-ша підгрупа</span>
        </div>
        <div class="legend-item">
          <div class="legend-color subgroup2-color"></div>
          <span>2-га підгрупа</span>
        </div>
        <div class="legend-item">
          <div class="legend-color common-color"></div>
          <span>Спільна пара</span>
        </div>
        <div class="legend-item">
          <span class="week-indicator">↑</span>
          <span>Над рискою</span>
        </div>
        <div class="legend-item">
          <span class="week-indicator">↓</span>
          <span>Під рискою</span>
        </div>
        <div class="legend-item">
          <span class="week-indicator">↕</span>
          <span>Обидва тижні</span>
        </div>
      </div>
    </div>

    <!-- Модальне вікно з інформацією про викладача -->
    <div v-if="showTeacherModal" class="teacher-modal-overlay" @click="closeTeacherModal">
      <div class="teacher-modal" @click.stop>
        <button class="modal-close" @click="closeTeacherModal">×</button>
        <div v-if="selectedTeacher" class="teacher-modal-content">
          <div class="teacher-modal-header">
            <div class="teacher-modal-avatar">
              <img 
                :src="getTeacherPhoto(selectedTeacher.photoName)" 
                :alt="selectedTeacher.name"
              />
            </div>
            <h3>{{ selectedTeacher.name }}</h3>
          </div>
          <div class="teacher-modal-info">
            <div v-if="selectedTeacher.telegram" class="info-item">
              <i class="icon telegram-icon"></i>
              <a :href="`https://t.me/${selectedTeacher.telegram}`">@{{ selectedTeacher.telegram }}</a>
            </div>
            <div v-if="selectedTeacher.email" class="info-item">
              <i class="icon email-icon"></i>
              <a :href="`mailto:${selectedTeacher.email}`">{{ selectedTeacher.email }}</a>
            </div>
            <div class="courses-section">
              <h4>Курси:</h4>
              <ul class="courses-list">
                <li v-for="(course, index) in parseCourses(selectedTeacher.courses)" :key="index" class="course-item">
                  <i class="icon course-icon"></i>
                  <span>{{ course }}</span>
                </li>
              </ul>
            </div>
            <div v-if="selectedTeacher.links && selectedTeacher.links.length" class="links-section">
              <h4>Посилання:</h4>
              <ul>
                <li v-for="(link, index) in selectedTeacher.links" :key="index">
                  <a :href="link.url" class="link-item" target="_blank">
                    <i class="icon link-icon"></i>
                    {{ link.text }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-container {
  padding: 20px;
  background-color: #000000;
  min-height: 100vh;
  font-family: 'Inter', 'Roboto', sans-serif;
}

.schedule-header {
  text-align: center;
  margin-bottom: 30px;
}

.schedule-title {
  color: rgb(7, 153, 80);
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.week-toggle {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.week-btn {
  padding: 10px 20px;
  border: 2px solid rgb(7, 153, 80);
  background: transparent;
  color: rgb(7, 153, 80);
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.week-btn:hover {
  background: rgb(7, 153, 80);
  color: white;
}

.week-btn.active {
  background: rgb(7, 153, 80);
  color: white;
}

.subgroup-filter {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.subgroup-btn {
  padding: 8px 16px;
  border: 2px solid #4ecdc4;
  background: transparent;
  color: #4ecdc4;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.subgroup-btn:hover {
  background: #4ecdc4;
  color: white;
}

.subgroup-btn.active {
  background: #4ecdc4;
  color: white;
}

.current-week {
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.week-highlight {
  color: rgb(7, 153, 80);
  font-weight: 600;
}

.displayed-schedule {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 15px;
}

.schedule-highlight {
  color: #4ecdc4;
  font-weight: 600;
}

.current-time {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #ccc;
}

.time-highlight {
  color: #4ecdc4;
  font-weight: 600;
}

.current-pair-info {
  color: rgb(7, 153, 80);
  font-weight: 600;
}

.schedule-table-container {
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.mobile-day-selector {
  display: none;
  margin-top: 15px;
}

.day-select {
  width: 100%;
  max-width: 300px;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgb(7, 153, 80);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.day-select:focus {
  outline: none;
  border-color: rgb(9, 187, 98);
  background: rgba(255, 255, 255, 0.15);
}

.day-select option {
  background: #111111;
  color: #fff;
  padding: 10px;
}

.legend {
  margin-top: 30px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(7, 153, 80, 0.2);
}

.legend h3 {
  color: rgb(7, 153, 80);
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  text-align: center;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 0.9rem;
}

.legend-color {
  width: 20px;
  height: 4px;
  border-radius: 2px;
}

.subgroup1-color {
  background: rgb(7, 153, 80);
}

.subgroup2-color {
  background: #ff6b6b;
}

.common-color {
  background: #4ecdc4;
}

.schedule-table {
  width: 100%;
	background-color: rgb(26, 26, 26) !important;
  border-collapse: collapse;
  background: transparent;
  min-width: 800px;
}

.time-header, .day-header {
  padding: 15px;
  text-align: center;
  color: rgb(7, 153, 80);
  font-weight: 600;
  font-size: 1.1rem;
  border-bottom: 2px solid rgba(7, 153, 80, 0.3);
}

.day-header {
  min-width: 200px;
}

.time-header {
  min-width: 120px;
}

.pair-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.time-cell {
  padding: 15px;
  text-align: center;
  color: #fff;
  background: rgba(7, 153, 80, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.pair-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(7, 153, 80);
  margin-bottom: 5px;
}

.pair-time {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.lesson-cell {
  padding: 10px;
  text-align: center;
  vertical-align: top;
  min-height: 120px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.lesson-cell.empty {
  background: rgba(255, 255, 255, 0.02);
}

.lesson-cell.current-pair {
  background: linear-gradient(135deg, rgba(7, 153, 80, 0.3), rgba(9, 187, 98, 0.2));
  border: 2px solid rgb(7, 153, 80);
  box-shadow: 0 0 20px rgba(7, 153, 80, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 20px rgba(7, 153, 80, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(7, 153, 80, 0.6);
  }
  100% {
    box-shadow: 0 0 20px rgba(7, 153, 80, 0.4);
  }
}

.lesson-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subgroups-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subgroup-lesson {
  padding: 12px;
  border-radius: 8px;
  background: rgba(7, 153, 80, 0.1);
  border: 1px solid rgba(7, 153, 80, 0.3);
  transition: all 0.3s ease;
}

.subgroup-lesson:hover {
  background: rgba(7, 153, 80, 0.15);
  border-color: rgba(7, 153, 80, 0.5);
  transform: translateY(-2px);
}

.subgroup-lesson.subgroup1 {
  border-left: 4px solid rgb(7, 153, 80);
}

.subgroup-lesson.subgroup2 {
  border-left: 4px solid #ff6b6b;
}

.subgroup-lesson.common {
  border-left: 4px solid #4ecdc4;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.lesson-type {
  background: rgba(7, 153, 80, 0.2);
  color: rgb(7, 153, 80);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.week-indicator {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.lesson-name {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.3;
  margin-bottom: 8px;
}

.lesson-teacher {
  margin-bottom: 8px;
}

.teacher-btn {
  background: none;
  border: none;
  color: rgb(7, 153, 80);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.teacher-btn:hover {
  color: rgb(9, 187, 98);
}

.lesson-room {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.lesson-link {
  display: inline-block;
  background: rgb(7, 153, 80);
  color: white;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.lesson-link:hover {
  background: rgb(9, 187, 98);
  color: white;
  transform: translateY(-1px);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Модальне вікно */
.teacher-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.teacher-modal {
  background: #111111;
  border: 1px solid rgba(7, 153, 80, 0.3);
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #fff;
}

.teacher-modal-header {
  text-align: center;
  margin-bottom: 25px;
}

.teacher-modal-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
  border: 3px solid rgb(7, 153, 80);
}

.teacher-modal-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.teacher-modal-header h3 {
  color: rgb(7, 153, 80);
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.teacher-modal-info {
  color: #fff;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.icon {
  width: 18px;
  height: 18px;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.telegram-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307994f'%3E%3Cpath d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.97 9.267c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.953z'/%3E%3C/svg%3E");
}

.email-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307994f'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E");
}

.link-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307994f'%3E%3Cpath d='M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z'/%3E%3C/svg%3E");
}

.course-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307994f'%3E%3Cpath d='M12 3L1 9l11 6 9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z'/%3E%3C/svg%3E");
}

.courses-section, .links-section {
  margin-bottom: 20px;
}

.courses-section h4, .links-section h4 {
  color: rgb(7, 153, 80);
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.courses-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.course-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px 12px;
  background-color: rgba(7, 153, 80, 0.1);
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.3;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgb(7, 153, 80);
  text-decoration: none;
  transition: color 0.2s ease;
}

.link-item:hover {
  color: rgb(9, 187, 98);
}

a {
  color: rgb(7, 153, 80);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: rgb(9, 187, 98);
}

/* Адаптивність */
@media (max-width: 1200px) {
  .schedule-table {
    min-width: 700px;
  }
  
  .day-header {
    min-width: 180px;
  }
  
  .lesson-name {
    font-size: 0.85rem;
  }
  
  .legend-items {
    gap: 12px;
  }
  
  .legend-item {
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .schedule-container {
    padding: 15px;
  }
  
  .schedule-title {
    font-size: 2rem;
  }
  
  .schedule-table-container {
    padding: 15px;
  }
  
  .schedule-table {
    min-width: 300px;
  }
  
  .day-header {
    min-width: 200px;
    font-size: 0.9rem;
    padding: 10px 8px;
  }
  
  .time-header {
    min-width: 100px;
    padding: 10px 8px;
  }
  
  .lesson-cell {
    padding: 8px;
    min-height: 100px;
  }
  
  .lesson-name {
    font-size: 0.8rem;
  }
  
  .lesson-type {
    font-size: 0.75rem;
    padding: 3px 6px;
  }
  
  .week-indicator {
    font-size: 0.75rem;
    padding: 1px 4px;
  }
  
  .teacher-modal {
    margin: 20px;
    padding: 20px;
  }
  
  .week-toggle {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .week-btn {
    width: 200px;
  }
  
  .subgroup-filter {
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  
  .subgroup-btn {
    width: 180px;
    font-size: 0.85rem;
    padding: 6px 12px;
  }
  
  .mobile-day-selector {
    display: block;
  }
  
  .legend {
    padding: 12px;
    margin-top: 20px;
  }
  
  .legend h3 {
    font-size: 1rem;
  }
  
  .legend-items {
    gap: 10px;
  }
  
  .legend-item {
    font-size: 0.8rem;
  }
  
  .legend-color {
    width: 16px;
    height: 3px;
  }
}

@media (max-width: 600px) {
  .schedule-container {
    padding: 10px;
  }
  
  .schedule-title {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
  
  .schedule-table-container {
    padding: 10px;
  }
  
  .schedule-table {
    min-width: 250px;
  }
  
  .day-header {
    min-width: 180px;
    font-size: 0.8rem;
    padding: 8px 6px;
  }
  
  .time-header {
    min-width: 80px;
    padding: 8px 6px;
  }
  
  .lesson-cell {
    padding: 6px;
    min-height: 90px;
  }
  
  .lesson-name {
    font-size: 0.75rem;
    line-height: 1.2;
  }
  
  .lesson-type {
    font-size: 0.7rem;
    padding: 2px 4px;
  }
  
  .week-indicator {
    font-size: 0.7rem;
    padding: 1px 3px;
  }
  
  .teacher-btn {
    font-size: 0.8rem;
  }
  
  .lesson-link {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  
  .pair-number {
    font-size: 1.3rem;
  }
  
  .pair-time {
    font-size: 0.8rem;
  }
  
  .day-select {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
  
  .legend {
    padding: 10px;
    margin-top: 15px;
  }
  
  .legend h3 {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
  
  .legend-items {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .legend-item {
    font-size: 0.75rem;
  }
  
  .legend-color {
    width: 14px;
    height: 3px;
  }
}

@media (max-width: 480px) {
  .schedule-title {
    font-size: 1.6rem;
  }

  .schedule-table {
    min-width: 200px;
  }
  
  .day-header {
    min-width: 150px;
    font-size: 0.75rem;
  }
  
  .time-header {
    min-width: 70px;
    font-size: 0.9rem;
  }
  
  .lesson-cell {
    padding: 4px;
    min-height: 80px;
  }
  
  .lesson-name {
    font-size: 0.7rem;
  }
  
  .lesson-type {
    font-size: 0.65rem;
  }
  
  .week-indicator {
    font-size: 0.65rem;
  }
  
  .teacher-btn {
    font-size: 0.75rem;
  }
  
  .lesson-link {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
  
  .pair-number {
    font-size: 1.2rem;
  }
  
  .pair-time {
    font-size: 0.75rem;
  }
  
  .week-btn {
    width: 180px;
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .subgroup-btn {
    width: 160px;
    font-size: 0.8rem;
    padding: 5px 10px;
  }
  
  .current-week {
    font-size: 0.8rem;
  }
  
  .displayed-schedule {
    font-size: 0.8rem;
  }
  
  .current-time {
    font-size: 0.7rem;
  }
  
  .day-select {
    font-size: 0.85rem;
    padding: 6px 10px;
  }
  
  .legend {
    padding: 8px;
    margin-top: 15px;
  }
  
  .legend h3 {
    font-size: 0.85rem;
    margin-bottom: 8px;
  }
  
  .legend-items {
    gap: 6px;
  }
  
  .legend-item {
    font-size: 0.7rem;
  }
  
  .legend-color {
    width: 12px;
    height: 2px;
  }
}

@media (max-width: 400px) {
  .schedule-table {
    min-width: 180px;
  }
  
  .day-header {
    min-width: 120px;
    font-size: 0.7rem;
  }
  
  .time-header {
    min-width: 60px;
    font-size: 0.8rem;
  }
  
  .lesson-cell {
    padding: 3px;
    min-height: 70px;
  }
  
  .lesson-name {
    font-size: 0.65rem;
  }
  
  .lesson-type {
    font-size: 0.6rem;
  }
  
  .week-indicator {
    font-size: 0.6rem;
  }
  
  .teacher-btn {
    font-size: 0.7rem;
  }
  
  .lesson-link {
    font-size: 0.65rem;
    padding: 2px 4px;
  }
  
  .pair-number {
    font-size: 1.1rem;
  }
  
  .pair-time {
    font-size: 0.7rem;
  }
  
  .day-select {
    font-size: 0.8rem;
    padding: 5px 8px;
  }
  
  .legend {
    padding: 6px;
    margin-top: 10px;
  }
  
  .legend h3 {
    font-size: 0.8rem;
    margin-bottom: 6px;
  }
  
  .legend-items {
    gap: 4px;
  }
  
  .legend-item {
    font-size: 0.65rem;
  }
  
  .legend-color {
    width: 10px;
    height: 2px;
  }
}
</style>
