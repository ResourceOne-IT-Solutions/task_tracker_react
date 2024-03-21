import { BE_URL } from "../utils/Constants";
import { fetchWithAccessToken } from "./api";

async function login<T, R>(path: string, data: T): Promise<R> {
  try {
    const headers = {
      "Content-Type": "application/json",
    } as any;
    const response = await fetch(BE_URL + path, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
async function post<T, R>(path: string, data: T, isFile = false): Promise<R> {
  try {
    const headers = {} as any;
    if (!isFile) {
      headers["Content-Type"] = "application/json";
    }
    const response = await fetchWithAccessToken(BE_URL + path, {
      method: "POST",
      headers: headers,
      body: isFile ? (data as FormData) : JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function get<S>(path: string): Promise<S> {
  try {
    const response = await fetchWithAccessToken(BE_URL + path, {});
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function put<T, R>(url: string, data: T, isFile = false): Promise<R> {
  try {
    const headers = {} as any;
    if (!isFile) {
      headers["Content-Type"] = "application/json";
    }
    const response = await fetchWithAccessToken(BE_URL + url, {
      method: "PUT",
      headers,
      body: isFile ? (data as FormData) : JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    return result;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

async function deleteCall<T>(url: string): Promise<T> {
  try {
    const response = await fetchWithAccessToken(BE_URL + url, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error);
    }
    return result;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

const httpMethods = { post, put, deleteCall, get, login };
export default httpMethods;
