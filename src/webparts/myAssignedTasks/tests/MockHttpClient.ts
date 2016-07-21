import { ITaskItem } from '../components/TaskItem';

export default class MockHttpClient {

  private static _items: ITaskItem[] = [
    { name: 'Leave Approval', id: 1, description: 'Leave approval', priority: 2, dueDate: null },
    { name: 'Expenses Approval', id: 2, description: 'Expenses approval', priority: 2, dueDate: new Date('2016-07-22T21:13:49Z') }
  ];

  public static get(restUrl: string, options?: any): Promise<ITaskItem[]> {
    return new Promise<ITaskItem[]>((resolve) => {
      resolve(MockHttpClient._items);
    });
  }
}