
export interface Pagination {
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;

}


export type ApiResponse<T = null> =
  | {
      success: true;
      message: string;
      data: T;
      pagination?: Pagination;
    }
  | {
      success: false;
      error: string;
      message: string;
    };