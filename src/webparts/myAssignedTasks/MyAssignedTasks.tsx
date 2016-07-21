import * as React from 'react';
import {
  Pivot,
  PivotItem,
  Overlay,
  TextField,
  Button,
  ButtonType,
  SearchBox
} from 'office-ui-fabric-react';

import styles from './MyAssignedTasks.module.scss';
import { ITaskItem, TaskItem } from './components/TaskItem';

export interface IMyAssignedTasksProps {
  description: string;
  taskListName: string;
  fetchTasksAsync(): Promise<Array<ITaskItem>>;
}

export interface IMyAssignedTasksState {
  tasks: Array<ITaskItem>;
  overlayShowing?: Boolean;
  rejectingItem?: Number;
  searchTerm?: string;
}

export default class MyAssignedTasks extends React.Component<IMyAssignedTasksProps, IMyAssignedTasksState> {

  public refs: {
    [key: string]: (Element);
    rejectionReason: (HTMLInputElement);
  };

  constructor(props: IMyAssignedTasksProps) {
    super(props);

    this.state = {
      tasks: [],
      overlayShowing: false
    };
  }


  public componentWillMount(): void {
    var component: MyAssignedTasks = this;

    this.props.fetchTasksAsync()
      .then((tasks) => {
        component.setState({
          tasks: tasks
        });
      });
  }

  public approveEvent(id: Number, e: Object): void {
    const tasks: Array<ITaskItem> = this.state.tasks.filter((task: ITaskItem) => {
      return id !== task.id;
    });
    this.setState({ tasks: tasks });
  }

  public rejectEvent(id: Number, e: Object): void {
    this.setState({
      tasks: this.state.tasks,
      overlayShowing: true,
      rejectingItem: id
    });
  }


  private _getItems(sort: string): Array<ITaskItem> {
    var empty: Array<ITaskItem> = Array<ITaskItem>();
    var value: Array<ITaskItem> = Array<ITaskItem>();
    var tasks = this.state.tasks;

    if (this.state.searchTerm !== '' && this.state.searchTerm) {
      const re = new RegExp(this.state.searchTerm, "gi");
      tasks = tasks.filter((task: ITaskItem) => {
        return task.name.match(re) !== null;
      });
    }


    tasks.forEach((item) => {
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

  private _closeOverlay(e: Object): void {
    this.setState({
      tasks: this.state.tasks,
      overlayShowing: false,
      rejectingItem: null
    });
  }

  private _rejectItem(e: Object): void {
    var id: Number = this.state.rejectingItem;
    var removingItem: ITaskItem;
    var tasks: Array<ITaskItem> = this.state.tasks.filter((item: ITaskItem) => {
      if (item.id !== id) {
        removingItem = item;
        return true;
      }

      return false;
    });

    this.setState({
      tasks: tasks,
      rejectingItem: null,
      overlayShowing: false
    });
    console.log(this.refs.rejectionReason.value, removingItem);
  }

  private _search(e: string): void {
    this.setState({ tasks: this.state.tasks, searchTerm: e });
  }

  public render(): JSX.Element {

    const priority: Array<ITaskItem> = this._getItems('priority');
    const due: Array<ITaskItem> = this._getItems('dueDate');
    var priorityTasks: any = priority.map((task: ITaskItem, key: Number) => {
      return (
        <TaskItem
          task={task}
          key={task.id.toString() }
          approveEvent={this.approveEvent.bind(this) }
          rejectEvent={this.rejectEvent.bind(this)} />
      );
    });
    var dueTasks: any = due.map((task: ITaskItem, key: Number) => {
      return (
        <TaskItem
          task={task}
          key={task.id.toString() }
          approveEvent={this.approveEvent.bind(this) }
          rejectEvent={this.rejectEvent.bind(this)} />
      );
    });

    if (priorityTasks.length === 0) priorityTasks = <p>No items to display.</p>;
    if (dueTasks.length === 0) dueTasks = <p>No items to display.</p>;

    return (
      <div>
        <h3>My Assigned Tasks</h3>
        <div>
          <SearchBox onChanged={this._search.bind(this)} />
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
        { this.state.overlayShowing && (
          <Overlay isDarkThemed={true}>
            <div className='ms-OverlayBasicExample'>
              <div className={styles.innerOverlay}>
                <TextField label='Rejection reason' multiline ref="rejectionReason" />
                <Button onClick={this._rejectItem.bind(this)} buttonType={ ButtonType.primary }>Reject</Button>
                <Button onClick={this._closeOverlay.bind(this)}>Cancel</Button>
              </div>
            </div>
          </Overlay>
        )}

      </div>
    );
  }
}
