<script lang="ts" setup>
import { projects, currentProject } from "@/model/project";
import Project from "@/model/project";
import NotFoundView from "../NotFoundView.vue";
</script>

<script lang="ts">
export default {
  props: ["id"],

  async mounted() {
    if (projects.data.length === 0) {
      await projects.fillList();
    }
    this.projectsLoaded = true;

    const tempProject = projects.data.find((project) => project.id === Number(this.$route.params.id)) as Project | undefined;

    if (tempProject !== undefined) this.project = tempProject;
    else this.projectNotFound = true;
  },

  data() {
    return {
      projectsLoaded: false,
      project: null as null | Project,
      projectNotFound: false,
      updateRequestLoading: false,
      updateRequestFailed: false,
      updateRequestSucces: false,
      deleteRequestLoading: false,
      deleteRequestFailed: false,
      exportRequestLoading: false,
      exportRequestSucces: false,
      confirmationPopUp: false,
      nameValidationMessage: null as string | null,
      descriptionValidationMessage: null as string | null
    };
  },

  methods: {
    selectProject() {
      if (this.project !== null) {
        this.project.select();
        this.$cookies.set("currentProjectId", this.project.id);
      }
    },

    deselectProject() {
      currentProject.deselect();
      this.$cookies.remove("currentProjectId");
    },

    async deleteProject() {
      if (this.project !== null) {
        this.deleteRequestLoading = true;

        const result = await this.project.delete();

        if (result === true) {
          if (this.project.id === currentProject.id) {
            currentProject.deselect();
            this.$cookies.remove("currentProjectId");
          }
          window.location.href = "/projects";
        }
        else {
          this.deleteRequestFailed = true;
          console.error(result);
          this.deleteRequestLoading = false;
        }
      }
    },

    async updateProject() {
      if (this.project !== null) {
        const name = this.project.name;
        const description = this.project.description !== "" ? this.project.description : null;

        // Validate
        let passedValidation = true;
        this.nameValidationMessage = null;
        this.descriptionValidationMessage = null;
        this.updateRequestSucces = false;
        if (name.length > 255 || name.length === 0) {
          this.nameValidationMessage = `Dit veld kan niet leeg of langer dan 255 karakters zijn. Huidige lengte: ${name.length} karakters`;
          passedValidation = false;
        }
        if (description !== null && description.length > 500) {
          this.descriptionValidationMessage = `Dit veld kan niet langer dan 500 karakters zijn. Huidige lengte: ${description.length} karakters`;
          passedValidation = false;;
        }
        if (!passedValidation) return;

        this.updateRequestLoading = true;

        // Update project
        const result2 = await this.project.update();

        // Select project & error handling
        if (result2 === true) {
          this.updateRequestSucces = true;
        }
        else {
          this.updateRequestFailed = true;
          console.error(result2);
        }

        this.updateRequestLoading = false;
      }
    },

    async exportProject() {
      this.exportRequestLoading = true;
      this.exportRequestSucces = false;

      if (this.project !== null) {
        const result = await this.project.export();
        if (result !== false) {
          var link = document.createElement("a");
          link.setAttribute("href", result);
          link.setAttribute("download", this.project.name);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          this.exportRequestSucces = true;
        };
      }

      this.exportRequestLoading = false;
    }
  },

  components: {
    NotFoundView
  }
};
</script>

<template>
  <NotFoundView v-if="projectNotFound"></NotFoundView>
  <div v-else-if="project === null" class="projectsDetail page">
    <section>
      <div class="content">
        <h1>Project aan het ophalen</h1>
        <p>
          Eén moment gedult a.u.b.
        </p>
        <button class="primaryButton">
          Probleem melden
        </button>
      </div>
    </section>
  </div>
  <div v-else class="projectsDetail page">
    <section>
      <div class="content">
        <h1>{{ project.name }}</h1>
      </div>
    </section>
    <section>
      <div class="content">
        <h2>Exporteren & verwijderen</h2>
        <p>
          Exporteer je project om er een back-up van te maken of om hem lokaal te bewaren voordat je deze verwijderd van
          het systeem.
        </p>
        <p v-if="exportRequestSucces" class="exportRequestSucces">
          Het exporteren van dit project is gelukt! Je kunt hem nu veilig verwijderen.
        </p>
        <p v-if="deleteRequestLoading">
          Project aan het verwijderen...
        </p>
        <div class="buttonSection">
          <button class="primaryButton" @click="exportRequestLoading ? () => { } : exportProject()">
            Dit project exporteren
          </button>
          <!-- <button class="secondaryButton"
              @click="exportRequestSucces ? deleteProject() : () => { confirmationPopUp = true }">
              Dit project verwijderen
            </button> -->
          <button class="secondaryButton" @click="deleteProject()">
            Dit project verwijderen
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.exportRequestSucces {
  color: var(--color1);
}
</style>