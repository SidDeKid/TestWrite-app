<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { auth } from "@/model/auth";
</script>

<script lang="ts">
export default {
  mounted() {
    this.userTheme = this.$cookies.isKey("userTheme") ? this.$cookies.get("userTheme") : "light" as string;
    this.$cookies.set("userTheme", this.userTheme);

    if (this.$cookies.isKey("userId")) {
      const redirect = this.$route.query.redirect as string;

      auth.id = this.$cookies.get("userId");
      auth.name = this.$cookies.isKey("userName") ? this.$cookies.get("userName") : null;
      auth.roleId = this.$cookies.isKey("userRoleId") ? this.$cookies.get("userRoleId") : null;
      auth.accessToken = this.$cookies.isKey("userAccessToken") ? this.$cookies.get("userAccessToken") : null;

      if (redirect !== undefined) this.$router.push(redirect);
      else if (this.$router.currentRoute.value.name === "login") this.$router.push("/projects");
    }
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

    logout() {
      auth.logOut();
      
      this.$cookies.remove("userId");
      this.$cookies.remove("userName");
      this.$cookies.remove("userRoleId");
      this.$cookies.remove("userAccessToken");
    },
  },
};
</script>

<template>
  <header>
    <div class="content">
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
      <button v-if="auth.id !== null" @click="logout()" class="secondaryButton">
        Uitloggen
      </button>
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
    <div class="content">
      <p>
        Bedankt voor het bezoeken van mijn website.
      </p>
    </div>
  </footer>
</template>

<style scoped></style>