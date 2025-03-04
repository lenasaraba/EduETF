/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from "axios";
import { store } from "../store/configureStore";
// import { router } from "../router/Routes";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../models/pagination";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    // console.log(response);
    // const pagination=response.headers['pagination'];    //PAGINATION MORA MALIM SLOVIMA
    // if(pagination){
    //     response.data=new PaginatedResponse(response.data, JSON.parse(pagination))
    //     //console.log(response);
    // }
    if (response.status === 201) {
      if (response.data.method == "CreateTheme") toast.success("Tema kreirana");
      if (response.data.method == "CreateCourse") toast.success("Kurs kreiran");
      if (response.data.method == "AddMaterial")
        toast.success("Materijal dodat");

      // Ako želite, možete dodati specifičnu logiku za status 201
    } else if (response.status === 200) {
      if (response.data.method == "DeleteTheme")
        toast.success(response.data.message);
      if (response.data.method == "DeleteCourse")
        toast.success(response.data.message);
      if (response.data.method == "DeleteMaterial")
        toast.success(response.data.message);
      if (response.data.method == "RemoveProfessorFromCourse")
        toast.success(response.data.message);
      if (response.data.method == "RemoveStudentFromCourse")
        toast.success(response.data.message);
    }

    // const pagination = response.headers["pagination"];
    // //console.log(response.headers);
    // if (pagination) {
    //   // response.data = new PaginatedResponse(
    //   //   response.data,
    //   //   JSON.parse(pagination)
    //   // );
    //   console.log(response);
    //   return response;
    // }
    // console.log(response.data);
    return response;
  },
  (error: AxiosError) => {
    //console.log('caught by interceptor');
    //const
    //destrukturiramo propertije koje uzimamo iz error response
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 201:
        // console.log(data.title);
        break;
      case 400:
        // if(data.errors){
        //    const modelStateErrors: string[]=[];
        //    for(const key in data.errors){
        //     if(data.errors[key]){
        //         modelStateErrors.push(data.errors[key]);
        //     }
        //    }
        //    throw modelStateErrors.flat();
        // }
        toast.error(data.title);
        break;
      case 401:
        // toast.error("Neuspješna prijava");
        toast.error(data.title);

        break;
      case 404:
        toast.error("Resurs nije pronađen.");
        break;
      case 500:
        toast.error(data.title);
        //router.navigate('/server-error', {state: {error: data}});
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Account = {
  login: (values: any) => requests.post("Account/login", values),
  register: (values: any) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
  // fetchAddress: ()=>requests.get('account/savedAddress'),
  updateUser: (userData: any) => requests.post("account/updateUser", userData),
};

const Course = {
  list: (params: URLSearchParams) =>
    requests.get("course/getAllCourses", params),
  fullList: () => requests.get("course/getAllCoursesList"),
  // getMy: (id: string) => requests.get(`course/getMyCourses/${id}`),
  getProfessorCourses: (id: number) =>
    requests.get(`course/getProfessorsCourses/${id}`),
  getCourse: (id: number) => requests.get(`course/getCourseById/${id}`),
  fetchFilters: () => requests.get("course/filters"),
  fetchAllYearsPrograms: () => requests.get("course/yearsPrograms"),
  create: (values: any) => requests.post("course/CreateCourse", values),
  deleteCourse: (id: number) => requests.delete(`course/DeleteCourse/${id}`),
  uploadMaterial: (material: any) =>
    requests.post("course/AddMaterial", material),
  deleteMaterial: (id: number) =>
    requests.delete(`course/DeleteMaterial/${id}`),
  upload: (file: File, courseId: number, weekNumber: number) => {
    console.log(courseId, weekNumber);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId.toString());
    formData.append("weekNumber", weekNumber.toString());
    return requests.post("course/upload", formData);
  },
  getMaterialsByCourseId: (courseId: number, query:string) =>
    requests.get(`course/getCourseMaterialsByCourseId`, {courseId, query}),
  enrollOnCourse: (courseId: number) =>
    requests.post("course/enroll", { courseId }),
  AllStudents: (params: URLSearchParams) =>
    requests.get("course/getStudents", params),
  removeStudentFromCourse: (courseId: number) =>
    requests.post("course/removeStudentFromCourse", { courseId }),
  myCourses: (params: URLSearchParams) => requests.get("course/getMyCourses", params),
};

const Professor = {
  GetAllProfessors: (params: URLSearchParams) =>
    requests.get("professor/GetAllProfessors", params),
  getProfessorYearsPrograms: (id: number) =>
    requests.get(`professor/getProfessorYearsPrograms/${id}`),
  fetchFilters: () => requests.get("professor/filters"),
  addProfessorToCourse: (courseId: number, professorId: number) =>
    requests.post("professor/addProfessorToCourse", { courseId, professorId }),
  removeProfessorFromCourse: (courseId: number) =>
    requests.post("professor/removeProfessorFromCourse", { courseId }),
  getProfessorById: (id: number) => requests.get(`professor/GetUserById/${id}`),
};

const Theme = {
  getAll: (params: URLSearchParams) =>
    requests.get("theme/GetAllThemes", params),
  create: (values: any) => requests.post("theme/CreateTheme", values),
  fetchFilters: () => requests.get("theme/filters"),
  updateTheme: (themeData: any) =>
    requests.post("theme/updateTheme", themeData),
  getProfessorThemes: (id: number) =>
    requests.get(`theme/getProfessorThemes/${id}`),
  deleteTheme: (id: number) => requests.delete(`theme/DeleteTheme/${id}`),
  getTheme: (id: number) => requests.get(`theme/GetTheme/${id}`),
};
const Message = {
  getAll: (id: number) => requests.get(`theme/GetAllMessages/${id}`),
  createMessage: (values: any) => requests.post("theme/CreateMessage", values),
  deleteMessage: (id: number) => requests.delete(`theme/DeleteMessage/${id}`),
  searchMessage: (themeId: number, query: string) =>
    requests.get(`theme/search`, { themeId, query }),
};

const agent = {
  Account,
  Course,
  Professor,
  Theme,
  Message,
};

export default agent;
