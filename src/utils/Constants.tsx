import { cookieComp } from "./utils";

const BE_SERVER = "https://task-tracker-server-2njm.onrender.com";
const BE_LOCAL = "http://192.168.10.30:1234";
const BE_LOCAL2 = "http://192.168.29.110:1234";
export const BE_URL = BE_LOCAL;
export const TOKEN = () => cookieComp();
