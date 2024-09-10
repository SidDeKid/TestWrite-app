import { reactive } from "vue";
import axios from "axios";
import { APIHelper } from "@/helpers/APIHelper";
import { errorMessageHelper } from "@/helpers/errorMessageHelper";
import { auth } from "./auth";

const refreshAuth = () => {
  axios.defaults.headers.common = {
    Authorization: `Bearer ${auth.accessToken !== null ? auth.accessToken : ""}`,
    "Content-Type": "utf-8"
  };
};

refreshAuth();

export default class Property {
  private _id!: number;
  public get id(): number {
    return this._id;
  }
  private set id(v: number) {
    this._id = v;
  }

  private _modelClass_id!: number;
  public get modelClass_id(): number {
    return this._modelClass_id;
  }
  private set modelClass_id(v: number) {
    this._modelClass_id = v;
  }

  private _name!: string;
  public get name(): string {
    return this._name;
  }
  private set name(v: string) {
    this._name = v;
  }

  private _type!: string;
  public get type(): string {
    return this._type;
  }
  private set type(v: string) {
    this._type = v;
  }

  private _nullable!: boolean;
  public get nullable(): boolean {
    return this._nullable;
  }
  private set nullable(v: boolean) {
    this._nullable = v;
  }

  constructor(id: number, modelClass_id: number, name: string, type: string, nullable: boolean) {
    this.id = id;
    this.modelClass_id = modelClass_id;
    this.name = name;
    this.type = type;
    this.nullable = nullable;
  }
}

export const properties = reactive({
  async get(modelClassId: number): Promise<Array<Property> | string> {
    let result: Array<Property> | string = errorMessageHelper.notImplemented;

    refreshAuth();

    await axios
      .get(`${APIHelper.modelClasses}${modelClassId}/properties`)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }
        return response;
      })
      .then((response) => {
        try {
          result = new Array<Property>();

          for (const data of response.data) {
            const property = new Property(
              data.id as number,
              data.modelClass_id as number,
              data.name as string,
              data.type as string,
              (data.nullable === 1) as boolean
            );
            result.push(property);
          }
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
      .get(`${APIHelper.properties}id`)
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

  async create(property: Property): Promise<string | true> {
    let result = errorMessageHelper.notImplemented as string | true;

    refreshAuth();

    await axios
      .post(APIHelper.properties, {
        id: property.id,
        model_class_id: property.modelClass_id,
        name: property.name,
        type: property.type,
        nullable: property.nullable ? 1 : 0
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response));
        }
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
