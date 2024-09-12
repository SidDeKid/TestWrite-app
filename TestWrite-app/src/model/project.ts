import { reactive } from "vue";
import axios from "axios";
import { APIHelper } from "@/helpers/APIHelper";
import { errorMessageHelper } from "@/helpers/errorMessageHelper";
import ModelClass, { modelClasses } from "./modelClass";
import Test, { tests } from "./test";
import { auth } from "./auth";
import Property, { properties } from "./property";

axios.defaults.headers.common = {
  Authorization: `Bearer ${auth.accessToken !== null ? auth.accessToken : ""}`,
  "Content-Type": "application/json"
};

const refreshAuth = () => {
  axios.defaults.headers.common.Authorization = auth.accessToken !== null ? auth.accessToken : "";
};

export default class Project {
  private _id: number | null = null;
  public get id(): number | null {
    return this._id;
  }
  private set id(v: number | null) {
    this._id = v;
  }

  private _user_id!: number;
  public get user_id(): number {
    return this._user_id;
  }
  private set user_id(v: number) {
    this._user_id = v;
  }

  private _name!: string;
  public get name(): string {
    return this._name;
  }
  private set name(v: string) {
    this._name = v;
  }

  private _description: string | null = null;
  public get description(): string | null {
    return this._description;
  }
  private set description(v: string | null) {
    this._description = v;
  }

  constructor(user_id: number, name: string, id?: number | null, description?: string | null) {
    this.user_id = user_id;
    this.name = name;
    if (id !== undefined) this.id = id;
    if (description !== undefined) this.description = description;
  }

  /**
   * Select this project to me the current project.
   */
  public select(): void {
    currentProject.id = this.id;
    currentProject.name = this.name;
    currentProject.description = this.description;
  }

  public async update(): Promise<string | true> {
    let result = errorMessageHelper.notImplemented as string | true;

    refreshAuth();

    await axios
      .put(APIHelper.projects + this.id, {
        name: this.name,
        description: this.description
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }

        const index = projects.data.findIndex((dataProject) => (dataProject.id = this.id));
        if (index !== -1) {
          projects.data[index] = this;
          result = true;
        } else result = errorMessageHelper.resourceNotFound;
      })
      .catch((response) => {
        switch (response.response !== undefined ? response.response.status : null) {
          case "404":
            result = errorMessageHelper.notFound;
            break;
          case "422":
            result = errorMessageHelper.badInput;
            break;
          case "429":
            result = errorMessageHelper.toManyRequests;
            break;
          default:
            result = errorMessageHelper.unknown;
            break;
        }
      });

    return result;
  }

  public async delete(): Promise<string | true> {
    let result = errorMessageHelper.notImplemented as string | true;

    refreshAuth();

    await axios
      .delete(APIHelper.projects + this.id)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }

        const index = projects.data.findIndex((dataProject) => (dataProject.id = this.id));
        if (index !== -1) {
          projects.data.splice(index, 1);
          result = true;
        } else result = errorMessageHelper.resourceNotFound;
      })
      .catch((response) => {
        switch (response.response !== undefined ? response.response.status : null) {
          case "404":
            result = errorMessageHelper.notFound;
            break;
          case "429":
            result = errorMessageHelper.toManyRequests;
            break;
          default:
            result = errorMessageHelper.unknown;
            break;
        }
      });

    return result;
  }

  public async export(): Promise<string | false> {
    let result = false as string | false;

    if (this.id !== currentProject.id || modelClasses.data.length === 0) {
      const resultModelClasses = await modelClasses.fillList(this.id as number);
      if (resultModelClasses !== true) {
        console.error(resultModelClasses);
        return false;
      }
    }
    if (this.id !== currentProject.id || tests.data.length === 0) {
      const resultTests = await tests.fillList(this.id as number);
      if (resultTests !== true) {
        console.error(resultTests);
        return false;
      }
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "TestWrite-app project back-up; V1.0.0\n";
    csvContent += `project;${this.name}${this.description !== null ? ";" + this.description : ""}`;
    if (modelClasses.data.length !== 0) {
      csvContent += `\n${(
        await Promise.all(
          modelClasses.data.map(async (modelClass) => {
            if (modelClass.properties === null) {
              const modelClassPropertiesResult = await modelClass.getProperties();
              if (modelClassPropertiesResult !== true) {
                console.error(modelClassPropertiesResult);
                return false;
              }
            }
            let modelClassProperties = "";
            if (modelClass.properties !== null && modelClass.properties.length !== 0) {
              modelClassProperties =
                "\n" +
                modelClass.properties
                  .map((property) => {
                    return `property;${property.name};${property.type};${property.nullable}`;
                  })
                  .join("\n");
            }

            return (
              `modelClass;${modelClass.name};${modelClass.hasCurrent};${modelClass.hasList}` +
              modelClassProperties
            );
          })
        )
      ).join("\n")}`;
    }
    if (tests.data.length !== 0) {
      csvContent += `\n${tests.data
        .map((test) => {
          return (
            "test;" +
            `${test.happyRoad};` +
            `${test.testPath !== null ? test.testPath : ""};` +
            `${test.testPath !== null ? test.testPath : ""};` +
            `${test.expectedResult !== null ? test.expectedResult : ""};` +
            `${test.testedResult !== null ? test.testedResult : ""};` +
            `${test.succes !== null ? test.succes : ""}`
          );
        })
        .join("\n")}`;
    }

    result = encodeURI(csvContent);

    if (this.id !== currentProject.id) {
      modelClasses.fillList();
      tests.fillList();
    }

    return result;
  }
}

export const currentProject = reactive({
  id: null as number | null,
  name: null as string | null,
  description: null as string | null,
  deselect(): void {
    this.id = null;
    this.name = null;
    this.description = null;
  }
});

export const importLoadingData = reactive({ count: 0, max: 0, errors: 0 });

export const projects = reactive({
  data: new Array<Project>(),
  async fillList(): Promise<true | string> {
    this.data = new Array<Project>();

    let result: string | true = errorMessageHelper.notImplemented;

    refreshAuth();

    await axios
      .get(APIHelper.projects)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }

        try {
          for (const data of response.data) {
            const project = new Project(
              data.user_id as number,
              data.name as string,
              data.id as number,
              data.description as string | null
            );
            this.data.push(project);
          }

          result = true;
        } catch (error) {
          result = errorMessageHelper.unknown;
        }
      })
      .catch((response) => {
        console.error(response);

        switch (response.response !== undefined ? response.response.status : null) {
          case "404":
            result = errorMessageHelper.notFound;
            break;
          case "429":
            result = errorMessageHelper.toManyRequests;
            break;
          default:
            result = errorMessageHelper.unknown;
            break;
        }
      });

    return result;
  },

  async findById(id: number): Promise<Project | string> {
    let result: Project | string = errorMessageHelper.notImplemented;

    refreshAuth();

    await axios
      .get(APIHelper.projects + id)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }

        try {
          result = new Project(
            response.data.user_id as number,
            response.data.name as string,
            response.data.id as number,
            response.data.description as string | null
          );
        } catch (error) {
          result = errorMessageHelper.unknown;
        }
      })
      .catch((response) => {
        switch (response.response !== undefined ? response.response.status : null) {
          case "404":
            result = errorMessageHelper.notFound;
            break;
          case "429":
            result = errorMessageHelper.toManyRequests;
            break;
          default:
            result = errorMessageHelper.unknown;
            break;
        }
      });

    return result;
  },

  /**
   * Makes a unique id.
   */
  // async getUniqueId(): Promise<string | number> {
  //   let result: string | number = errorMessageHelper.notImplemented;

  //   refreshAuth();

  //   await axios
  //     .get(`${APIHelper.projects}id`)
  //     .then((response) => {
  //       if (response.status !== 200) {
  //         throw new Error(String(response));
  //       }

  //       try {
  //         result = response.data as number;
  //       } catch (error) {
  //         result = errorMessageHelper.unknown;
  //       }
  //     })
  //     .catch((response) => {
  //       switch (response.response !== undefined ? response.response.status : null) {
  //         case "404":
  //           result = errorMessageHelper.notFound;
  //           break;
  //         case "429":
  //           result = errorMessageHelper.toManyRequests;
  //           break;
  //         default:
  //           result = errorMessageHelper.unknown;
  //           break;
  //       }
  //     });

  //   return result;
  // },

  async create(project: Project): Promise<string | true> {
    let result = errorMessageHelper.notImplemented as string | true;

    refreshAuth();

    console.log(APIHelper.projects);

    await axios
      .post(APIHelper.projects, {
        name: project.name,
        user_id: project.user_id,
        description: project.description
      })
      .then((response) => {
        if (response.status !== 201) {
          throw new Error(String(response));
        }

        console.log(response);

        this.data.push(project);
        result = true;
      })
      .catch((response) => {
        switch (response.response !== undefined ? response.response.status : null) {
          case "404":
            result = errorMessageHelper.notFound;
            break;
          case "422":
            result = errorMessageHelper.badInput;
            break;
          case "429":
            result = errorMessageHelper.toManyRequests;
            break;
          default:
            result = errorMessageHelper.unknown;
            break;
        }
      });

    return result;
  },

  /**
   * Imports correctly formated csv data into the database.
   * @param csvObjects
   * @returns true on succes, and errormessage on fail.
   */
  async import(csvObjects: Array<Array<string | null | boolean>>): Promise<string | true> {
    let result = errorMessageHelper.notImplemented as string | true;

    if (auth.id === null) {
      return errorMessageHelper.notLoggedIn;
    }

    importLoadingData.count = 0;
    importLoadingData.max = csvObjects.length;
    importLoadingData.errors = 0;
    const csvProject = csvObjects.shift();
    if (csvProject === undefined) {
      return errorMessageHelper.badFileInput;
    }

    const project = new Project(
      auth.id,
      csvProject[1] as string,
      undefined,
      csvProject[2] as string | null
    );

    result = await this.create(project);
    if (result === errorMessageHelper.badInput) return errorMessageHelper.badFileInput;
    else if (result !== true) return result;
    importLoadingData.count++;

    let resultId;

    let previousModelClass = null as ModelClass | null;
    for (const csvObject of csvObjects) {
      switch (csvObject[0]) {
        case "test":
          resultId = await tests.getUniqueId();
          if (typeof resultId === "string") return resultId;

          result = await tests.create(
            new Test(
              resultId,
              project.id as number,
              csvObject[1] as boolean,
              csvObject[2] as string | null,
              csvObject[3] as string | null,
              csvObject[4] as string | null,
              csvObject[5] as string | null,
              csvObject[6] as boolean | null
            )
          );
          if (result === errorMessageHelper.badInput) result = errorMessageHelper.badFileInput;
          else if (result !== true) return result;

          importLoadingData.count++;
          break;
        case "modelClass":
          resultId = await modelClasses.getUniqueId();
          if (typeof resultId === "string") return resultId;

          previousModelClass = new ModelClass(
            resultId,
            project.id as number,
            csvObject[1] as string,
            csvObject[2] as boolean,
            csvObject[3] as boolean
          );

          result = await modelClasses.create(previousModelClass);
          if (result === errorMessageHelper.badInput) result = errorMessageHelper.badFileInput;
          else if (result !== true) return result;

          importLoadingData.count++;
          break;
        case "property":
          if (previousModelClass === null) {
            result = errorMessageHelper.badFileInput;
            continue;
          }

          resultId = await properties.getUniqueId();
          if (typeof resultId === "string") return resultId;

          result = await properties.create(
            new Property(
              resultId,
              previousModelClass.id,
              csvObject[1] as string,
              csvObject[2] as string,
              csvObject[3] as boolean
            )
          );
          if (result === errorMessageHelper.badInput) result = errorMessageHelper.badFileInput;
          else if (result !== true) return result;

          importLoadingData.count++;
          break;
        default:
          result = errorMessageHelper.badFileInput;
          importLoadingData.count++;
          importLoadingData.errors++;
      }
    }

    return result;
  }
});
