import { Datainterface } from "../pages/loginpage/Login";


const post = async ( url:string, data:Datainterface) => {
  const apiResponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const apiData = apiResponse.json(); 
  return apiData;
};
export {post}
