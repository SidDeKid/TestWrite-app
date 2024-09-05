<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { auth } from "@/model/auth";
</script>

<script lang="ts">
export default {
  async mounted() {
    this.userTheme = this.$cookies.isKey("userTheme") ? this.$cookies.get("userTheme") : "light" as string;
    this.$cookies.set("userTheme", this.userTheme);
  },

  data() {
    return {
      userTheme: "",
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
    <div class="structureContainer">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/over">Over mij</RouterLink>
        <RouterLink to="/projects">Projecten</RouterLink>
        <RouterLink to="/tests">Testen</RouterLink>
        <RouterLink to="/model-classes">Classes</RouterLink>
        <a @click="changeTheme()">
          {{ userTheme === 'light' ? 'Donkere modus' : 'Lichte modus' }}
        </a>
      </nav>
      <RouterLink v-if="auth.id !== null" to="/projects">
        <button class="secondaryButton">
          Projecten bekijken
        </button>
      </RouterLink>
      <RouterLink v-else to="/login">
        <button class="secondaryButton">
          Inloggen
        </button>
      </RouterLink>
    </div>
  </header>
  <main v-bind:class="userTheme === 'light' ? 'light' : 'dark'">
    <RouterView></RouterView>
  </main>
  <footer>
    <div class="structureContainer">
      <p>
        Bedankt voor het bezoeken van mijn website.
      </p>
    </div>
  </footer>
</template>

<style scoped></style>