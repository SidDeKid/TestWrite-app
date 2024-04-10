import APIHelper from "@/helpers/APIHelper";
import { reactive } from "vue";
import axios from "axios";

export default class Project {
  private _id!: number;
  public get id(): number {
    return this._id;
  }
  private set id(v: number) {
    this._id = v;
  }

  private _name!: string;
  public get name(): string {
    return this._name;
  }
  private set name(v: string) {
    this._name = v;
  }

  private _user_id!: number;
  public get user_id(): number {
    return this._user_id;
  }
  private set user_id(v: number) {
    this._user_id = v;
  }

  private APIBase: string = new APIHelper().projects;

  constructor(id: number, name: string, user_id: number) {
    this.id = id;
    this.name = name;
    this.user_id = user_id;
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
          this.name = response.data.name as string;
          this.user_id = response.data.user_id as number;

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

export const currentProject = reactive({});

export const projects = reactive({
  data: new Array<Project>(),
  async fillList(): Promise<true | string> {
    this.data = new Array<Project>();

    let result: string | true = "Failed due to missing implimentation.";

    await axios
      .get(new APIHelper().projects, {
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
            const project = new Project(
              data.id as number,
              data.name as string,
              data.user_id as number
            );
            this.data.push(project);
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
