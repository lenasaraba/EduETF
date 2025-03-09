export interface Form {
    id: number;
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

  export interface CreateForm {
    topic: string;
    endDate: string;
    multipleAnswer: boolean;
    options: CreateOption[];
    courseId?: number;
    messageId?: number;
  }
  
  export interface Option {
    id: number;
    text: string;
    usersOption: UsersOption[];
    formId: number;
  }

  export interface CreateOption {
    text: string;
  }
  
  
  export interface UsersOption {
    id: number;
    user: User;
    optionId: number;
    answerDate: string;
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