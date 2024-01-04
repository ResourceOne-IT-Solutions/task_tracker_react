import { BE_URL } from "../utils/Constants";

async function post<T>(path: string, data: T): Promise<Response> {
  try {
    const response = await fetch(BE_URL + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log('ok ')
    const result = await response.json();
    if (response.status > 399) {
      throw new Error(result.error);
    }
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export default { post };
