//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
//import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes.tsx";
import ReactDOM from "react-dom/client";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./app/store/configureStore.ts";
import { msalConfig } from "../authConfig.ts";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react"; 


//-----------------OPEN ID----------------
// const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <MsalProvider instance={msalInstance}> */}
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    {/* </MsalProvider> */}
  </React.StrictMode>
);
