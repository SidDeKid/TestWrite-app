<script lang="ts" setup>
import { auth } from "@/model/auth";
</script>

<script lang="ts">
export default {
  data() {
    return {
      password: "$mm$24VsTKOqjkQy",
      errorMessage: "",
    };
  },

  methods: {
    async logIn() {
      const result = await auth.logInWithPassword(this.password) as string | true;

      if (result !== true) {
        this.errorMessage = result;
        setTimeout(() => this.errorMessage = "", 5000);
      } else {
        const redirect = this.$route.query.redirect as string;

        console.log(auth);

        this.$cookies.set("userId", auth.id);
        this.$cookies.set("userName", auth.name);
        this.$cookies.set("userRoleId", auth.roleId);
        this.$cookies.set("userAccessToken", auth.accessToken);

        if (redirect !== undefined) this.$router.push(redirect);
        else (this.$router.push({ name: "projects" }));
      }
    },
  }
};
</script>

<template>
  <div class="logIn page">
    <section>
      <div class="content">
        <h1>Log in</h1>
        <div id="logInForm">
          <input type="text" placeholder="E-mail" v-model="auth.email"> <br>
          <input type="password" placeholder="Wachtwoord" v-model="password"> <br>
          <p class="errorMessage" v-if="errorMessage !== ''">{{ errorMessage }}</p>
          <button class="primaryButton" @click="logIn()">Log in</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
#logInForm input,
#logInForm p {
  margin-bottom: 10px;
}

.errorMessage {
  color: red;
}
</style>