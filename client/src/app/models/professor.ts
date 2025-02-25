export interface Professor {
  id: number;
  email: string;
  username: string;
  token: string;
  firstName: string;
  lastName: string;
}

export interface ProfessorsParams {
  searchTerm?: string;
  program?: string;
  year?: string;
}

export interface StudentsParams {
  searchTerm?: string;
}



