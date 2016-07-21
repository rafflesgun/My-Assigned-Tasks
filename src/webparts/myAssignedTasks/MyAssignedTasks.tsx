import {
  IWebPartHost,
  HostType
} from '@ms/sp-client-platform';

import * as React from 'react';
import {
  Pivot,
  PivotItem
} from 'office-ui-fabric-react';

import styles from './MyAssignedTasks.module.scss';
import MockHttpClient from './tests/MockHttpClient';
import { ITaskItems, ITaskItem, TaskItem } from './components/TaskItem';

export interface IMyAssignedTasksProps {
  description: string;
  host: IWebPartHost;
}

export interface IMyAssignedTasksState {
  tasks: Array<ITaskItem>;
}

export default class MyAssignedTasks extends React.Component<IMyAssignedTasksProps, IMyAssignedTasksState> {

  constructor(props: IMyAssignedTasksProps) {
    super(props);

    this.state = {
      tasks: []
    };
  }

  private componentWillMount() {
    this.mountTaskData();
  }

  public actionEvent(type: String, id: Number, e: Object): void {
    let tasks = this.state.tasks.filter((task) => {
      return id !== task.Id;
    });
    this.setState({ tasks: tasks });
  }

  private _getItems(sort: string): Array<ITaskItem> {
    var empty = Array<ITaskItem>();
    var value = Array<ITaskItem>();
    this.state.tasks.forEach((item) => {
      if (item[sort]) {
        value.push(item);
      } else {
        empty.push(item);
      }
    });
    // Get the current sort
    value.sort(function (a, b) {
      if (a[sort] > b[sort]) return 1;
      if (a[sort] < b[sort]) return -1;
      return 0;
    }.bind(this));

    return value.concat(empty).slice(0, 5);
  }

  private setSort(item?: PivotItem, ev?: React.MouseEvent): void {
    ev.preventDefault();
    const sort = item.props.linkText === 'Priority' ? 'priority' : 'dueDate';
    this.setState({
      tasks: this.state.tasks
    });
  }

  public render(): JSX.Element {

    let priority = this._getItems('priority');
    let due = this._getItems('dueDate');
    const priorityTasks:  Array<Object> = priority.map((task: ITaskItem, key: Number) => {
      return (
        <TaskItem task={task} key={task.Id.toString() } actionEvent={this.actionEvent.bind(this) } />
      );
    });
    const dueTasks: Array<Object> = due.map((task: ITaskItem, key: Number) => {
      return (
        <TaskItem task={task} key={task.Id.toString() } actionEvent={this.actionEvent.bind(this) } />
      );
    });

    return (
      <div>
        <h3>My Assigned Tasks</h3>
        <div>
          <Pivot>
            <PivotItem linkText='Priority' itemKey={0}>
              <div className={styles.myAssignedTasks}>
                <div className={styles.container}>
                  {priorityTasks}
                </div>
              </div>
            </PivotItem>
            <PivotItem linkText='Due Date' itemKey={1}>
              <div className={styles.myAssignedTasks}>
                <div className={styles.container}>
                  {dueTasks}
                </div>
              </div>
            </PivotItem>
          </Pivot>
        </div>

      </div>
    );
  }

  private mountTaskData(): void {
    // Test environment
    if (this.props.host.hostType === HostType.TestPage) {
      this.getMockTaskData().then((response) => {
        this.mountTaskItems(response.value);
      });

      // SharePoint environment
    } else if (this.props.host.hostType === HostType.ModernPage) {
      this.getTaskData()
        .then((response) => {
          this.mountTaskItems(response.value);
        });
    }
  }

  private mountTaskItems(items): void {
    var tasks: Array<ITaskItem> = items.map((item) => {
      if (typeof (item.Priority) === 'string') {
        item.Priority = item.Priority.replace(/[^\d]+/g, '');
      }

      item.Description = item.Body;

      return item;
    });

    this.setState({
      tasks: tasks
    });
  }

  private getTaskData(): Promise<ITaskItems> {
    return this.props.host.httpClient.get(this.props.host.pageContext.webAbsoluteUrl + `/_api/web/lists/GetByTitle('Tasks')/items?$filter=(AssignedToId eq '${window["_spPageContextInfo"].userId || 'Steve Molve'}' and PercentComplete eq 0)`)
      .then((response: Response) => {
        return response.json();
      });
  }

  private getMockTaskData(): Promise<ITaskItems> {
    return MockHttpClient.get(this.props.host.pageContext.webAbsoluteUrl).then(() => {
      const listData: ITaskItems = {
        value:
        [
          { Title: 'Leave Approval', Id: 1, Description: 'Leave approval between 1st August 2016 till 15 August 2016', Priority: 2, DueDate: null },
          { Title: 'Expenses Approval', Id: 2, Description: 'Expenses approval', Priority: 1, DueDate: new Date('2016-07-22T21:13:49Z') }
        ]
      };

      return listData;
    }) as Promise<ITaskItems>;
  }
}
