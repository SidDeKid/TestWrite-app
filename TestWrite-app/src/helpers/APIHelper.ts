export default class APIHelper {
  private _base: string = "http://testwrite-app.nl/api/";
  public get base(): string {
    return this._base;
  }
  public get projects(): string {
    return this._base + "projects/";
  }
  public get tests(): string {
    return this._base + "tests/";
  }
  public get modelClasses(): string {
    return this._base + "model-classes/";
  }
  public get properties(): string {
    return this._base + "properties/";
  }

  constructor() {}
}
