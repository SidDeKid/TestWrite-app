<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import LogInView from "./views/LogInView.vue";

import { Auth } from "@/model/auth";
</script>

<script lang="ts">
export default {
  mounted() {
    this.userTheme = this.$cookies.isKey("userTheme") ? this.$cookies.get("userTheme") : "light" as string;
    this.$cookies.set("userTheme", this.userTheme);
  },
  data() {
    return {
      userTheme: "",
      auth: Auth,
    };
  },
  methods: {
    changeTheme() {
      this.userTheme = this.userTheme === "light" ? "dark" : "light";
      this.$cookies.set("userTheme", this.userTheme);
    },
  },
};
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/over">Over mij</RouterLink>
        <RouterLink to="/make-class">Maak een class</RouterLink>
      </nav>
      <button @click="changeTheme()">
        {{ userTheme === 'light' ? 'Donkere modus' : 'Lichte modus' }}
      </button>
    </div>
  </header>
  <main v-bind:class="userTheme === 'light' ? 'light' : 'dark'">
    <RouterView v-if="auth.id !== null"></RouterView>
    <LogInView v-else></LogInView>
  </main>
  <footer>
    <div>

    </div>
  </footer>
</template>

<style scoped></style>