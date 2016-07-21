import {
  DisplayMode
} from '@ms/sp-client-base';

import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  IWebPartData,
  PropertyPaneTextField,
  HostType
} from '@ms/sp-client-platform';

import * as React from 'react';
import * as ReactDom from 'react-dom';

import strings from './loc/Strings.resx';
import MyAssignedTasks, { IMyAssignedTasksProps } from './MyAssignedTasks';
import MockHttpClient from './tests/MockHttpClient';

export interface IMyAssignedTasksWebPartProps {
  description: string;
}

export interface ITasks {
  value: ITask[];
}

export interface ITask {
  Title: string;
  Description: string;
  Id: string;
  DueDate: Date;
  Priority: Number;
}

export default class MyAssignedTasksWebPart extends BaseClientSideWebPart<IMyAssignedTasksWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(mode: DisplayMode, data?: IWebPartData): void {
    const element: React.ReactElement<IMyAssignedTasksProps> = React.createElement(MyAssignedTasks, {
      description: this.properties.description
    });

    ReactDom.render(element, this.domElement);
    this._renderTasksAsync();
  }

  private _renderTasksAsync(): void {
    // Test environment
    if (this.host.hostType === HostType.TestPage) {
      this._getMockTaskData().then((response) => {
        this._renderList(response.value);
      });

      // SharePoint environment
    } else if (this.host.hostType === HostType.ModernPage) {
      this._getTaskData()
        .then((response) => {
          this._renderList(response.value);
        });
    }
  }

  private _renderList(items):  void {
    var tasks: Array<ITask> = items.map((item) => {
      if (typeof(item.Priority) === 'string') {
          item.Priority = item.Priority.replace(/[^\d]+/g, '');
      }

      return item;
    });

    let html: string = '';
    items.forEach((item: ITask) => {
      html += `
        <div>
            <div>
                <span>${item.Title}</span>
                <span> ${item.Priority} </span>
            </div>
        </div>`;
    });

    this.domElement.innerHTML += html;
  }

  private _getTaskData(): Promise<ITasks> {
    return this.host.httpClient.get(this.host.pageContext.webAbsoluteUrl + `/_api/web/lists/GetByTitle('Tasks')/items?$filter=(AssignedToId eq '${window["_spPageContextInfo"].userId || 'Steve Molve'}' and PercentComplete eq 0)`)
      .then((response: Response) => {
        return response.json();
      });
  }

  private _getMockTaskData(): Promise<ITasks> {
    return MockHttpClient.get(this.host.pageContext.webAbsoluteUrl).then(() => {
      const listData: ITasks = {
        value:
        [
          { Title: 'Leave Approval', Id: '1', Description: 'Leave approval between 1st August 2016 till 15 August 2016', Priority: 2, DueDate: null },
          { Title: 'Expenses Approval', Id: '2', Description: 'Expenses approval', Priority: 1, DueDate: new Date('2016-07-22T21:13:49Z') }
        ]
      };

      return listData;
    }) as Promise<ITasks>;
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
