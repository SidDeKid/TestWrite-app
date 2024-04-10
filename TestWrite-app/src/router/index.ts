import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/over",
      name: "about",
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/make-class",
      name: "make-class",
      component: () => import("../views/MakeClassView.vue")
    }
  ]
});

export default router;
