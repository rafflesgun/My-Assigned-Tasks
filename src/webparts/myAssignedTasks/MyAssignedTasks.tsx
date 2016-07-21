import * as React from 'react';

import styles from './MyAssignedTasks.module.scss';
import { ITaskItem, TaskItem } from './components/TaskItem';

export interface IMyAssignedTasksProps {
  description: string;
}

export interface IMyAssignedTasksState {
  tasks: Array<ITaskItem>
}

export default class MyAssignedTasks extends React.Component<IMyAssignedTasksProps, IMyAssignedTasksState> {

  constructor(props: IMyAssignedTasksProps) {
    super(props);

    this.state = {
      tasks: []
    };
  }

  private componentWillMount() {
    // Get data here
    console.log('mounted');
    let tasks = [
      {
        name: "First task",
        description: "This has some content"
      },
      {
        name: "Second task",
        description: "This is what you need to do"
      },
      {
        name: "Third task",
        description: "This is some other content"
      }
    ];

    this.setState({
      tasks: tasks
    });
  }

  public clickEvent() {
    console.log("This element has been clicked");
  }

  public render(): JSX.Element {

    var tasks = this.state.tasks.map((task, key) => {
      return (
        <TaskItem task={task} key={key} clickEvent={this.clickEvent} />
      );
    });

    return (
      <div className={styles.myAssignedTasks}>
        <div className={styles.container}>
          {tasks}
        </div>
      </div>
    );
  }
}
