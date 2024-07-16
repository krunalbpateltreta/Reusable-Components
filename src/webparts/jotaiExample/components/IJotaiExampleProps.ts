import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ICurrentUser } from "../models/ICurrentUser";
import { IDataProvider } from "../Service/models/IDataProvider";

export interface IJotaiExampleProps {
  description: string;
  currentUser: ICurrentUser;
  provider: IDataProvider;
  context: WebPartContext;
}
