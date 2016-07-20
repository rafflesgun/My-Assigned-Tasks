import * as React from 'react';

export interface ITaskItem {
  description: string;
  clickEvent(): void;
}

export default class MyAssignedTasks extends React.Component<ITaskItem, {}> {



  public render(): JSX.Element {
    return (
      <div onClick={this.props.clickEvent}>
        {this.props.description}
      </div>
    );
  }
}
