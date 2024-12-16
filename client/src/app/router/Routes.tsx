import { createBrowserRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import App from "../layout/App";
import AboutPage from "../../features/about/AboutPage";
import Layout from "../layout/Layout";
import { useEffect } from "react";
import Login from "../../features/account/Login";
import OnlineStudy from "../../features/onlineStudy/OnlineStudy";
import CourseList from "../../features/onlineStudy/CourseList";

const ExternalRedirect = ({ url }: { url: string }) => {
  useEffect(() => {
    window.location.replace(url);
  }, []);
  return null;
};

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "about",
            element: <AboutPage />,
          },
          {
            path: "etfis",
            element: <ExternalRedirect url="https://www.etf.ues.rs.ba/" />,
          },
          {
            path: "onlineStudy",
            element: <OnlineStudy />,
          },
          {
            path: "courses",
            element: <CourseList />, // Komponenta koja prikazuje kurseve
          },
        ],
      },
    ],
  },
]);
