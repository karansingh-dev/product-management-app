import type { ApiResponse } from "@/types";
import axios, { type Method } from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    validateStatus: () => true,
});


export async function api<T>(
    method: Method,
    url: string,
    {
        data,
        params,
    }: {
        data?: Record<string, unknown> | FormData;
        params?: Record<string, unknown>;
    } = {},
): Promise<ApiResponse<T>> {
    try {
        const res = await axiosInstance.request<ApiResponse<T>>({
            method,
            url,
            data,
            params,
        });
        return res.data;
    } catch (err: unknown) {
        console.error(`Unexpected API error:`, err);
        throw err;
    }
}
