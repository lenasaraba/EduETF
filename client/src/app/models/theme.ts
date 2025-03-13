import { MaterialType, UsersCourse } from "./course";
import { CreateForm } from "./form";

export interface Theme {
  id: number;
  title: string;
  description: string;
  date: string;
  user: User;
  course: Course;
  messages: Message[];
  active: string;
}

export interface CreateTheme {
  title: string;
  description: string;
  date: string;
  courseId?: number;
}

export interface Message {
  id?: number;
  content: string;
  creationDate: string;
  themeId: number;
  materials?: MessageMaterial[];
  forms?: Form[];
  newForms?: CreateForm[];

  user: User;
}
export interface CreateMessage {
  id?: number;
  content: string;
  creationDate: string;
  themeId: number;
  materials?: CreateMessageMaterial[];
  forms?: Form[];
  newForms?: CreateForm[];

  user: User;
}
export interface CreateMessageMaterial {
  id?: number;
  messageId?: number;
  title: string;
  filePath: string;
  url: string;
  materialTypeId: number;
  creationDate: string;
}



export interface MessageMaterial {
  id?: number;
  messageId?: number;
  title: string;
  filePath: string;
  url: string;
  materialType: MaterialType;
  creationDate: string;
}

export interface Option {
  id?: number;
  text: string;
  usersOption: UsersOption[];
  formId: number;
}

export interface UsersOption {
  id?: number;
  user: User;
  optionId: number;
  answerDate: string;
}

export interface Form {
  id?: number;
  topic: string;
  creationDate: string;
  endDate: string;
  userId: number;
  user: User;
  multipleAnswer: boolean;
  options: Option[];
  courseId: number;
  messageId: number;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  year: Year;
  studyProgram: Year;
  courseCreationDate: string;
  professorsCourse: ProfessorsCourse[];
  usersCourse: UsersCourse[];
}

export interface ProfessorsCourse {
  id: number;
  user: User;
  courseId: number;
  enrollDate: string;
  withdrawDate: string;
}

export interface Year {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  token: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface ThemesParams {
  // orderBy: string;
  searchTerm?: string;
  themeStatus?: string;
  category?: string;
  type: string;
  // pageNumber:number
  // pageSize:number
}
