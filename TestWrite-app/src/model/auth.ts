import APIHelper from "@/helpers/APIHelper";
import { reactive } from "vue";
import axios from "axios";

export default class User {
  private _id: number | null = 1;
  public get id(): number | null {
    return this._id;
  }
  private set id(v: number | null) {
    this._id = v;
  }

  private _userName: string | null = null;
  public get userName(): string | null {
    return this._userName;
  }
  private set userName(v: string | null) {
    this._userName = v;
  }

  private _accesToken: string | null = null;
  public get accesToken(): string | null {
    return this._accesToken;
  }
  private set accesToken(v: string | null) {
    this._accesToken = v;
  }

  private _password: string | null = null;
  private get password(): string | null {
    return this._password;
  }
  private set password(v: string | null) {
    this._password = v;
  }

  private APIBase: string = new APIHelper().base;

  constructor() {}

  /**
   * Attempts to log in in to the API.
   * @returns Succes of the log in, true or false.
   */
  public async logIn(): Promise<string | true> {
    let result: true | string = "Inloggen is mislukt.";

    if (
      this.userName === null ||
      this.userName === "" ||
      this.password === null ||
      this.password === ""
    )
      return "Kan niet inloggen door missende gebruikersnaam of wachtwoord.";

    await axios
      .post(
        this.APIBase + "login/",
        JSON.stringify({
          username: this.userName,
          password: this.password
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(String(response.status));
        }
        return response;
      })
      .then((response) => {
        console.log(response.data);

        result = true;
      })
      .catch((response) => {
        console.error(response.request.status);

        switch (response.request.status) {
          case 0:
            result = "Inloggen is mislukt, omdat de API nog niet bestaat";
            break;

          default:
            result = "Inloggen is mislukt door een onbekende fout";
            break;
        }
      });

    return result;
  }

  /**
   * Attempts to log in in to the API.
   * @returns Succes of the log in, true or false.
   */
  public async logInWithData(userName: string, password: string) {
    this.userName = userName;
    this.password = password;

    return await this.logIn();
  }

  /**
   * Attempts to log out in to the API.
   * @returns Succes of the log out, true or false.
   */
  public async logOut() {
    return fetch(this.APIBase + "logout/", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (!response.ok) {
        return false;
      }

      this.id = null;
      this.accesToken = null;

      return true;
    });
  }
}

export const Auth = reactive(new User());
