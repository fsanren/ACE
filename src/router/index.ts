import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Settings from "../views/Settings.vue";
import Favorites from "../views/Favorites.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/settings", name: "Settings", component: Settings },
  { path: "/favorites", name: "Favorites", component: Favorites },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});

export default router;
