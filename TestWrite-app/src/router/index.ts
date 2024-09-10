import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/model/auth";
import HomeView from "../views/HomeView.vue";

const adminRoleId = 1;
const clientRoleId = 3;

const protectedRoutes = [
  {
    rights: [adminRoleId] as Array<Number | null>,
    names: [] as Array<string>
  },
  {
    rights: [adminRoleId, clientRoleId] as Array<Number | null>,
    names: ["projects", "tests", "model-classes"]
  }
];

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
      component: () => import("../views/projects/ProjectView.vue")
    },
    {
      path: "/projects/create",
      name: "projects-create",
      component: () => import("../views/projects/CreateProjectView.vue")
    },
    {
      // https://enterprisevue.dev/blog/exploring-dynamic-routes-in-vue/
      path: "/projects/:id",
      name: "projects-detail",
      component: () => import("../views/projects/ProjectDetailView.vue")
    },
    {
      path: "/tests",
      name: "tests",
      component: () => import("../views/tests/TestView.vue")
    },
    {
      path: "/model-classes",
      name: "model-classes",
      component: () => import("../views/modelClasses/ModelClassView.vue")
    },
    {
      path: "/:catchAll(.*)",
      name: "lotFound",
      component: () => import("../views/NotFoundView.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  const roleId = auth.roleId !== null ? Number(auth.roleId) : null;

  for (const routes of protectedRoutes) {
    if (routes.names.includes(to.name as string) && !routes.rights.includes(roleId)) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
      return;
    }
  }

  next();
});

export default router;
