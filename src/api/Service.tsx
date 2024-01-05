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
const httpMethods = { post };
export default httpMethods;
