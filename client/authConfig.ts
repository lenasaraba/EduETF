import { Configuration } from "@azure/msal-browser";
 
export const msalConfig: Configuration = {
  auth: {
    clientId: "90c91def-dd06-40e5-9599-dda2e663c494",         
    authority: "https://login.microsoftonline.com/05a9f20c-f437-4a35-8448-3827e15dd882", 
    redirectUri: "http://localhost:5173", 
  },
  cache: {
    cacheLocation: "sessionStorage", 
    storeAuthStateInCookie: false, 
  },
};
 
export const loginRequest = {
  scopes: ["User.Read"],
};