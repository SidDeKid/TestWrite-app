import APIHelper from "@/helpers/APIHelper";
import { reactive } from "vue";
import axios from "axios";

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

  private APIBase: string = new APIHelper().modelClasses;

  constructor(id: number, project_id: number, name: string, hasList: boolean, hasCurrent: boolean) {
    this.id = id;
    this.project_id = project_id;
    this.name = name;
    this.hasList = hasList;
    this.hasCurrent = hasCurrent;
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
          this.id = response.data.id as number;
          this.project_id = response.data.project_id as number;
          this.name = response.data.name as string;
          this.hasList = response.data.hasList as boolean;
          this.hasCurrent = response.data.hasCurrent as boolean;

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
}

export const modelClasses = reactive({
  data: new Array<ModelClass>(),
  async fillList(): Promise<true | string> {
    this.data = new Array<ModelClass>();

    let result: string | true = "Failed due to missing implimentation.";

    await axios
      .get(new APIHelper().modelClasses, {
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
            const modelClass = new ModelClass(
              data.id as number,
              data.project_id as number,
              data.name as string,
              data.hasList as boolean,
              data.hasCurrent as boolean
            );
            this.data.push(modelClass);
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
