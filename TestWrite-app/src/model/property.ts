import APIHelper from "@/helpers/APIHelper";
import { reactive } from "vue";
import axios from "axios";

export default class Property {
  private _id!: number;
  public get id(): number {
    return this._id;
  }
  private set id(v: number) {
    this._id = v;
  }

  private _class_id!: number;
  public get class_id(): number {
    return this._class_id;
  }
  private set class_id(v: number) {
    this._class_id = v;
  }

  private _name: string | null = null;
  public get name(): string | null {
    return this._name;
  }
  private set name(v: string | null) {
    this._name = v;
  }

  private _type: string | null = null;
  public get type(): string | null {
    return this._type;
  }
  private set type(v: string | null) {
    this._type = v;
  }

  private _nullable: boolean | null = null;
  public get nullable(): boolean | null {
    return this._nullable;
  }
  private set nullable(v: boolean | null) {
    this._nullable = v;
  }

  private APIBase: string = new APIHelper().properties;

  constructor(
    id: number,
    class_id: number,
    name?: string | null,
    type?: string | null,
    nullable?: boolean | null
  ) {
    this.id = id;
    this.class_id = class_id;
    if (name !== undefined) this.name = name;
    if (type !== undefined) this.type = type;
    if (nullable !== undefined) this.nullable = nullable;
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
          this.class_id = response.data.class_id as number;
          this.name = response.data.name as string | null;
          this.type = response.data.type as string | null;
          this.nullable = response.data.nullable as boolean | null;

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

export const properties = reactive({
  data: new Array<Property>(),
  async fillList(): Promise<true | string> {
    this.data = new Array<Property>();

    let result: string | true = "Failed due to missing implimentation.";

    await axios
      .get(new APIHelper().properties, {
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
            const property = new Property(
              data.id as number,
              data.class_id as number,
              data.name as string | null,
              data.type as string | null,
              data.nullable as boolean | null
            );
            this.data.push(property);
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
