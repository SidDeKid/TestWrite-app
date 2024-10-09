<script lang="ts" setup>
import { tests } from "@/model/test";
import { projects, currentProject } from "@/model/project";
import Test from "@/model/test";
</script>

<script lang="ts">
export default {
  async mounted() {
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

    const result = await tests.fillList();
    if (result !== true) console.error(result);

    this.testsLoaded = true;

    for (const textarea of document.querySelectorAll("textarea")) {
      textarea.style.removeProperty("height");
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    }
  },

  data() {
    return {
      testsLoaded: false,
      changedTests: new Array<Test>(),
      createdTests: new Array<Test>(),
      deletedTests: new Array<Test>(),
      saveTimer: null as number | null,
      saving: false,
    };
  },

  // beforeRouteLeave() {
  //   if (this.saveTimer !== null || this.saving === true) {
  //     console.log(this.saveTimer, this.saving);
  //     const leave = window.confirm("Nog niet alles is opgeslagen. Weet u zeker dat u de pagina wilt verlaten?");

  //     if (!leave) return false;
  //   }
  // },

  methods: {
    resize(e: Event) {
      const textarea = e.target as HTMLTextAreaElement;
      textarea.style.removeProperty("height");
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    },

    create(position: number) {

    },

    delete(test: Test) {

    },

    refresh(test: Test) {
      if (this.changedTests.findIndex((changedTests) => {
        return changedTests.id === test.id;
      }) === -1) {
        this.changedTests.push(test);
      }

      if (this.saveTimer === undefined) {
        this.saveTimer = setTimeout(this.save, 3000);
      }
    },

    async save() {
      console.log("Saving...");
      this.saveTimer = null;
      this.saving = true;
      let result = true as true | string;

      for (const createdTest of this.createdTests) {
        result = await tests.create(createdTest as Test);
        if (result !== true) console.error(result);
      }

      for (const deletedTest of this.deletedTests) {
        result = await deletedTest.delete();
        if (result !== true) console.error(result);
      }

      // Remove all created, and deleted tests from changedTests.
      if (this.createdTests.length > 0 || this.deletedTests.length > 0) {
        this.changedTests = this.changedTests.filter((changedTest) => {
          return this.createdTests.findIndex((createdTest) => {
            return changedTest.id === createdTest.id;
          }) + this.deletedTests.findIndex((deletedTest) => {
            return changedTest.id === deletedTest.id;
          }) === -2;
        });
      }

      for (const changedTest of this.changedTests) {
        result = await changedTest.update();
        if (result !== true) console.error(result);
      }

      this.createdTests = new Array<Test>();
      this.deletedTests = new Array<Test>();
      this.changedTests = new Array<Test>();

      console.log("Saved.");
      this.saving = false;
    }
  }
};
</script>

<template>
  <div class="test page">
    <section>
      <div class="content">
        <h1>Testen</h1>
      </div>
    </section>
    <section>
      <div class="content">
        <table v-for="test in tests.data" :key="test.id" class="testCase">
          <tr>
            <th colspan="2" class="inputField"><input type="text" v-model="test.name" class="name"></th>
          </tr>
          <tr>
            <th>Testsoort</th>
            <td class="inputField">
              <select :class="test.happyRoad ? 'happyRoad' : 'alternativeRoad'" v-model="test.happyRoad"
                @change="refresh(test as Test)">
                <option :value="true" class="happyRoad">Hoofdscenario</option>
                <option :value="false" class="alternativeRoad">Alternatief</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>Scenario</th>
            <td class="inputField">
              <textarea type="text" v-model="test.testPath" @input="(e) => { resize(e); refresh(test as Test) }"
                @keydown="resize" @load="resize"></textarea>
            </td>
          </tr>
          <tr>
            <th>Verwacht resultaat</th>
            <td class="inputField">
              <textarea type="text" v-model="test.expectedResult" @input="(e) => { resize(e); refresh(test as Test) }"
                @keydown="resize"></textarea>
            </td>
          </tr>
          <tr>
            <th>Daatwerkelijk resultaat</th>
            <td class="inputField">
              <textarea type="text" v-model="test.testedResult" @input="(e) => { resize(e); refresh(test as Test) }"
                @keydown="resize" @load="resize"></textarea>
            </td>
          </tr>
          <tr>
            <th>Succes</th>
            <td class="inputField">
              <select :class="test.succes !== null && test.succes ? 'succes' : 'fail'" v-model="test.succes"
                @change="refresh(test as Test)">
                <option :value="true" class="succes">Behaald</option>
                <option :value="false" class="fail">Gezakt</option>
                <option :value="null"></option>
              </select>
            </td>
          </tr>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.testCase {
  border-collapse: collapse;
  width: 100%;
}

.testCase th {
  width: 188px;
}

.testCase td,
.testCase th {
  padding: 3px 10px;
  background-color: white;
  color: black;
  border: 1px solid black;
  text-align: left;
  vertical-align: top;
}

.testCase .name {
  background-color: var(--color1);
  color: white;
  font-weight: bold;
}

.testCase p {
  margin: 0px;
}

.testCase .inputField {
  position: relative;
  height: fit-content;
  padding: 0;
}

.testCase select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}

.testCase select.happyRoad,
.testCase option.happyRoad {
  color: var(--color1);
}

.testCase select.alternativeRoad,
.testCase option.alternativeRoad {
  color: gray;
}

.testCase select.succes,
.testCase option.succes {
  color: green;
}

.testCase select.fail,
.testCase option.fail {
  color: darkred;
}

.testCase select::-ms-expand {
  display: none;
}

.testCase textarea {
  height: 47.5px;
  resize: none;
}

.testCase textarea,
.testCase select,
.testCase .name {
  display: block;
  padding: 3px 10px;
  border: 0px;
  box-sizing: border-box;
  width: 100%;
}
</style>