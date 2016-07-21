import * as React from 'react';
import {
  Image,
  ImageFit,
  Label
} from 'office-ui-fabric-react';

import styles from './TaskItem.module.scss';

export interface ITaskItem {
  name: string;
  description?: string;
  priority: Number;
  dueDate: Date;
  id: Number;
}

export interface ITaskItemState {
  fadeAway?: String;
}

export interface ITaskItemProps {
  task: ITaskItem;
  approveEvent(id: Number, e: Object): void;
  rejectEvent(id: Number, e: Object): void;
  key: String;
}

export class TaskItem extends React.Component<ITaskItemProps, ITaskItemState> {

  constructor() {
    super();

    this.state = {
      fadeAway: ''
    };
  }

  private _approveHandler(e: Object): void {
    this.setState({ fadeAway: 'ms-u-scaleUpOut103' });
    setTimeout(() => {
      this.props.approveEvent(this.props.task.id, e);
    }, 300);
  }

  private _rejecthandler(e: Object): void {
    this.props.rejectEvent(this.props.task.id, e);
  }

  private _getPriorityClass(type: string, priority: Number): string {
    if (type === 'icon') {
      switch (priority) {
        case 1:
          return 'ms-Icon--alert';
        case 2:
          return 'ms-Icon--note';
        default:
          return 'ms-Icon--today';
      }
    } else {
      switch (priority) {
        case 1:
          return styles.high;
        case 2:
          return styles.normal;
        default:
          return styles.low;
      }
    }
  }

  public render(): JSX.Element {
    const task: ITaskItem = this.props.task;
    const date: any = task.dueDate
      ? (
        <div className={styles.DueDate}>
          <Label className={styles.AssignedByLabel}>{ "Due: " + task.dueDate.getDate() + "/" + task.dueDate.getMonth() + "/" + task.dueDate.getFullYear()}</Label>
        </div>
      ) : <div></div>;

    return (
      <div className={this.state.fadeAway}>
        <div className={styles.TaskItem + " " + this._getPriorityClass('class', task.priority)}>
          <div className={styles.ApprovalBox}>
            <a href="#"
              className={styles.RejectButton + ' ' + styles['rounded-button']}
              onClick={this._rejecthandler.bind(this, 'reject') }
              >
              <i className="ms-Icon ms-Icon--x"></i>
            </a>
            <a href="#"
              className={styles.ApproveButton + ' ' + styles['rounded-button']}
              onClick={this._approveHandler.bind(this, 'approved') }
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
            <div className={styles.PriorityIcon + " " + this._getPriorityClass('class', task.priority)}>
              <span className={"ms-Icon " + this._getPriorityClass('icon', task.priority)}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
