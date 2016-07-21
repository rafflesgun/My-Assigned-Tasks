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
  taskListName: string;
  fetchTasksAsync(): Promise<Array<ITaskItem>>
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


  public componentWillMount(): void {
    var component = this;

    this.props.fetchTasksAsync()
      .then((tasks) => {
        component.setState({
          tasks: tasks
        });
      });
  }

  public actionEvent(type: String, id: Number, e: Object): void {
    let tasks = this.state.tasks.filter((task) => {
      return id !== task.id;
    });
    this.setState({ tasks: tasks });
  }

  private _getItems(sort: string): Array<ITaskItem> {
    var empty: Array<ITaskItem> = Array<ITaskItem>();
    var value: Array<ITaskItem> = Array<ITaskItem>();
    this.state.tasks.forEach((item) => {
      if (item[sort]) {
        value.push(item);
      } else {
        empty.push(item);
      }
    });
    // Get the current sort
    value.sort((a, b) => {
      if (a[sort] > b[sort]) return 1;
      if (a[sort] < b[sort]) return -1;
      return 0;
    });

    return value.concat(empty).slice(0, 5);
  }

  public render(): JSX.Element {

    let priority: Array<ITaskItem> = this._getItems('Priority');
    let due: Array<ITaskItem> = this._getItems('DueDate');
    const priorityTasks:  Array<Object> = priority.map((task: ITaskItem, key: Number) => {
      return (
        <TaskItem task={task} key={task.id.toString() } actionEvent={this.actionEvent.bind(this) } />
      );
    });
    const dueTasks: Array<Object> = due.map((task: ITaskItem, key: Number) => {
      return (
        <TaskItem task={task} key={task.id.toString() } actionEvent={this.actionEvent.bind(this) } />
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
}
