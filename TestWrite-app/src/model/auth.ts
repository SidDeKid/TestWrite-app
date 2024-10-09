import { APIHelper } from "@/helpers/APIHelper";
import { reactive } from "vue";
import axios from "axios";
import { errorMessageHelper } from "@/helpers/errorMessageHelper";

export default class User {
  private _id: number | null = null;
  public get id(): number | null {
    return this._id;
  }
  private set id(v: number | null) {
    this._id = v;
  }

  private _name: string | null = null;
  public get name(): string | null {
    return this._name;
  }
  private set name(v: string | null) {
    this._name = v;
  }

  private _roleId: number | null = null;
  public get roleId(): number | null {
    return this._roleId;
  }
  private set roleId(v: number | null) {
    this._roleId = v;
  }

  private _accessToken: string | null = null;
  public get accessToken(): string | null {
    return this._accessToken;
  }
  private set accessToken(v: string | null) {
    this._accessToken = v;
  }

  private _email: string | null = "sid_1@gmail.com";
  public get email(): string | null {
    return this._email;
  }
  private set email(v: string | null) {
    this._email = v;
  }

  private _password: string | null = null;
  private get password(): string | null {
    return this._password;
  }
  private set password(v: string | null) {
    this._password = v;
  }

  constructor() {}

  /**
   * Attempts to log in in to the API.
   * @returns Succes of the log in, true or false.
   */
  public async logIn(): Promise<string | true> {
    let result: true | string = "Inloggen is mislukt.";

    if (this.email === null || this.email === "" || this.password === null || this.password === "")
      return "Kan niet inloggen door missende gebruikersnaam of wachtwoord.";

    await axios
      .post(
        APIHelper.base + "login/",
        JSON.stringify({
          email: this.email,
          password: this.password
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then((response) => {
        if (response.status != 200) {
          throw new Error(String(response.status));
        }

        this.id = response.data.user.id as number;
        this.name = response.data.user.user_name as string;
        this.roleId = response.data.user.role_id as number;
        this.accessToken = response.data.access_token as string;

        result = true;
      })
      .catch((response) => {
        console.error(response);

        switch (response.response !== undefined ? response.response.status : null) {
          case "401":
            result = errorMessageHelper.wrongLoginData;
            break;
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

  /**
   * Attempts to log in in to the API.
   * @returns Succes of the log in, true or false.
   */
  public async logInWithPassword(password: string | null) {
    this.password = password;

    return await this.logIn();
  }

  /**
   * Attempts to log out in to the API.
   * @returns Succes of the log out, true or false.
   */
  public async logOut() {
    let result: true | string = "Inloggen is mislukt.";

    await axios
      .post(
        APIHelper.base + "logout/",
        "",
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then((response) => {
        if (response.status != 200) {
          throw new Error(String(response.status));
        }

        this.id = null;
        this.name = null;
        this.roleId = null;
        this.accessToken = null;
        this.email = null;
        this.password = null;
  
        result = true;
      })
      .catch((response) => {
        console.error(response);

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
}

export const auth = reactive(new User());
