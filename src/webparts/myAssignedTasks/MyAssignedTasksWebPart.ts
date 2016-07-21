import {
  DisplayMode
} from '@ms/sp-client-base';

import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  IWebPartData,
  PropertyPaneTextField
} from '@ms/sp-client-platform';

import * as React from 'react';
import * as ReactDom from 'react-dom';

import strings from './loc/Strings.resx';
import MyAssignedTasks, { IMyAssignedTasksProps } from './MyAssignedTasks';

export interface IMyAssignedTasksWebPartProps {
  description: string;
}

export default class MyAssignedTasksWebPart extends BaseClientSideWebPart<IMyAssignedTasksWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(mode: DisplayMode, data?: IWebPartData): void {

    const element: React.ReactElement<IMyAssignedTasksProps> = React.createElement(MyAssignedTasks, {
      description: this.properties.description,
      host: this.host
    });

    ReactDom.render(element, this.domElement);
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
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
