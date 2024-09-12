<script lang="ts" setup>
import { currentProject } from "@/model/project";
</script>

<template>
  <div class="home page">
    <section id="section1">
      <div class="content">
        <h1>Start developing faster</h1>
      </div>
    </section>
    <section id="section2" class="twoColumns">
      <div class="content">
        <div>
          <h2>Test-cases</h2>
          <p>
            Met deze web-app kun je test-cases maken voor het functionele testen van programma's.
          </p>
          <RouterLink v-if="currentProject.id === null" to="/projects">
            <button class="primaryButton">
              Projecten bekijken
            </button>
          </RouterLink>
          <RouterLink v-else to="/tests">
            <button class="primaryButton">
              Test-cases bekijken
            </button>
          </RouterLink>
        </div>
        <div>
          <h2>Classes</h2>
          <p>
            Met deze web-app kun je ook classes maken voor in je programma's.
          </p>
          <RouterLink v-if="currentProject.id === null" to="/projects">
            <button class="primaryButton">
              Projecten bekijken
            </button>
          </RouterLink>
          <RouterLink v-else to="/model-classes">
            <button class="primaryButton">
              Classes bekijken
            </button>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
#section2 .content div {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

#section2 .content div p {
  margin-top: 0;
}
</style>