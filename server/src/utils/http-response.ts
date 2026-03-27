import { type Response as ExpressResponse } from "express";
import type { ApiResponse, Pagination } from "../types/index.js";

export const response = {
  /**
   * Success response WITH data
   */
  ok<T>(
    res: ExpressResponse,
    data: T,
    message = "Success",
    statusCode = 200,
    pagination?: Pagination,
  ) {
    const body: ApiResponse<T> = {
      success: true,
      message,
      data,
      ...(pagination && { pagination }),
    };

    return res.status(statusCode).json(body);
  },

  /**
   * Success response WITHOUT data
   */
  okMessage(
    res: ExpressResponse,
    message = "Success",
    statusCode = 200,
  ) {
    const body: ApiResponse = {
      success: true,
      message,
    };

    return res.status(statusCode).json(body);
  },

  /**
   * Error response
   */
  error(
    res: ExpressResponse,
    message:string,
    error: string,
    
    statusCode = 400,
  ) {
    const body: ApiResponse = {
      success: false,
      error,
      message
    };

    return res.status(statusCode).json(body);
  },
}