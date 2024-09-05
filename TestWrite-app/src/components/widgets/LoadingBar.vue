<script lang="ts">
export default {
  props: {
    count: Number,
    max: Number,
    errors: Number,
    forceStop: Boolean,
  },
};
</script>

<template>
  <div class="loadingBar">
    <div class="progressBarContainer">
      <div v-if="count !== undefined && max !== undefined" class="progressBar" :style="`width: ${count / max * 100}%`">
      </div>
    </div>
    <p>
      {{ count }} / {{ max }}
      <span v-if="errors !== undefined && errors != 0" class="errorMessage">&nbsp; {{ errors }} mislukt.</span>
      <span v-if="forceStop !== undefined && forceStop" class="errorMessage">&nbsp; Proces is stop gezet.</span>
    </p>
  </div>
</template>

<style scoped>
.loadingBar {
  width: 500px;
  max-width: 100%;
}

.progressBarContainer {
  height: 30px;
  width: 100%;
  border: 2px solid var(--color6);
}

.progressBar {
  height: 100%;
  max-width: 100%;
  background-color: var(--color1);
}

.errorMessage {
  color: red;
}
</style>