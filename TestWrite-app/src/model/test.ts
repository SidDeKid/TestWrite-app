import APIHelper from "@/helpers/APIHelper";
import { reactive } from "vue";
import axios from "axios";

export default class Test {
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

  private _happyRoad!: boolean;
  public get happyRoad(): boolean {
    return this._happyRoad;
  }
  private set happyRoad(v: boolean) {
    this._happyRoad = v;
  }

  private _testPath: string | null = null;
  public get testPath(): string | null {
    return this._testPath;
  }
  private set testPath(v: string | null) {
    this._testPath = v;
  }

  private _expected_result: string | null = null;
  public get expected_result(): string | null {
    return this._expected_result;
  }
  private set expected_result(v: string | null) {
    this._expected_result = v;
  }

  private _tested_result: string | null = null;
  public get tested_result(): string | null {
    return this._tested_result;
  }
  private set tested_result(v: string | null) {
    this._tested_result = v;
  }

  private _succes: boolean | null = null;
  public get succes(): boolean | null {
    return this._succes;
  }
  private set succes(v: boolean | null) {
    this._succes = v;
  }

  private APIBase: string = new APIHelper().tests;

  constructor(
    id: number,
    project_id: number,
    happyRoad: boolean,
    testPath?: string | null,
    expected_result?: string | null,
    tested_result?: string | null,
    succes?: boolean | null
  ) {
    this.id = id;
    this.project_id = project_id;
    this.happyRoad = happyRoad;
    if (testPath !== undefined) this.testPath = testPath;
    if (expected_result !== undefined) this.expected_result = expected_result;
    if (tested_result !== undefined) this.tested_result = tested_result;
    if (succes !== undefined) this.succes = succes;
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
          this.happyRoad = response.data.happyRoad as boolean;
          this.testPath = response.data.testPath as string | null;
          this.expected_result = response.data.expected_result as string | null;
          this.tested_result = response.data.tested_result as string | null;
          this.succes = response.data.succes as boolean | null;

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

export const tests = reactive({
  data: new Array<Test>(),
  async fillList(): Promise<true | string> {
    this.data = new Array<Test>();

    let result: string | true = "Failed due to missing implimentation.";

    await axios
      .get(new APIHelper().tests, {
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
            const test = new Test(
              data.id as number,
              data.project_id as number,
              data.happyRoad as boolean,
              data.testPath as string | null,
              data.expected_result as string | null,
              data.tested_result as string | null,
              data.succes as boolean | null
            );
            this.data.push(test);
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
