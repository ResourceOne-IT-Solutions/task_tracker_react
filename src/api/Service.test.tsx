import httpMethods from "./Service";

describe("API service functions", () => {
  beforeEach(() => {
    // Clear any existing mocks before each test
    jest.clearAllMocks();
  });

  it("should make a POST request and return data", async () => {
    const postData = { name: "Naresh" };
    const responseData = { name: "Naresh Goud" };

    // Mock fetch function to return response data
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseData),
    });

    const response = await httpMethods.post("/path", postData);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/path"), {
      method: "POST",
      headers: expect.any(Object),
      body: JSON.stringify(postData),
    });
    expect(response).toEqual(responseData);
  });
  //   it('should make a POST request and return error', async () => {
  //     const postData = { name: 'Naresh' };
  //     const responseData = "Naresh Goud";

  //     // Mock fetch function to return response data
  //     global.fetch = jest.fn().mockResolvedValue({
  //       ok: true,
  //       json: () => Promise.reject(responseData),
  //     });

  //     const response = await httpMethods.post('/get-user', postData);

  //     expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/get-user'), {
  //       method: 'POST',
  //       headers: expect.any(Object),
  //       body: JSON.stringify(postData),
  //     });
  //     console.log('RES::', response)
  //     expect(response).toEqual(responseData);
  //   });

  // Write similar tests for other API service functions (get, put, deleteCall)
});
