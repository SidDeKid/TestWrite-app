import { reactive } from "vue";
import axios from "axios";
import { APIHelper } from "@/helpers/APIHelper";
import { errorMessageHelper } from "@/helpers/errorMessageHelper";
import { auth } from "./auth";
import { currentProject } from "@/model/project";
import Property, { properties } from "./property";

axios.defaults.headers.common = {
  Authorization: `Bearer ${auth.accessToken !== null ? auth.accessToken : ""}`,
  "Content-Type": "application/json"
};

const refreshAuth = () => {
  axios.defaults.headers.common.Authorization = auth.accessToken !== null ? auth.accessToken : "";
};

export default class ModelClass {
  private _id!: number;
  public get id(): number {
    return this._id;
  }
  private set id(v: number) {
    this._id = v;
  }

  private _project_id!: number;
  public get project_id(): number {
    return this._project_id;
  }
  private set project_id(v: number) {
    this._project_id = v;
  }

  private _name!: string;
  public get name(): string {
    return this._name;
  }
  private set name(v: string) {
    this._name = v;
  }

  private _hasList!: boolean;
  public get hasList(): boolean {
    return this._hasList;
  }
  private set hasList(v: boolean) {
    this._hasList = v;
  }

  private _hasCurrent!: boolean;
  public get hasCurrent(): boolean {
    return this._hasCurrent;
  }
  private set hasCurrent(v: boolean) {
    this._hasCurrent = v;
  }

  private _properties: Array<Property> | null = null;
  public get properties(): Array<Property> | null {
    return this._properties;
  }
  private set properties(v: Array<Property> | null) {
    this._properties = v;
  }

  constructor(id: number, project_id: number, name: string, hasList: boolean, hasCurrent: boolean) {
    this.id = id;
    this.project_id = project_id;
    this.name = name;
    this.hasList = hasList;
    this.hasCurrent = hasCurrent;
  }

  public async getProperties(): Promise<string | true> {
    refreshAuth();

    const result = await properties.get(this.id);
    if (typeof result !== "string") {
      this.properties = result;
      return true;
    }
    return result;
  }
}

export const modelClasses = reactive({
  data: new Array<ModelClass>(),
  async fillList(projectId?: number): Promise<true | string> {
    this.data = new Array<ModelClass>();
    let result: string | true = errorMessageHelper.notImplemented;

    if (projectId === undefined) {
      if (currentProject.id === null) return "No project selected.";
      projectId = currentProject.id;
    }

    refreshAuth();

    await axios
      .get(`${APIHelper.projects}${projectId}/model-classes`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }
        return response;
      })
      .then((response) => {
        try {
          for (const data of response.data) {
            const modelClass = new ModelClass(
              data.id as number,
              data.project_id as number,
              data.name as string,
              (data.has_list === 1) as boolean,
              (data.has_current === 1) as boolean
            );
            this.data.push(modelClass);
          }

          result = true;
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
  async getUniqueId(): Promise<string | number> {
    let result: string | number = errorMessageHelper.notImplemented;

    refreshAuth();

    await axios
      .get(`${APIHelper.modelClasses}id`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }
        return response;
      })
      .then((response) => {
        try {
          result = response.data as number;
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

  async create(modelClass: ModelClass): Promise<string | true> {
    let result = errorMessageHelper.notImplemented as string | true;

    refreshAuth();

    await axios
      .post(APIHelper.modelClasses, {
        id: modelClass.id,
        project_id: modelClass.project_id,
        name: modelClass.name,
        has_list: modelClass.hasList ? 1 : 0,
        has_current: modelClass.hasCurrent ? 1 : 0
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }
        this.data.push(modelClass);
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
});
