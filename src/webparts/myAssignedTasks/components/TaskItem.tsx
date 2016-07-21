import * as React from 'react';
import {
  Image,
  ImageFit,
  Label
} from 'office-ui-fabric-react';

import styles from './TaskItem.module.scss';

export interface ITaskItems {
  value: ITaskItem[];
}

export interface ITaskItem {
  name: string;
  description?: string;
  priority: Number;
  dueDate: Date;
  id: Number;
}

export interface ITaskItemState {
  fadeAway?: String
}

export interface ITaskItemProps {
  task: ITaskItem;
  actionEvent(type: String, id: Number, e: Object): void;
  key: String;
}

export class TaskItem extends React.Component<ITaskItemProps, ITaskItemState> {

  constructor() {
    super();

    this.state = {
      fadeAway: ''
    };
  }

  clickHandler(type: string, e: Object) {
    this.setState({ fadeAway: 'ms-u-scaleUpOut103' });
    setTimeout(() => {
      this.props.actionEvent(type, this.props.task.id, e);
    }, 300);
  }

  public render(): JSX.Element {
    const task: ITaskItem = this.props.task;
    const dateString = task.dueDate ? task.dueDate.toDateString() : '';
    const date = task.dueDate
      ? (
        <div className={styles.DueDate}>
          <Label className={styles.AssignedByLabel}>{`${dateString}`}</Label>
        </div>
      ) : <div></div>;

    return (
      <div className={this.state.fadeAway}>
        <div className={styles.TaskItem}>
          <div className={styles.ApprovalBox}>
            <a href="#"
              className={styles.RejectButton + ' ' + styles['rounded-button']}
              onClick={this.clickHandler.bind(this, 'reject') }
              >
              <i className="ms-Icon ms-Icon--x"></i>
            </a>
            <a href="#"
              className={styles.ApproveButton + ' ' + styles['rounded-button']}
              onClick={this.clickHandler.bind(this, 'approved') }
              >
              <i className={"ms-Icon ms-Icon--checkboxCheck " + styles['larger-icon']}></i>
            </a>
          </div>
          <div className={styles.DetailBox}>
            <div>
              <span className="ms-fontSize-l">{task.name}</span><br />
              <span className="ms-fontSize-sPlus">{task.description}</span>
            </div>
            {date}
            <div className={styles.AssignedBy}>
              <Label className={styles.AssignedByLabel}>Assigned by: </Label>
              <Image className={styles.AssignedImage} src="http://placehold.it/800x300" imageFit={ImageFit.cover} width={30} height={30} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
