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
import { ITaskItem } from './components/TaskItem';

export interface IMyAssignedTasksWebPartProps {
  description: string;
  taskListName: string;
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
      description: this.properties.description,
      taskListName: this.properties.taskListName,
      fetchTasksAsync: this.fetchTasksAsync.bind(this)
    });

    ReactDom.render(element, this.domElement);
  }
  public fetchTasksAsync(): Promise<Array<ITaskItem>> {
    // Test environment
    if (this.host.hostType === HostType.TestPage) {
      return this._getMockTaskData()
        .then((response) => {
          return this._parseData(response.value);
        });

      // SharePoint environment
    } else if (this.host.hostType === HostType.ModernPage) {
      return this._getTaskData()
        .then((response) => {
          return this._parseData(response.value);
        });
    }
  }

  private _parseData(items: Array<any>): Array<ITaskItem> {
    var tasks: Array<ITaskItem> = items.map((item) => {
      if (typeof (item.Priority) === 'string') {
        item.Priority = item.Priority.replace(/[^\d]+/g, '');
      }

      return {
        name: item.Title,
        description: item.Body,
        priority: item.Priority,
        id: parseInt(item.Id),
        dueDate: item.DueDate ? new Date(item.DueDate) : null
      };
    });

    return tasks;
  }

  private _getTaskData(): Promise<ITasks> {
    return this.host.httpClient.get(this.host.pageContext.webAbsoluteUrl + `/_api/web/lists/GetByTitle('${this.properties.taskListName || 'Tasks'}')/items?$filter=(AssignedToId eq '${window["_spPageContextInfo"].userId || '0'}' and PercentComplete eq 0)`)
      .then((response: Response) => {
        return response.json();
      });
  }

  private _getMockTaskData(): Promise<ITasks> {
    return MockHttpClient.get(this.host.pageContext.webAbsoluteUrl).then(() => {
      const listData: ITasks = {
        value:
        [
          {
            Title: 'Leave Approval',
            Id: '1',
            Description: 'Leave approval between 1st August 2016 till 15 August 2016',
            Priority: 2,
            DueDate: null
          },
          {
            Title: 'Expenses Approval',
            Id: '2',
            Description: 'Expenses approval',
            Priority: 1,
            DueDate: new Date('2016-07-22T21:13:49Z')
          },
          {
            Title: 'Deployment Request',
            Id: '3',
            Description: 'Deployment Request',
            Priority: 1,
            DueDate: new Date('2016-08-22T21:13:49Z')
          },
          {
            Title: 'Drinks Order Approval',
            Id: '4',
            Description: 'Drinks Order Approval',
            Priority: 3,
            DueDate: new Date('2016-09-22T21:13:49Z')
          },
          {
            Title: 'Invoice Approval',
            Id: '5',
            Description: 'Invoice Approval',
            Priority: 1,
            DueDate: new Date('2016-10-22T21:13:49Z')
          },
          {
            Title: 'New Applicant',
            Id: '6',
            Description: 'New Applicant',
            Priority: 3,
            DueDate: new Date('2016-11-22T21:13:49Z')
          }
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
                }),
                PropertyPaneTextField('taskListName', {
                  label: strings.TaskListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
