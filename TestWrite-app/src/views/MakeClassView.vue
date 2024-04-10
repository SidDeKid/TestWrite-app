<script lang="ts">
export default {
  data() {
    return {
      name: "",
      hasList: true,
      hasCurrent: false,
      properties: [
        { name: "id", type: "number", nullable: false },
        { name: "", type: "string", nullable: true },
      ] as Array<{ name: string, type: string, nullable: boolean }>,
      result: null as HTMLDivElement | null
    };
  },

  methods: {
    checkExtraProperty() {
      if (this.properties[this.properties.length - 1].name !== "") {
        this.properties.push({ name: "", type: "string", nullable: true });
      }
      else if (this.properties[this.properties.length - 2].name === "") {
        this.properties.pop();
      }
    },

    makeClass() {
      const pascalName = this.name.toLowerCase().split(" ").map(word => {
        return word.slice(0, 1).toUpperCase() + word.slice(1);
      }).join("");
      const camalName = pascalName.slice(0, 1).toLowerCase() + pascalName.slice(1);
      const listName = camalName.endsWith("s") ?
        camalName + "es" :
        camalName.endsWith("y") ?
          camalName.slice(0, camalName.length - 1) + "ies" :
          camalName + "s";
      const requiredProperties = this.properties.filter(inputProperty => inputProperty.name !== "" && !inputProperty.nullable);
      const nullableProperties = this.properties.filter(inputProperty => inputProperty.name !== "" && inputProperty.nullable);

      const result = document.createElement("div");

      result.innerText = `import APIHelper from "@/helpers/APIHelper";
      import { reactive } from "vue";
      import axios from "axios";

      export default class ${pascalName} {
      ${requiredProperties.map(property => {
        return `\nprivate _${property.name}!: ${property.type};
        public get ${property.name}(): ${property.type} {
          return this._${property.name};
        }
        private set ${property.name}(v: ${property.type}) {
          this._${property.name} = v;
        }
      `;
      }).join("")}${nullableProperties.map(property => {
        return `\nprivate _${property.name}: ${property.type} | null = null;
        public get ${property.name}(): ${property.type} | null {
          return this._${property.name};
        }
        private set ${property.name}(v: ${property.type} | null) {
          this._${property.name} = v;
        }
      `;
      }).join("")}
      private APIBase: string = new APIHelper().${listName};

      constructor(${requiredProperties.length !== 0 ? `${requiredProperties.map(property => {
        return `${property.name}: ${property.type}`;
      }).join(", ")}${nullableProperties.length !== 0 ? ", " : ""}` : ""}${nullableProperties.length !== 0 ? `${nullableProperties.map(property => {
        return `${property.name}?: ${property.type} | null`;
      }).join(", ")}` : ""})
      {${requiredProperties.length !== 0 ? `\n${requiredProperties.map(property => {
        return `this.${property.name} = ${property.name};`;
      }).join("\n")}${nullableProperties.length !== 0 ? `\n${nullableProperties.map(property => {
        return `if (${property.name} !== undefined) this.${property.name} = ${property.name};`;
      }).join("\n")}` : ""}` : `${nullableProperties.length !== 0 ? `\n${nullableProperties.map(property => {
        return `if (${property.name} !== undefined) this.${property.name} = ${property.name};`;
      }).join("\n")}` : ""}`}
      }

      /**
      * Gets it's data out of the API.
      * @returns Succes of the log in, true or errormessage.
      */
      public async getData(): Promise<string | true> {
        let result: true | string = "Failed due to missing implimentation.";

        await axios
          .get(this.APIBase + this.id, {
            headers: {
              "Content-Type": "utf-8"
            }
          })
          .then((response) => {
            if (response.status !== 200) {
              throw new Error(String(response));
            }
            return response;
          })
          .then((response) => {
            try {
              ${requiredProperties.length !== 0 ? `${requiredProperties.map(property => {
        return `this.${property.name} = response.data.${property.name} as ${property.type}`;
      }).join(";\n")}` : ""}
              ${nullableProperties.length !== 0 ? `${nullableProperties.map(property => {
        return `this.${property.name} = response.data.${property.name} as ${property.type} | null`;
      }).join(";\n")}` : ""}

              result = true;
            } catch (error) {
              result = String(error);
            }
          })
          .catch((response) => {
            result = response;
          });

        return result;
      }
      }${this.hasCurrent ? `
        \nexport const current${pascalName} = reactive({});` : ""}
      ${this.hasList ? `
        export const ${listName} = reactive({
          data: new Array<${pascalName}>(),
          async fillList(): Promise<true | string> {
            this.data = new Array<${pascalName}>();

            let result: string | true = "Failed due to missing implimentation.";

            await axios
              .get(new APIHelper().${listName}, {
                headers: {
                  "Content-Type": "utf-8"
                }
              })
              .then((response) => {
                if (response.status !== 200) {
                  throw new Error(String(response));
                }
                return response;
              })
              .then((response) => {
                try {
                  for (const data of response.data) {
                    const ${camalName} = new ${pascalName}(${requiredProperties.length !== 0 ? `${requiredProperties.map(property => {
        return `data.${property.name} as ${property.type}`;
      }).join(",\n")}${nullableProperties.length !== 0 ? ", \n" : ""}` : ""}${nullableProperties.length !== 0 ? `${nullableProperties.map(property => {
        return `data.${property.name} as ${property.type} | null`;
      }).join(",\n")}` : ""});
                    this.data.push(${camalName});
                  }

                  result = true;
                } catch (error) {
                  result = String(error);
                }
              })
              .catch((response) => {
                result = String(response);
              });

            return result;
          }
        });
        ` : ""}
      `;

      this.result = result;
    },
  }
};
</script>

<template>
  <div class="makeClass">
    <h1>Maak class</h1>
    <div id="classForm">
      <p>Schrijf een klassenaam bestaande uit meerdere woorden op met spaties, bijvoorbeeld "class name".</p>
      <input id="name" type="text" placeholder="Naam" v-model="name"> <br>
      <label for="hasList">Heeft lijst:</label>
      <input type="checkbox" id="hasList" v-model="hasList"> <br>
      <label for="hasCurrent">Heeft huidige:</label>
      <input type="checkbox" id="hasCurrent" v-model="hasCurrent">
      <p>Properties:</p>
      <div v-for="(property, index) of properties" :key="index">
        <input :id="'propertyName' + index" type="text" placeholder="Naam" v-model="property.name"
          @input="checkExtraProperty()">
        <select :id="'propertyType' + index" v-model="property.type">
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </select>
        <label :for="'propertyNullable' + index">Nullable:</label>
        <input type="checkbox" :id="'propertyNullable' + index" v-model="property.nullable">
        <br>
      </div>
      <button class="primaryButton" @click="makeClass()">Maak class</button>
    </div>
    <h2 v-if="result !== null">Resultaat</h2>
    <div id="result" v-if="result !== null" v-html="result.innerHTML"></div>
  </div>
</template>

<style scoped>
#classForm input,
#classForm p {
  margin-bottom: 10px;
}
</style>