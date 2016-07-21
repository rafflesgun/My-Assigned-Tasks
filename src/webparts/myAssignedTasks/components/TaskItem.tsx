import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Button,
  Image,
  IImageProps,
  ImageFit,
  Label
} from 'office-ui-fabric-react';

import styles from './TaskItem.module.scss';

export interface ITaskItem {
  name: string;
  description?: string;
}

export interface ITaskItemProps {
  task: ITaskItem;
  clickEvent(): void;
}

export class TaskItem extends React.Component<ITaskItemProps, {}> {

  public render(): JSX.Element {
    var task = this.props.task;

    return (
      <div>
        <div className={styles.TaskItem}>
          <div>
            <span className={styles['rounded-button']} onClick={this.props.clickEvent}>
              <i className="ms-Icon ms-Icon--x"></i>
            </span>
            <span className={styles['rounded-button']} onClick={this.props.clickEvent}>
              <i className={"ms-Icon ms-Icon--checkboxCheck " + styles['larger-icon']}></i>
            </span>
          </div>
          <div>
            <p className="ms-fontSize-mPlus">{task.description}</p>
          </div>
          <span className="text-right">
            Assigned by: <Image className={styles.AssignedImage} src="http://placehold.it/800x300" imageFit={ImageFit.cover} width={30} height={30} />
          </span>
        </div>
      </div>
    );
  }
}
