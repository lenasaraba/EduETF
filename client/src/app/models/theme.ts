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
  user: User;
  themeId?: number;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  year: Year;
  studyProgram: Year;
  courseCreationDate: string;
  professorsCourse: ProfessorsCourse[];
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
