import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type ApiRequestConfig<TData = unknown> = AxiosRequestConfig<TData>;

export type ApiResponse<TResponse> = Promise<TResponse>;

export type RequestParams = Record<string, string | number | boolean | undefined | null>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestConfig<TData = unknown> = {
  url: string;
  method?: HttpMethod;
  data?: TData;
  params?: RequestParams;
  config?: ApiRequestConfig<TData>;
};

export type ResponseInterceptor<T = unknown> = (response: AxiosResponse<T>) => AxiosResponse<T>;
