import { createBrowserRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import App from "../layout/App";
import AboutPage from "../../features/about/AboutPage";
import Layout from "../layout/Layout";
import { useEffect } from "react";
import Login from "../../features/account/Login";
import OnlineStudy from "../../features/onlineStudy/OnlineStudy";
import CourseList from "../../features/onlineStudy/CourseList";
import Course from "../../features/onlineStudy/Course";
import RequireAuth from "../components/RequireAuth";
import ForumPage from "../../features/forum/ForumPage";
import Theme from "../../features/forum/Theme";
import Themes from "../../features/forum/Themes";
import CreateTheme from "../../features/forum/CreateTheme";
import CreateCourse from "../../features/onlineStudy/CreateCourse";
import Professors from "../../features/onlineStudy/Professors";
import ProfessorInfo from "../../features/onlineStudy/ProfessorInfo";
import Students from "../../features/onlineStudy/components/Students";
import UserProfile from "../../features/profile/components/UserProfile";
import StudentHistory from "../../features/onlineStudy/StudentHistory";
import FormPage from "../../features/form/FormPage";
import Users from "../../features/profile/components/Users";

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
            element: <CourseList />, 
          },
          {
            path: "courses/:id",
            element: <Course />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "myProfile",
            element: (
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            ),
          },
          {
            path: "forum",
            element: <ForumPage />,
          },
          {
            path: "forum/:id",
            element: <Theme />,
          },
          {
            path: "themes",
            element: <Themes />,
          },
          {
            path: "createTheme",
            element: <CreateTheme />,
          },
          {
            path: "createCourse",
            element: <CreateCourse />,
          },
          {
            path: "/users/professors",
            element: <Professors />,
          },
          {
            path: "professorInfo/:id",
            element: <ProfessorInfo />,
          },
          {
            path: "/users/students",
            element: <Students />,
          },
          {
            path: "/studentHistory",
            element: <StudentHistory />,
          },
          {
            path: "forms",
            element: (
              <RequireAuth>
                <FormPage />
              </RequireAuth>
            ),
          },
        ],
      },
    ],
  },
]);
