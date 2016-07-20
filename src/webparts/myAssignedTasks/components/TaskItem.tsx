import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button } from 'office-ui-fabric-react/lib/Button';

export interface ITaskItem {
  name: string;
}

export interface ITaskItemProps {
  description: string;
  clickEvent(): void
}

export class TaskItem extends React.Component<ITaskItemProps, {}> {

  public render(): JSX.Element {
    return (
      <div>
        {this.props.description}
        <div>
          <Button onClick={this.props.clickEvent}>Approve</Button>
          <Button onClick={this.props.clickEvent}>Reject</Button>
        </div>
      </div>
    );
  }
}
