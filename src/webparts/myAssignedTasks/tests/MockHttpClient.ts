import { ITask } from '../MyAssignedTasksWebPart';

export default class MockHttpClient {

  private static _items: ITask[] = [
    { Title: 'Leave Approval', Id: '1', Description: 'Leave approval', Priority: 2, DueDate: null },
    { Title: 'Expenses Approval', Id: '2', Description: 'Expenses approval', Priority: 2, DueDate: new Date('2016-07-22T21:13:49Z') }
  ];

  public static get(restUrl: string, options?: any): Promise<ITask[]> {
    return new Promise<ITask[]>((resolve) => {
      resolve(MockHttpClient._items);
    });
  }
}