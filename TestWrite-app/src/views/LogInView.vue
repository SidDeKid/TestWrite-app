<script lang="ts" setup>
import { auth } from "@/model/auth";
</script>

<script lang="ts">
export default {
  data() {
    return {
      userName: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async logIn() {
      const result = await auth.logInWithData(this.userName, this.password) as string | true;
      if (result !== true) {
        this.errorMessage = result;
        setTimeout(() => this.errorMessage = "", 5000);
      };
    },
  }
};
</script>

<template>
  <div class="logIn page">
    <h1>Log in</h1>
    <div id="logInForm">
      <input type="text" placeholder="Gebruikersnaam" v-model="userName"> <br>
      <input type="password" placeholder="Wachtwoord" v-model="password"> <br>
      <p class="errorMessage" v-if="errorMessage !== ''">{{ errorMessage }}</p>
      <button class="primaryButton" @click="logIn()">Log in</button>
    </div>
  </div>
</template>

<style scoped>
#logInForm input,
#logInForm p {
  margin-bottom: 10px;
}
</style>