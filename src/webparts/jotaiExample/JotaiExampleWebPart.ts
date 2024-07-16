import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'JotaiExampleWebPartStrings';
import { JotaiExample } from './components/JotaiExample';
import { IJotaiExampleProps } from './components/IJotaiExampleProps';
import { IDataProvider } from './Service/models/IDataProvider';
import { ICurrentUser } from './models/ICurrentUser';
import Service from './Service/Service';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEye, faPencil, faTrash, faPencilAlt, faTrashCan, faFileUpload, faTimes,
  faFolder, faList, faCog, faBars, faCaretDown,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
library.add(faEye, faPencil, faTrash, faTrashCan, faPencilAlt, faFolder, faTimes,
  faFileUpload, faList, faCog, faBars, faCaretDown, faArrowRight);

export interface IJotaiExampleWebPartProps {
  description: string;
}

export default class JotaiExampleWebPart extends BaseClientSideWebPart<IJotaiExampleWebPartProps> {

  private _provider: IDataProvider;
  private _currentUser: ICurrentUser;

  public render(): void {
    const element: React.ReactElement<IJotaiExampleProps> = React.createElement(
      JotaiExample,
      {
        description: this.properties.description,
        currentUser: this._currentUser,
        provider: this._provider,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._provider = new Service(this.context);
    this._currentUser = {
      displayName: this.context.pageContext.user.displayName,
      userId: this.context.pageContext.legacyPageContext.userId,
      email: this.context.pageContext.user.email,
      loginName: this.context.pageContext.user.loginName,
      isAdmin: this.context.pageContext.legacyPageContext?.isSiteAdmin,
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
