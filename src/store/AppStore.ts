// import { RouterStore } from 'mobx-react-router';
// import { autorun } from "mobx";
// import { DataModelStore } from "./DataModalStore";

export class AppStore {
  static instance: AppStore;
  //   public apiServices: ApiServices;

  constructor() {
    AppStore.instance = this;
  }
}
