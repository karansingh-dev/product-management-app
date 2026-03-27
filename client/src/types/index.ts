
export interface Pagination {
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;

}

type SuccessWithData<T> = {
  success: true;
  message: string;
  data: T;
  pagination?: Pagination;
};

type SuccessWithoutData = {
  success: true;
  message: string;
};

export type ApiResponse<T = null> =
  | SuccessWithData<T>
  | SuccessWithoutData
  | {
      success: false;
      error: string;
      message:string
    };