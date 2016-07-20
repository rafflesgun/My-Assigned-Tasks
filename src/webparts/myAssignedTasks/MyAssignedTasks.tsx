import * as React from 'react';

import styles from './MyAssignedTasks.module.scss';
import TaskItem from './components/TaskItem';

export interface IMyAssignedTasksProps {
  description: string;
}

export default class MyAssignedTasks extends React.Component<IMyAssignedTasksProps, {}> {

  public clickEvent() {
    console.log("This element has been clicked");
  }

  public render(): JSX.Element {
    return (
      <div className={styles.myAssignedTasks}>
        <TaskItem description={'This is the description'} clickEvent={this.clickEvent} />
        <div>This is the <b>{this.props.description}</b> webpart.</div>
      </div>
    );
  }
}
