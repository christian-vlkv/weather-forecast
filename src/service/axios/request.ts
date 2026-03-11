import axios from 'axios';
import { axiosClient } from './client';
import { ApiRequestConfig, ApiResponse, RequestConfig, RequestParams } from './types';

const mergeConfig = <TData = unknown>(
  config?: ApiRequestConfig<TData>,
): ApiRequestConfig<TData> => {
  return {
    ...config,
    headers: {
      ...(config?.headers || {}),
    },
  };
};

const request = async <TResponse = unknown, TData = unknown>({
  url,
  method = 'GET',
  data,
  params,
  config,
}: RequestConfig<TData>): ApiResponse<TResponse> => {
  const response = await axiosClient.request<TResponse, { data: TResponse }, TData>({
    url,
    method,
    data,
    params,
    ...mergeConfig(config),
  });

  return response.data;
};

export const axiosRequest = {
  get: <TResponse = unknown>(
    url: string,
    params?: RequestParams,
    config?: ApiRequestConfig,
  ): ApiResponse<TResponse> => {
    return request<TResponse>({
      url,
      method: 'GET',
      params,
      config,
    });
  },

  post: <TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: ApiRequestConfig<TData>,
  ): ApiResponse<TResponse> => {
    return request<TResponse, TData>({
      url,
      method: 'POST',
      data,
      config,
    });
  },

  put: <TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: ApiRequestConfig<TData>,
  ): ApiResponse<TResponse> => {
    return request<TResponse, TData>({
      url,
      method: 'PUT',
      data,
      config,
    });
  },

  patch: <TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config?: ApiRequestConfig<TData>,
  ): ApiResponse<TResponse> => {
    return request<TResponse, TData>({
      url,
      method: 'PATCH',
      data,
      config,
    });
  },

  delete: <TResponse = unknown>(
    url: string,
    params?: RequestParams,
    config?: ApiRequestConfig,
  ): ApiResponse<TResponse> => {
    return request<TResponse>({
      url,
      method: 'DELETE',
      params,
      config,
    });
  },
};

export const isApiError = axios.isAxiosError;

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      typeof error.response?.data === 'object' &&
      error.response?.data &&
      'message' in error.response.data
        ? String(error.response.data.message)
        : null;

    return responseMessage || error.message || 'Something went wrong';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};
