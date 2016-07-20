import * as React from 'react';

export interface ITaskItem {
  description: string;
}

export default class MyAssignedTasks extends React.Component<ITaskItem, {}> {
  public render(): JSX.Element {
    return (
      <div>
        <div>This is the <b>{this.props.description}</b> webpart.</div>
      </div>
    );
  }
}
