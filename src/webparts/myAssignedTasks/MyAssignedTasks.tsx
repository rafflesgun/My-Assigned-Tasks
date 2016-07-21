import * as React from 'react';

import styles from './MyAssignedTasks.module.scss';
import { ITaskItem, TaskItem } from './components/TaskItem';
import {
  Pivot,
  PivotItem
} from 'office-ui-fabric-react';

export interface IMyAssignedTasksProps {
  description: string;
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
    // Get data here
    const tasks: Array<ITaskItem> = [
      {
        id: 0,
        name: "First task",
        description: "This has some content",
        priority: 1
      },
      {
        id: 1,
        name: "Second task",
        description: "This is what you need to do This is what you need to do this is some more data that you might want to see. Thi si the basically the best thing that we can get out of this. This is what you need to do this is some more data that you might want to see. Thi si the basically the best thing that we can get out of this.",
        priority: 3
      },
      {
        id: 2,
        name: "Third task",
        description: "This is some other content",
        priority: 2
      }
    ];

    this.props.fetchTasksAsync()
      .then((tasks) => {
        this.setState({
          tasks: tasks
        });
      });
  }

  public actionEvent(type: String, id: Number, e: Object): void {
    let tasks = this.state.tasks.filter((task) => {
      return id !== task.id;
    });
    console.log(tasks);
    this.setState({ tasks: tasks });
    console.log("This element has been clicked " + type);
  }

  public render(): JSX.Element {

    const tasks: Array<Object> = this.state.tasks.map((task: ITaskItem, key: Number) => {
      return (
        <TaskItem task={task} key={task.id.toString()} actionEvent={this.actionEvent.bind(this)} />
      );
    });

    return (
      <div>
        <h3>My Assigned Tasks</h3>
        <div>
          <Pivot>
            <PivotItem linkText='Priority'>
            </PivotItem>
            <PivotItem linkText='Due Date'>
            </PivotItem>
          </Pivot>
        </div>
        <div className={styles.myAssignedTasks}>
          <div className={styles.container}>
            {tasks}
          </div>
        </div>
      </div>
    );
  }
}
