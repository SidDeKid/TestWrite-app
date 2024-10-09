<script lang="ts" setup>
import { projects, currentProject } from "@/model/project";
import Project from "@/model/project";
</script>

<script lang="ts">
export default {
  async mounted() {
    if (projects.data.length === 0) {
      const result = await projects.fillList();

      if (result !== true) console.error(result);
    }
    this.projectsLoaded = true;

    if (this.$cookies.isKey("currentProjectId") && this.$cookies.get("currentProjectId") !== "null") {
      const cookieCurrentProject = await projects.findById(this.$cookies.get("currentProjectId"));
      if (typeof cookieCurrentProject !== "string") {
        currentProject.id = cookieCurrentProject.id;
        currentProject.name = cookieCurrentProject.name;
        currentProject.description = cookieCurrentProject.description;
      } else {
        console.error(cookieCurrentProject);
      }
    }
  },

  data() {
    return {
      projectsLoaded: false
    };
  },

  methods: {
    selectProject(project: Project) {
      project.select();
      window.scrollTo(0, 0);
      this.$cookies.set("currentProjectId", project.id);
    },

    deselectProject() {
      currentProject.deselect();
      this.$cookies.remove("currentProjectId");
    }
  }
};
</script>

<template>
  <div class="projects page">
    <section>
      <div class="content">
        <h1>Projecten</h1>
      </div>
    </section>
    <section v-if="currentProject.id !== null">
      <div class="content">
        <h2>Huidig project</h2>
        <div class="project current">
          <h3 class="title">{{ currentProject.name }}</h3>
          <p class="description">{{ currentProject.description }}</p>
          <div class="buttons buttonSection">
            <button class="primaryButton" @click="deselectProject()">
              Ander project gebruiken
            </button>
            <RouterLink v-bind:to="`/projects/${currentProject.id}`">
              <button class="secondaryButton">
                Dit project bewerken
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="content">
        <h2>Uw projecten</h2>
        <div v-for="project in projects.data.filter((project) => project.id !== currentProject.id)"
          :key="project.id as number" class="project">
          <h3 class="title">{{ project.name }}</h3>
          <p class="description">{{ project.description }}</p>
          <div class="buttons buttonSection">
            <button class="primaryButton" @click="selectProject(project as Project)">
              Dit project gebruiken
            </button>
            <RouterLink v-bind:to="`/projects/${project.id}`">
              <button class="secondaryButton">
                Dit project bewerken
              </button>
            </RouterLink>
          </div>
        </div>
        <div v-if="!projectsLoaded">
          <p>
            Projecten aan het ophalen...
          </p>
        </div>
        <div v-else-if="projects.data.length === 0">
          <p>
            Er zijn geen projecten gevonden.
          </p>
          <div class="buttonSection">
            <RouterLink to="/projects/create">
              <button class="primaryButton">
                Nieuw project toevoegen
              </button>
            </RouterLink>
            <button class="secondaryButton">
              Probleem melden
            </button>
          </div>
        </div>
        <div v-else-if="projects.data.filter((project) => project.id !== currentProject.id).length === 0">
          <p>
            Er zijn geen andere projecten gevonden.
          </p>
          <RouterLink to="/projects/create">
            <button class="primaryButton">
              Nieuw project toevoegen
            </button>
          </RouterLink>
        </div>
        <RouterLink v-else to="/projects/create">
          <button class="primaryButton">
            Nieuw project toevoegen
          </button>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.project {
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr;
  column-gap: 15px;
}

.project .title {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
}

.project .description {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
}

.project .buttons {
  grid-row: 2 / 3;
  grid-column: 1 / 3;
}

#section2 .project {
  padding-top: 10px;
}

#section3 .project {
  padding: 10px 0;
}

#section3 .project:last-child {
  padding-bottom: 0;
}
</style>