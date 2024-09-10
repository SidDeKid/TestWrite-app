import { reactive } from "vue";
import axios from "axios";
import { APIHelper } from "@/helpers/APIHelper";
import { errorMessageHelper } from "@/helpers/errorMessageHelper";
import { auth } from "./auth";
import { currentProject } from "@/model/project";

const refreshAuth = () => {
  axios.defaults.headers.common = {
    Authorization: `Bearer ${auth.accessToken !== null ? auth.accessToken : ""}`,
    "Content-Type": "utf-8"
  };
};

refreshAuth();

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
  public set project_id(v: number) {
    this._project_id = v;
  }

  private _happyRoad!: boolean;
  public get happyRoad(): boolean {
    return this._happyRoad;
  }
  public set happyRoad(v: boolean) {
    this._happyRoad = v;
  }

  private _name: string | null = null;
  public get name(): string | null {
    return this._name;
  }
  public set name(v: string | null) {
    this._name = v;
  }

  private _testPath: string | null = null;
  public get testPath(): string | null {
    return this._testPath;
  }
  public set testPath(v: string | null) {
    this._testPath = v;
  }

  private _expectedResult: string | null = null;
  public get expectedResult(): string | null {
    return this._expectedResult;
  }
  public set expectedResult(v: string | null) {
    this._expectedResult = v;
  }

  private _testedResult: string | null = null;
  public get testedResult(): string | null {
    return this._testedResult;
  }
  public set testedResult(v: string | null) {
    this._testedResult = v;
  }

  private _succes: boolean | null = null;
  public get succes(): boolean | null {
    return this._succes;
  }
  public set succes(v: boolean | null) {
    this._succes = v;
  }

  constructor(
    id: number,
    project_id: number,
    happyRoad: boolean,
    name?: string | null,
    testPath?: string | null,
    expectedResult?: string | null,
    testedResult?: string | null,
    succes?: boolean | null
  ) {
    this.id = id;
    this.project_id = project_id;
    this.happyRoad = happyRoad;
    if (name !== undefined) this.name = name;
    if (testPath !== undefined) this.testPath = testPath;
    if (expectedResult !== undefined) this.expectedResult = expectedResult;
    if (testedResult !== undefined) this.testedResult = testedResult;
    if (succes !== undefined) this.succes = succes;
  }

  public async update(): Promise<string | true> {
    let result = errorMessageHelper.notImplemented as string | true;

    refreshAuth();

    await axios
      .put(APIHelper.tests + this.id, {
        project_id: this.project_id,
        happy_road: this.happyRoad ? 1 : 0,
        name: this.name,
        test_path: this.testPath,
        expected_result: this.expectedResult,
        tested_result: this.testedResult,
        succes: this.succes === null ? null : this.succes ? 1 : 0
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }

        const index = tests.data.findIndex((dataTest) => (dataTest.id = this.id));
        if (index !== -1) {
          tests.data[index] = this;
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
      .delete(APIHelper.tests + this.id, {
        headers: {
          "Content-Type": "utf-8"
        }
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }

        const index = tests.data.findIndex((dataTest) => (dataTest.id = this.id));
        if (index !== -1) {
          tests.data.splice(index, 1);
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
}

export const tests = reactive({
  data: new Array<Test>(),
  async fillList(projectId?: number): Promise<true | string> {
    this.data = new Array<Test>();

    let result: string | true = errorMessageHelper.notImplemented;

    refreshAuth();

    if (projectId === undefined) {
      if (currentProject.id === null) return "No project selected.";
      projectId = currentProject.id;
    }

    await axios
      .get(`${APIHelper.projects}${projectId}/tests`)
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
              (data.happy_road === 1) as boolean,
              data.name as string | null,
              data.test_path as string | null,
              data.expected_result as string | null,
              data.tested_result as string | null,
              (data.succes !== null ? data.succes === 1 : null) as boolean | null
            );
            this.data.push(test);
          }

          result = true;
        } catch (error) {
          result = errorMessageHelper.notImplemented;
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
      .get(`${APIHelper.tests}id/`)
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

  async create(test: Test): Promise<string | true> {
    let result = errorMessageHelper.notImplemented as string | true;

    refreshAuth();

    await axios
      .post(APIHelper.tests, {
        id: test.id,
        project_id: test.project_id,
        happy_road: test.happyRoad ? 1 : 0,
        name: test.name,
        test_path: test.testPath,
        expected_result: test.expectedResult,
        tested_result: test.testedResult,
        succes: test.succes === null ? null : test.succes ? 1 : 0
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }
        this.data.push(test);
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
