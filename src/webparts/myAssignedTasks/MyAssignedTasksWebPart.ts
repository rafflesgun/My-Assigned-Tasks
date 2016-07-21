import {
  DisplayMode,
  ODataBatch
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
  Author: any;
}

export default class MyAssignedTasksWebPart extends BaseClientSideWebPart<IMyAssignedTasksWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(mode: DisplayMode, data?: IWebPartData): void {

    const element: React.ReactElement<IMyAssignedTasksProps> = React.createElement(MyAssignedTasks, {
      description: this.properties.description,
      taskListName: this.properties.taskListName,
      fetchTasksAsync: this.fetchTasksAsync.bind(this),
      updateTaskAsync: this.updateTaskAsync.bind(this)
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

      var description: string = '';
      if (typeof (item.Body) === 'string') {
        description = item.Body.replace(/(<([^>]+)>)/ig, '').replace('&#160;', ' ');
      }

      return {
        name: item.Title,
        description: description,
        priority: parseInt(item.Priority),
        id: parseInt(item.Id),
        dueDate: item.DueDate ? new Date(item.DueDate) : null,
        authorTitle: item.Author.Title,
        authorEmail: item.Author.EMail,
        authorPicture: this._getPictureUrl(item.Author.EMail)
      };
    });

    return tasks;
  }

  private _getTaskData(): Promise<ITasks> {
    const select: string = `$select=*,Author/Id,Author/Title,Author/EMail,Editor/Id,Editor/Title,Editor/EMail`;
    return this.host.httpClient.get(this.host.pageContext.webAbsoluteUrl + `/_api/web/lists/GetByTitle('${this.properties.taskListName || 'Tasks'}')/items?$filter=(AssignedToId eq '${window["_spPageContextInfo"].userId || '0'}' and PercentComplete eq 0)&${select}&$expand=Author,Editor`)
      .then((response: Response) => {
        return response.json();
      });
  }

  private getItemTypeForListName(name: string): string {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.slice(1) + "ListItem";
  }

  public updateTaskAsync(taskId: Number, status: string, comment: string): Promise<Response> {
    const batch: ODataBatch = this.host.httpClient.beginBatch();

    const batchPromises: Promise<{}>[] = [
      this._updateItem(batch, taskId, status, comment)
    ];

    return batch.execute()
      .then(() => Promise.all(batchPromises).then(values => values[values.length - 1]));
  }

  private _updateItem(batch: ODataBatch, taskId: Number, status: string, comment: string): Promise<Response> {
    var listItemUri: string = `${this.host.pageContext.webAbsoluteUrl}/_api/web/lists/GetByTitle('${this.properties.taskListName || 'Tasks'}')/items('${taskId}')`;

    const headers: Headers = new Headers();
    headers.append('If-Match', '*');

    const body: {} = {
      '@data.type': this.getItemTypeForListName(this.properties.taskListName),
      'PercentComplete': 100,
      'Outcome': status,
      'Comment': comment
    };

    return batch.fetch(listItemUri, {
      body: JSON.stringify(body),
      headers,
      method: 'PATCH' // Use PATCH http method to perform update operation.
    }).then(this._checkStatus);
  }

  private _checkStatus(response: Response): Promise<Response> {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(JSON.stringify(response)));
    }
  }

  private _getPictureUrl(eMail: string): string {
    return `${this.host.pageContext.webAbsoluteUrl}/_layouts/15/userphoto.aspx?size=L&username=${eMail}`;
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
            DueDate: null,
            Author: {
              Title: "Admin",
              EMail: "admin@mail.com"
            }
          },
          {
            Title: 'Expenses Approval',
            Id: '2',
            Description: 'Expenses approval',
            Priority: 1,
            DueDate: new Date('2016-07-22T21:13:49Z'),
            Author: {
              Title: "Admin",
              EMail: "admin@mail.com"
            }
          },
          {
            Title: 'Deployment Request',
            Id: '3',
            Description: 'Deployment Request',
            Priority: 1,
            DueDate: new Date('2016-08-22T21:13:49Z'),
            Author: {
              Title: "Admin",
              EMail: "admin@mail.com"
            }
          },
          {
            Title: 'Drinks Order Approval',
            Id: '4',
            Description: 'Drinks Order Approval',
            Priority: 3,
            DueDate: new Date('2016-09-22T21:13:49Z'),
            Author: {
              Title: "Admin",
              EMail: "admin@mail.com"
            }
          },
          {
            Title: 'Invoice Approval',
            Id: '5',
            Description: 'Invoice Approval',
            Priority: 1,
            DueDate: new Date('2016-10-22T21:13:49Z'),
            Author: {
              Title: "Admin",
              EMail: "admin@mail.com"
            }
          },
          {
            Title: 'New Applicant',
            Id: '6',
            Description: 'New Applicant',
            Priority: 3,
            DueDate: new Date('2016-11-22T21:13:49Z'),
            Author: {
              Title: "Admin",
              EMail: "admin@mail.com"
            }
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
