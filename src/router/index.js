import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Rozklad.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/teachers",
      name: "teachers",

      component: () => import("../views/Teachers.vue"),
    },
  ],
});

export default router;
