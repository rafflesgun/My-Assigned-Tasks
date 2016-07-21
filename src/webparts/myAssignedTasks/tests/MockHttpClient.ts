import { ITaskItem } from '../components/TaskItem';

export default class MockHttpClient {

  private static _items: ITaskItem[] = [
    { Title: 'Leave Approval', Id: '1', Description: 'Leave approval', Priority: 2, DueDate: null },
    { Title: 'Expenses Approval', Id: '2', Description: 'Expenses approval', Priority: 2, DueDate: new Date('2016-07-22T21:13:49Z') }
  ];

  public static get(restUrl: string, options?: any): Promise<ITaskItem[]> {
    return new Promise<ITaskItem[]>((resolve) => {
      resolve(MockHttpClient._items);
    });
  }
}