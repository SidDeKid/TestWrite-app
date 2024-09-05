import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/model/auth";
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
      path: "/login",
      name: "login",
      component: () => import("../views/LogInView.vue")
    },
    {
      path: "/over",
      name: "about",
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/projects",
      name: "projects",
      component:
        auth.id !== null
          ? () => import("../views/projects/ProjectView.vue")
          : () => import("../views/LogInView.vue")
    },
    {
      path: "/projects/create",
      name: "projects/create",
      component:
        auth.id !== null
          ? () => import("../views/projects/CreateProjectView.vue")
          : () => import("../views/LogInView.vue")
    },
    {
      // https://enterprisevue.dev/blog/exploring-dynamic-routes-in-vue/
      path: "/projects/:id",
      name: "projects/detail",
      component:
        auth.id !== null
          ? () => import("../views/projects/ProjectDetailView.vue")
          : () => import("../views/LogInView.vue")
    },
    {
      path: "/tests",
      name: "tests",
      component:
        auth.id !== null
          ? () => import("../views/tests/TestView.vue")
          : () => import("../views/LogInView.vue")
    },
    {
      path: "/model-classes",
      name: "model-classes",
      component:
        auth.id !== null
          ? () => import("../views/modelClasses/ModelClassView.vue")
          : () => import("../views/LogInView.vue")
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue")
    }
  ]
});

export default router;
