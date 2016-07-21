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
}

export interface ITaskItemProps {
  task: ITaskItem;
  actionEvent(type: String, e: Object): void;
}

export class TaskItem extends React.Component<ITaskItemProps, {}> {

  public render(): JSX.Element {
    var task: ITaskItem = this.props.task;

    return (
      <div className="ms-u-slideRightIn10">
        <div className={styles.TaskItem}>
          <div className={styles.ApprovalBox}>
            <a href="#"
              className={styles.RejectButton + ' ' + styles['rounded-button']}
              onClick={this.props.actionEvent.bind(null, 'reject')}
            >
              <i className="ms-Icon ms-Icon--x"></i>
            </a>
            <a href="#"
              className={styles.ApproveButton + ' ' + styles['rounded-button']}
              onClick={this.props.actionEvent.bind(null, 'approved')}
            >
              <i className={"ms-Icon ms-Icon--checkboxCheck " + styles['larger-icon']}></i>
            </a>
          </div>
          <div className={styles.DetailBox}>
            <div>
              <span className="ms-fontSize-l">{task.description}</span>
            </div>
            <div className={styles.DueDate}>
              <Label className={styles.AssignedByLabel}>Due: 27 May 2016</Label>
            </div>
            <div className={styles.AssignedBy}>
              <Label className={styles.AssignedByLabel}>Assigned by:</Label>
              <Image className={styles.AssignedImage} src="http://placehold.it/800x300" imageFit={ImageFit.cover} width={30} height={30} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
