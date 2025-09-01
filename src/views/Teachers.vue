<template>
  <div class="teachers">
    <div class="container">
      <h1 class="page-title">Викладачі кафедри</h1>
      <div class="teachers-list">
        <div
          v-for="teacher in teachers"
          :key="teacher.name + (teacher.id || '')"
          class="teacher-card"
        >
          <div class="teacher-header">
            <div class="avatar-container">
              <img 
                :src="getTeacherPhoto(teacher.photoName)" 
                :alt="teacher.name"
                class="teacher-avatar"
              />
            </div>
            <h3>{{ teacher.name }}</h3>
          </div>
          <div class="teacher-info">
            <div class="contact-info">
              <div v-if="teacher.telegram" class="info-item">
                <i class="icon telegram-icon"></i>
                <a :href="`https://t.me/${teacher.telegram}`">@{{ teacher.telegram }}</a>
              </div>
              <div v-if="teacher.email" class="info-item">
                <i class="icon email-icon"></i>
                <a :href="`mailto:${teacher.email}`">{{ teacher.email }}</a>
              </div>
            </div>
            <div class="courses-section">
              <h4>Курси:</h4>
              <ul class="courses-list">
                <li v-for="(course, index) in parseCourses(teacher.courses)" :key="index" class="course-item">
                  <i class="icon course-icon"></i>
                  <span>{{ course }}</span>
                </li>
              </ul>
            </div>
            <div v-if="teacher.links && teacher.links.length" class="links-section">
              <h4>Посилання:</h4>
              <ul>
                <li v-for="(link, index) in teacher.links" :key="index">
                  <a :href="link.url" class="link-item">
                    <i class="icon link-icon"></i>
                    {{ link.text }}
                  </a>
                </li>
              </ul>
            </div>
            <p v-if="teacher.consultations" class="consultation-info">
              <i class="icon calendar-icon"></i>
              <span>Консультації: {{ teacher.consultations }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teachers: [
        {
          name: "Агєєва-Каркашадзе Вікторія Олександрівна",
          telegram: "",
          email: "missis.ageeva@gmail.com",
          courses: "Іноземна мова (за професійним спрямуванням)",
          links: [
            {
              text: "Особисте посилання",
              url: "",
            },
          ],
          consultations: "",
          photoName: "default-avatar.jpg",
        },
        {
          name: "Алексєєва Анна Олександрівна",
          telegram: "",
          email: "",
          courses: "Безпека життєдіяльності, основи охорони праці та цивільний захист",
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
          name: "Атланов Віктор Вікторович",
          telegram: "",
          email: "",
          courses: "Мультимедіа і гейм-технології",
          links: [],
          consultations: "",
          photoName: "default-avatar.jpg",
        },
        {
          name: "Бондаренко Стефанія Віталіївна",
          telegram: "gg_days",
          email: "",
          courses:
            "Database developement та трьохланкові застосунки, Якість програмного забезпечення та тестування, Професійна практика програмної інженерії, Моделювання та аналіз програмного забезпечення ",
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
          name: "Буровицька Юлія Миколаївна",
          telegram: "yuliiia11",
          email: "uliy2005@gmail.com",
          courses: "Іноземна мова",
          links: [],
          consultations: "",
          photoName: "Burovitska.jpg",
        },

        {
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
          id: "1",
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
          name: "Лисенкова Ірина Петрівна",
          telegram: "",
          email: "",
          courses: "Психологія стресостійкості особистості",
          links: [],
          consultations: "",
          photoName: "default-avatar.jpg",
        },

        {
          name: "Раленко Віктор Сергійович",
          telegram: "RalenkoVictor",
          email: "ralenko.v@chmnu.edu.ua  ",
          courses:
            "Web development, Розробка програмного забезпечення для ОС Android, FullStack web-розробка",
          links: [{ text: "Особисте посилання", url: "" }],
          consultations: "",
          photoName: "Ralenko.jpg",
        },

				{
					name: "Стоєв Євгеній Дмитрович",
					telegram: "stoievyevhenii",
					email: "stoev.evgeny@gmail.com",
					courses: "ASP.NET, Web development",
					links: [{ text: "Особисте посилання", url: "" }],
					consultations: "",
					photoName: "Stoev.jpg",
				},

        {
					name: "Салютін Максим Олександрович",
					telegram: "DropDeadGorge0us",
          email: "",
          courses: "",
					links: [{ text: "Особисте посилання", url: "https://meet.google.com/xco-ukvh-wqn" }],
          consultations: "",
          photoName: "Salutin.jpg",
        },

        {
          name: "Тогоєв Олександр Романович",
          telegram: "",
          email: "",
          courses: "Технологія захисту програм та даних",
          links: [],
          consultations: "",
          photoName: "default-avatar.jpg",
        },

        {
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
          name: "Шерстюк Людмила Валеріївна",
					telegram: "l_sherstiuk",
          email: "lvsherstiuk@gmail.com",
          courses: "Іноземна мова (англійська)",
          links: [],
          consultations: "",
					photoName: "SHerstyuk.jpg",
        },
      ],
    };
  },
  methods: {
    getTeacherPhoto(photoName) {
      if (!photoName || photoName === 'default-avatar.jpg') {
        return '/assets/teacherPhoto/default-avatar.jpg';
      }
      return `/assets/teacherPhoto/${photoName}`;
    },
    parseCourses(coursesString) {
      if (!coursesString) return [];
      return coursesString.split(/,\s*/).filter(course => course.trim() !== '');
    }
  },
};
</script>

<style scoped>
.teachers {
  font-family: 'Inter', 'Roboto', sans-serif;
  padding: 20px;
  background-color: #0a0a0a;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  color: rgb(7, 153, 80);
  margin-bottom: 40px;
  font-size: 2.5rem;
  font-weight: 700;
}

.teachers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.teacher-card {
  background-color: #111111;
  border: 1px solid #ffffff0f;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.teacher-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(7, 153, 80, 0.2);
}

.teacher-header {
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 15px;
  border: 3px solid rgb(7, 153, 80);
  box-shadow: 0 4px 10px rgba(7, 153, 80, 0.3);
}

.teacher-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.teacher-header h3 {
  color: rgb(7, 153, 80);
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
}

.teacher-info {
  padding: 0 20px 20px 20px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ffffff1a;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
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

.calendar-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307994f'%3E%3Cpath d='M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z'/%3E%3C/svg%3E");
}

.courses-section,
.links-section {
  margin-bottom: 15px;
}

.courses-section h4,
.links-section h4 {
  color: #ffffff;
  margin: 0 0 5px 0;
  font-size: 0.9rem;
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
  padding: 6px 10px;
  background-color: rgba(7, 153, 80, 0.1);
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.3;
  transition: background-color 0.2s ease;
}

.course-item:hover {
  background-color: rgba(7, 153, 80, 0.2);
}

.course-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2307994f'%3E%3Cpath d='M12 3L1 9l11 6 9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z'/%3E%3C/svg%3E");
}

.teacher-card ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.teacher-card li {
  margin-bottom: 5px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.consultation-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0 0 0;
  font-size: 0.9rem;
}

a {
  color: rgb(7, 153, 80);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: rgb(9, 187, 98);
  text-decoration: none;
}

@media (max-width: 768px) {
  .teachers-list {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }
}
</style>