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
      tasks: [
        {
          name: "First task"
        },
        {
          name: "Second task"
        },
        {
          name: "Third task"
        }
      ]
    };
  }

  public clickEvent() {
    console.log("This element has been clicked");
  }

  public render(): JSX.Element {

    var tasks = this.state.tasks.map(element => {
      return (
        <TaskItem description={'This is the description'} clickEvent={this.clickEvent} />
      );
    });

    return (
      <div className={styles.myAssignedTasks}>
        {tasks}
      </div>
    );
  }
}
