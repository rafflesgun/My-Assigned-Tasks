import * as React from 'react';

import styles from './MyAssignedTasks.module.scss';

export interface IMyAssignedTasksProps {
  description: string;
}

export default class MyAssignedTasks extends React.Component<IMyAssignedTasksProps, {}> {
  public render(): JSX.Element {
    return (
      <div className={styles.myAssignedTasks}>
        <div>This is the <b>{this.props.description}</b> webpart.</div>
      </div>
    );
  }
}
