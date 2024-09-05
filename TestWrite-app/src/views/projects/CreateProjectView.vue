<script lang="ts" setup>
import { auth } from "@/model/auth";
import { importLoadingData, projects } from "@/model/project";
import Project from "@/model/project";
import LoadingBar from "@/components/widgets/LoadingBar.vue";
</script>

<script lang="ts">
export default {
  data() {
    return {
      importOptionAvailable: true,
      importRequestLoading: false,
      importRequestFailed: false,
      importRequestSucces: false,
      createRequestLoading: false,
      createRequestFailed: false,
      createRequestSucces: false,
      name: "",
      nameValidationMessage: null as string | null,
      description: "",
      descriptionValidationMessage: null as string | null
    };
  },

  methods: {
    /**
     * Create, and automaticly select a project. With validation, and errorhandling.
     */
    async createProject(): Promise<void> {
      const user_id = auth.id;
      const name = this.name;
      const description = this.description !== "" ? this.description : null;

      // Validate
      let passedValidation = true;
      this.nameValidationMessage = null;
      this.descriptionValidationMessage = null;
      this.createRequestSucces = false;
      if (user_id === null) return;
      if (name.length > 255 || name.length === 0) {
        this.nameValidationMessage = `Dit veld kan niet leeg of langer dan 255 karakters zijn. Huidige lengte: ${name.length} karakters`;
        passedValidation = false;
      }
      if (description !== null && description.length > 500) {
        this.descriptionValidationMessage = `Dit veld kan niet langer dan 500 karakters zijn. Huidige lengte: ${description.length} karakters`;
        passedValidation = false;;
      }
      if (!passedValidation) return;

      this.createRequestLoading = true;

      // Get unique id for the project.
      const result1 = await projects.getUniqueId();
      if (typeof result1 === "string") {
        this.createRequestLoading = false;
        this.createRequestFailed = true;
        return;
      }
      const id = result1;

      // Create project
      const project = new Project(
        id,
        user_id,
        name,
        description
      );
      const result2 = await projects.create(project);

      // Select project & error handling
      if (result2 === true) {
        project.select();
        this.$cookies.set("currentProjectId", project.id);
        this.name = "";
        this.description = "";
        this.createRequestSucces = true;
      }
      else {
        this.createRequestFailed = true;
        this.createRequestLoading = false;
        console.error(result2);
      }

      this.createRequestLoading = false;
    },

    async importProject(e: any) {
      this.importRequestLoading = true;

      const file = e.target.files[e.target.files.length - 1];

      const reader = new FileReader();

      reader.onload = async () => {
        const result = await projects.import((reader.result as string).split(/\r\n|\r|\n/).map((rawDataObject) => {
          return rawDataObject.split(";").map((singleProperty) => {
            switch (singleProperty) {
              case "":
                return null;
              case "true":
                return true;
              case "false":
                return false;
              default:
                return singleProperty;
            }
          });
        }));

        if (result !== true) {
          console.error(result);
          this.importRequestFailed = true;
        }
        else this.importRequestSucces = true;
        this.importRequestLoading = false;
      };

      reader.readAsText(file);
    }
  },

  components: {
    LoadingBar
  }
};
</script>

<template>
  <div class="createProject page">
    <div class="section">
      <h1>Project toevoegen</h1>
    </div>
    <div v-if="importOptionAvailable" class="section">
      <h2>Bestaand project?</h2>
      <p>
        Het is mogelijk om oude projecten te exporteren en weer opnieuw te importeren, om ruimte te besparen.
      </p>
      <LoadingBar v-if="importRequestLoading || importRequestFailed" :count="importLoadingData.count"
        :max="importLoadingData.max" :errors="importLoadingData.errors"
        :force-stop="importRequestFailed && importLoadingData.count !== importLoadingData.max">
      </LoadingBar>
      <div class="buttonSection">
        <label for="importInput" class="primaryLabelButton">
          <span v-if="importRequestSucces">Extra project importeren</span>
          <span v-else>Project importeren</span>
        </label>
        <input type="file" id="importInput" accept=".csv" @change="importProject" :disabled="importRequestLoading">
        <button v-if="!importRequestSucces" class="secondaryButton" @click="importOptionAvailable = false"
          :disabled="importRequestLoading">
          Nee, afsluiten
        </button>
        <RouterLink v-else to="/projects" :disabled="importRequestLoading">
          <button class="secondaryButton">
            Projecten bekijken
          </button>
        </RouterLink>
      </div>
    </div>
    <div class="section">
      <h2>Nieuw project</h2>
      <p>
        Velden met een * zijn verplicht.
      </p>
      <div class="createForm">
        <label for="name">Naam: *</label>
        <input type="text" id="name" placeholder="Kassasysteem..." v-model="name"
          v-bind:class="nameValidationMessage === null ? '' : 'wrongInput'">
        <p v-if="nameValidationMessage !== null" class="validationMessage">{{ nameValidationMessage }}</p>
        <label for="description">Omschrijving:</label>
        <textarea id="description" placeholder="Het WPF-kassasysteem voor Nietbestaand Horeca Bedrijf..."
          v-model="description" rows="5"
          v-bind:class="descriptionValidationMessage === null ? '' : 'wrongInput'"></textarea>
        <p v-if="descriptionValidationMessage !== null" class="validationMessage">{{ descriptionValidationMessage }}</p>
        <p v-if="createRequestLoading" class="createRequestLoading">Aan het laden...</p>
        <p v-if="createRequestFailed" class="createRequestFailed">Er is iets mis gegaan met het toevoegen van dit
          project. Probeer het opnieuw.</p>
        <p v-if="createRequestSucces" class="createRequestSucces">Het project is toegevoegt.</p>
        <div class="buttonSection">
          <button class="primaryButton" @click="createRequestLoading ? () => { } : createProject()">
            <span v-if="createRequestSucces">Nog één toevoegen</span>
            <span v-else>Toevoegen</span>
          </button>
          <button v-if="createRequestFailed" class="secondaryButton">
            Probleem melden
          </button>
          <RouterLink v-if="createRequestSucces" to="/projects">
            <button class="secondaryButton">
              Projecten bekijken
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#importInput {
  display: none;
}

.createForm {
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 15px;
  column-gap: 15px;
}

.createForm input.wrongInput,
.createForm textarea.wrongInput {
  border: 1px solid red;
}

.createForm input {
  max-width: 250px;
}

.createForm textarea {
  max-width: 500px;
  resize: none;
}

.createForm .validationMessage,
.createForm .createRequestFailed {
  grid-column: 2 / 3;
  margin: 0;
  color: red;
}

.createForm .createRequestSucces {
  grid-column: 2 / 3;
  margin: 0;
  color: var(--color1);
}

.createForm .createRequestLoading {
  grid-column: 2 / 3;
  margin: 0;
}

.createForm .buttonSection {
  grid-column: 2 / 3;
  width: fit-content;
}
</style>