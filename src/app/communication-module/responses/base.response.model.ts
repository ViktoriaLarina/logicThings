export class BaseResponseModel<T> {
  code: number;
  message: string;
  data: T;
}

export class NodeResponseModel<T> {
  operation_status: number;
  message?: string;
  nodes: T;
}
