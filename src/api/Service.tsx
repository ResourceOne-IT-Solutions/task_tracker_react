import { BE_URL } from "../utils/Constants";

async function post<T, R>(path: string, data: T): Promise<R> {
  try {
    const response = await fetch(BE_URL + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.status > 399) {
      throw new Error(result.error);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function get<S>(path: string): Promise<S> {
  try {
    const response = await fetch(BE_URL + path);
    const result = await response.json();
    if (response.status > 399) {
      throw new Error(result.error);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function put<T, R>(url: string, data: T): Promise<R> {
  try {
    const response = await fetch(BE_URL + url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.status > 399) {
      throw new Error(result.error);
    }
    return result;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

async function deleteCall<T>(url: string): Promise<T> {
  try {
    const response = await fetch(BE_URL + url, {
      method: "DELETE",
    });
    const result = await response.json();
    if (response.status > 399) {
      throw new Error(result.error);
    }
    return result;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

const httpMethods = { post, put, deleteCall };
export default httpMethods;
