export interface Course {
  id: number;
  name: string;
  description: string;
  year: Year;
  studyProgram: StudyProgram;
  materials: Material[];
  themes: Theme[];
  courseCreationDate: string;
  usersCourse: UsersCourse[];
  professorsCourse: ProfessorsCourse[];
  password: string;
  weekCount: number;
}

export interface CreateCourse {
  name: string;
  description: string;
  yearId: number;
  studyProgramId: number;
  courseCreationDate: string;
}

export interface UsersCourse {
  id: number;
  user: User;
  courseId: number;
  enrollDate: string;
  withdrawDate: string;
}

export interface ProfessorsCourse {
  id: number;
  user: User;
  courseId: number;
  enrollDate: string;
  withdrawDate?: string;
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

export interface Theme {
  id: number;
  title: string;
  description: string;
  date: string;
  userId: number;
  messages: Message[];
  active: string;
}

export interface Message {
  content: string;
  creationDate: string;
  userId: number;
}

export interface Material {
  id: number;
  courseId: number;
  title: string;
  description: string;
  filePath: string;
  url: string;
  materialType: MaterialType;
  creationDate: string;
  week: number;
}

export interface AddMaterial {
  courseId: number;
  title: string;
  description?: string;
  filePath: string;
  url: string;
  materialTypeId: number;
  creationDate: string;
  week: number;
}

export interface Year {
  id: number;
  name: string;
  description: string;
}
export interface StudyProgram {
  id: number;
  name: string;
  description: string;
}
export interface MaterialType {
  id: number;
  name: string;
  description: string;
}

export interface CoursesParams {
  // orderBy: string;
  type?: string;
  searchTerm?: string;
  years: string[];
  studyPrograms: string[];
  pageNumber: number;
  pageSize: number;
}
