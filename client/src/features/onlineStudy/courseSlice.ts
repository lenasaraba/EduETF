import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AddMaterial,
  Course,
  CoursesParams,
  CreateCourse,
  Material,
  StudyProgram,
  User,
  Year,
} from "../../app/models/course";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";
import { MyCoursesParams, StudentsParams } from "../../app/models/professor";

export interface CourseState {
  courses: Course[] | null;
  allCourses: Course[] | null;
  currentCourse: Course | null;
  currentCourseMaterials: Material[] | null;
  materialsLoaded: boolean;
  myCourses: Course[] | null;
  myCoursesParams: MyCoursesParams;
  myCoursesLoaded: boolean;
  professorCourses: Record<number, Course[]> | null;
  userCourses: Record<number, Course[]> | null;
  students: User[] | null;
  studentsLoaded: boolean;
  studentsParams: StudentsParams;
  status: string;
  filtersLoaded: boolean;
  optionsLoaded: boolean;
  allcoursesLoaded: boolean;
  pagecoursesLoaded: boolean;
  currentCourseLoaded: boolean;
  yearsFilter: Year[] | null;
  programsFilter: StudyProgram[] | null;
  years: Year[] | null;
  programs: StudyProgram[] | null;
  coursesParams: CoursesParams;
  metaData: MetaData | null;
}

const initialState: CourseState = {
  courses: null,
  myCourses: null,
  myCoursesLoaded: false,
  myCoursesParams: {},
  allCourses: null,
  currentCourse: null,
  currentCourseMaterials: null,
  materialsLoaded: false,
  professorCourses: {},
  userCourses: {},
  students: null,
  studentsLoaded: false,
  studentsParams: {},
  status: "idle",
  allcoursesLoaded: false,
  pagecoursesLoaded: false,
  currentCourseLoaded: false,
  optionsLoaded: false,
  filtersLoaded: false,
  yearsFilter: null,
  programsFilter: null,
  years: null,
  programs: null,
  coursesParams: initParams(),
  metaData: null,
};

function initParams() {
  return {
    pageNumber: 1,
    pageSize: 6,
    type: "all",
    years: [],
    studyPrograms: [],
  };
}

function getAxiosParams(coursesParams: CoursesParams) {
  const params = new URLSearchParams();

  params.append("pageNumber", coursesParams.pageNumber.toString());
  params.append("pageSize", coursesParams.pageSize.toString());

  if (coursesParams.type) params.append("type", coursesParams.type.toString());
  if (coursesParams.searchTerm)
    params.append("searchTerm", coursesParams.searchTerm.toString());
  if (coursesParams.years.length > 0) {
    coursesParams.years.forEach((year) => {
      params.append("years", year);
    });
  }
  if (coursesParams.studyPrograms.length > 0)
    coursesParams.studyPrograms.forEach((program) => {
      params.append("studyPrograms", program);
    });
  return params;
}

function getStudentsAxiosParams(studentsParams: StudentsParams) {
  const params = new URLSearchParams();
  if (studentsParams.searchTerm)
    params.append("searchTerm", studentsParams.searchTerm.toString());
  return params;
}

function getMyCoursesAxiosParams(myCoursesParams: MyCoursesParams) {
  const params = new URLSearchParams();
  if (myCoursesParams.searchTerm)
    params.append("searchTerm", myCoursesParams.searchTerm.toString());
  return params;
}

export const fetchCoursesAsync = createAsyncThunk<
  { coursesDto: Course[]; metaData: MetaData },
  void,
  { state: RootState }
>("course/fetchCoursesAsync", async (_, thunkAPI) => {
  try {
    const params = getAxiosParams(thunkAPI.getState().course.coursesParams);
    const response = await agent.Course.list(params);
    return {
      coursesDto: response.coursesDto,
      metaData: response.metaData,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchCoursesListAsync = createAsyncThunk<
  Course[],
  void,
  { state: RootState }
>("course/fetchCoursesListAsync", async (_, thunkAPI) => {
  try {
    const courses = await agent.Course.fullList();
    return courses;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchMyCoursesAsync = createAsyncThunk<
  Course[],
  void,
  { state: RootState }
>("course/fetchMyCoursesAsync", async (_, thunkAPI) => {
  const params = getMyCoursesAxiosParams(
    thunkAPI.getState().course.myCoursesParams
  );

  try {
    const courses = await agent.Course.myCourses(params);
    return courses;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchCourseAsync = createAsyncThunk<Course, number>(
  "course/fetchCourseAsync",
  async (id, thunkAPI) => {
    try {
      const course = await agent.Course.getCourse(id);
      return course;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchStudentsAsync = createAsyncThunk<
  User[],
  void,
  { state: RootState }
>("account/fetchStudentsAsync", async (_, thunkAPI) => {
  const params = getStudentsAxiosParams(
    thunkAPI.getState().course.studentsParams
  );

  try {
    const students = await agent.Course.AllStudents(params);
    return students;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

interface ProfCourseResponse {
  profId: number;
  courses: Course[];
}
export const fetchProfessorCoursesAsync = createAsyncThunk<
  ProfCourseResponse,
  number
>("course/fetchProfessorCoursesAsync", async (id, thunkAPI) => {
  try {
    const professorCourses = await agent.Course.getProfessorCourses(id);
    return professorCourses;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchFilters = createAsyncThunk(
  "course/fetchFilters",
  async (_, thunkAPI) => {
    try {
      return agent.Course.fetchFilters();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchAllYearsPrograms = createAsyncThunk(
  "course/fetchAllYearsPrograms",
  async (_, thunkAPI) => {
    try {
      return agent.Course.fetchAllYearsPrograms();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const createCourseAsync = createAsyncThunk<Course, CreateCourse>(
  "course/createCourse",
  async (newCourse, thunkAPI) => {
    try {
      const response = await agent.Course.create(newCourse);
      return response.data; 
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
interface EnrollResponse {
  Message: string;
  student: User;
  course: Course;
}

export const enrollOnCourse = createAsyncThunk<EnrollResponse, number>(
  "course/enrollOnCourse",
  async (id, thunkAPI) => {
    try {
      const userCourse = await agent.Course.enrollOnCourse(id);
      return userCourse;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const deleteCourseAsync = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("course/deleteCourse", async (id, thunkAPI) => {
  try {
    await agent.Course.deleteCourse(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deletePaginatedCourseAsync = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("course/deletePaginatedCourse", async (id, thunkAPI) => {
  try {
    await agent.Course.deleteCourse(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteMaterialAsync = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("course/deleteMaterial", async (id, thunkAPI) => {
  try {
    await agent.Course.deleteMaterial(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

interface EnrollResponseProf {
  Message: string;
  professor: User;
  course: Course;
  enrollDate: string;
  pcId: number;
}
interface EnrollRequestProf {
  courseId: number;
  professorId: number;
}

interface RemoveResponseProf {
  Message: string;
  professorId: number;
  courseId: number;
  withdrawDate: string;
}
export const addProfessorToCourse = createAsyncThunk<
  EnrollResponseProf,
  EnrollRequestProf
>("course/addProfessorToCourse", async (request, thunkAPI) => {
  try {
    const profCourse = await agent.Professor.addProfessorToCourse(
      request.courseId,
      request.professorId
    );
    return profCourse;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const removeProfessorFromCourse = createAsyncThunk<
  RemoveResponseProf,
  number
>("course/removeProfessorFromCourse", async (courseId, thunkAPI) => {
  try {
    const profCourse =
      await agent.Professor.removeProfessorFromCourse(courseId);
    return profCourse;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

interface RemoveResponseStudent {
  Message: string;
  studentId: number;
  courseId: number;
  withdrawDate: string;
}

export const removeStudentFromCourse = createAsyncThunk<
  RemoveResponseStudent,
  number
>("course/removeStudentFromCourse", async (courseId, thunkAPI) => {
  try {
    const studentCourse = await agent.Course.removeStudentFromCourse(courseId);
    return studentCourse;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const uploadFile = createAsyncThunk(
  "materials/uploadFile",
  async (
    {
      file,
      courseId,
      weekNumber,
      material,
    }: {
      file: File;
      courseId: number;
      weekNumber: number;
      material: AddMaterial;
    },
    thunkAPI
  ) => {
    try {
      const response = await agent.Course.upload(file, courseId, weekNumber);
      const responseMaterial = await agent.Course.uploadMaterial({
        ...material,
        filePath: response.filePath,
      });
      return responseMaterial.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

interface MaterialRequest {
  courseId: number;
  query: string;
}

export const fetchCurrentCourseMaterialAsync = createAsyncThunk<
  Material[],
  MaterialRequest
>("course/fetchCurrentCourseMaterialAsync", async (query, thunkAPI) => {
  try {
    const materials = await agent.Course.getMaterialsByCourseId(
      query.courseId,
      query.query
    );
    return materials;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setProfessorCourses: () => {},
    setCoursesParams: (state, action) => {
      state.pagecoursesLoaded = false;
      state.coursesParams = {
        ...state.coursesParams,
        ...action.payload,
        pageNumber: 1,
      };
    },
    setStudentsParams: (state, action) => {
      state.studentsLoaded = false;
      state.studentsParams = {
        ...state.studentsParams,
        ...action.payload,
      };
    },
    resetStudentsParams: (state) => {
      state.studentsParams = {};
    },
    setMyCoursesParams: (state, action) => {
      state.myCoursesLoaded = false;
      state.myCoursesParams = {
        ...state.myCoursesParams,
        ...action.payload,
      };
    },
    resetMyCoursesParams: (state) => {
      state.myCoursesParams = {};
    },
    setPageNumber: (state, action) => {
      state.pagecoursesLoaded = false;
      state.coursesParams = { ...state.coursesParams, ...action.payload };
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload;
    },
    resetCoursesParams: (state) => {
      state.coursesParams = initParams();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfessorCoursesAsync.pending, (state) => {
      state.status = "pendingFetchProfessorCourses";
    });
    builder.addCase(fetchProfessorCoursesAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.professorCourses![action.payload.profId] = action.payload.courses;
    });
    builder.addCase(fetchProfessorCoursesAsync.rejected, (state) => {
      state.status = "rejectedFetchProfessorCourses";
    });
    builder.addCase(createCourseAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.currentCourse = action.payload;
    });

    builder.addCase(fetchCoursesListAsync.pending, (state) => {
      state.status = "pendingFetchCoursesList";
      state.allcoursesLoaded = false;
    });
    builder.addCase(fetchCoursesListAsync.fulfilled, (state, action) => {
      state.allCourses = action.payload;
      state.status = "idle";
      state.allcoursesLoaded = true;
    });
    builder.addCase(fetchCoursesListAsync.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(fetchMyCoursesAsync.pending, (state) => {
      state.status = "pendingFetchMyCourses";
      state.myCoursesLoaded = false;
    });
    builder.addCase(fetchMyCoursesAsync.fulfilled, (state, action) => {
      state.myCourses = action.payload;
      state.status = "fulfilledMyCourses";
      state.myCoursesLoaded = true;
    });
    builder.addCase(fetchMyCoursesAsync.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(fetchCourseAsync.pending, (state) => {
      state.currentCourse = null;
      state.status = "pendingFetchCourse";
      state.currentCourseLoaded = false;
    });
    builder.addCase(fetchCourseAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.currentCourse = action.payload;
      state.currentCourseLoaded = true;
    });
    builder.addCase(fetchCourseAsync.rejected, (state, action) => {
      if (action.payload.error.status == 401)
        state.status = "rejectedUnauthorized";
      else if (action.payload.error.status == 404)
        state.status = "rejectedNotFound";
      state.currentCourse = null;

      state.currentCourseLoaded = false;
    });
    builder.addCase(fetchStudentsAsync.pending, (state) => {
      state.status = "pendingFetchStudents";
    });
    builder.addCase(fetchStudentsAsync.fulfilled, (state, action) => {
      state.students = action.payload;
      state.status = "idle";
      state.studentsLoaded = true;
    });
    builder.addCase(fetchStudentsAsync.rejected, (state) => {
      state.status = "rejectedStudents";
    });

    builder.addCase(enrollOnCourse.pending, (state) => {
      state.status = "loadingEnrollOnCourse";
    });
    builder.addCase(enrollOnCourse.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(enrollOnCourse.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(fetchFilters.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.yearsFilter = action.payload.years;
      state.programsFilter = action.payload.programs;
      state.status = "idle";
      state.filtersLoaded = true;
    });
    builder.addCase(fetchFilters.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchAllYearsPrograms.pending, (state) => {
      state.status = "pendingfetchAllYearsPrograms";
    });
    builder.addCase(fetchAllYearsPrograms.fulfilled, (state, action) => {
      state.years = action.payload.years;
      state.programs = action.payload.programs;
      state.status = "idle";
      state.optionsLoaded = true;
    });
    builder.addCase(fetchAllYearsPrograms.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchCoursesAsync.pending, (state) => {
      state.status = "pendingFetchCourses";
      state.pagecoursesLoaded = false;
    });
    builder.addCase(fetchCoursesAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchCoursesAsync.fulfilled, (state, action) => {
      state.courses = action.payload.coursesDto;
      state.metaData = action.payload.metaData;
      state.status = "idle";
      state.pagecoursesLoaded = true;
    });
    builder.addCase(deleteCourseAsync.pending, (state) => {
      state.status = "pendingDeleteCourse";
    });
    builder.addCase(deleteCourseAsync.fulfilled, (state, action) => {
      state.status = "idle";
      if (state.allCourses)
        state.allCourses = state.allCourses!.filter(
          (course) => course.id !== action.payload
        );
    });
    builder.addCase(deleteCourseAsync.rejected, (state) => {
      state.status = "rejectedDeleteCourse";
    });
    builder.addCase(deletePaginatedCourseAsync.pending, (state) => {
      state.status = "pendingDeletePaginatedCourse";
    });
    builder.addCase(deletePaginatedCourseAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.courses = state.courses!.filter(
        (course) => course.id !== action.payload
      );
    });
    builder.addCase(deletePaginatedCourseAsync.rejected, (state) => {
      state.status = "rejectedDeletePaginatedCourse";
    });

    builder.addCase(deleteMaterialAsync.pending, (state) => {
      state.status = "pendingDeleteMaterial";
    });
    builder.addCase(deleteMaterialAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.currentCourse = {
        ...state.currentCourse!,
        materials:
          state.currentCourse?.materials?.filter(
            (mat) => mat.id !== action.payload
          ) || [],
      };
      state.currentCourseMaterials = state.currentCourseMaterials!.filter(
        (material) => material.id !== action.payload
      );
    });
    builder.addCase(deleteMaterialAsync.rejected, (state) => {
      state.status = "rejectedDeleteMaterial";
    });
    builder.addCase(uploadFile.pending, (state) => {
      state.status = "pendingUploadMaterial";
    });
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.currentCourseMaterials?.push(action.payload);
      if (action.payload.week > state.currentCourse!.weekCount) {
        state.currentCourse!.weekCount = action.payload.week;
        state.status = "idleUploadNewWeek";
      } else {
        state.status = "idleUploadExistingWeek";
      }
    });
    builder.addCase(uploadFile.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(fetchCurrentCourseMaterialAsync.pending, (state) => {
      state.status = "fetchCurrentCourseMaterialAsync";
      state.materialsLoaded = false;
    });
    builder.addCase(
      fetchCurrentCourseMaterialAsync.fulfilled,
      (state, action) => {
        if (!state.status.includes("rejected")) state.status = "idle";
        state.currentCourseMaterials = action.payload; 
        state.materialsLoaded = true;
      }
    );
    builder.addCase(fetchCurrentCourseMaterialAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(addProfessorToCourse.pending, (state) => {
      state.status = "loadingProfessorOnCourse";
    });
    builder.addCase(
      addProfessorToCourse.fulfilled,
      (state, action: PayloadAction<EnrollResponseProf>) => {
        state.professorCourses![action.payload.professor.id] =
          state.professorCourses![action.payload.professor.id] || [];
        state.professorCourses![action.payload.professor.id].push(
          action.payload.course
        );
        state.currentCourse?.professorsCourse.push({
          id: action.payload.pcId,
          user: action.payload.professor,
          courseId: action.payload.course.id,
          enrollDate: action.payload.enrollDate,
        });
        state.status = "fulfilledAddProfessorToCourse";
      }
    );
    builder.addCase(addProfessorToCourse.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(removeProfessorFromCourse.pending, (state) => {
      state.status = "loadingRemoveProfessorFromCourse";
    });
    builder.addCase(
      removeProfessorFromCourse.fulfilled,
      (state, action: PayloadAction<RemoveResponseProf>) => {
        if (
          state.professorCourses &&
          state.professorCourses[action.payload.professorId]
        ) {
          const professorCourses =
            state.professorCourses[action.payload.professorId];
          const course = professorCourses.find(
            (pc) => pc.id === action.payload.courseId
          );
          if (course) {
            const profCourse = course.professorsCourse.find(
              (professor) =>
                professor.user.id === action.payload.professorId &&
                professor.withdrawDate == null
            );
            if (profCourse)
              profCourse.withdrawDate = action.payload.withdrawDate;
          }
        }

        if (state.currentCourse?.professorsCourse) {
          const profCourse = state.currentCourse.professorsCourse.find(
            (professor) =>
              professor.user.id === action.payload.professorId &&
              professor.withdrawDate == null
          );
          if (profCourse) profCourse.withdrawDate = action.payload.withdrawDate;
        }

        if (state.courses && state.courses.length > 0) {
          const course = state.courses.find(
            (course) => course.id === action.payload.courseId
          );
          if (course) {
            const profCourse = course.professorsCourse.find(
              (professor) =>
                professor.user.id === action.payload.professorId &&
                professor.withdrawDate == null
            );
            if (profCourse)
              profCourse.withdrawDate = action.payload.withdrawDate;

          }
        }

        if (state.allCourses && state.allCourses.length > 0) {
          const course = state.allCourses.find(
            (course) => course.id === action.payload.courseId
          );
          if (course) {
            const profCourse = course.professorsCourse.find(
              (professor) =>
                professor.user.id === action.payload.professorId &&
                professor.withdrawDate == null
            );
            if (profCourse)
              profCourse.withdrawDate = action.payload.withdrawDate;
          }
        }

        state.status = "fulfilledRemoveProfessorFromCourse";
      }
    );

    builder.addCase(removeProfessorFromCourse.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(removeStudentFromCourse.pending, (state) => {
      state.status = "loadingRemoveStudentFromCourse";
    });
    builder.addCase(
      removeStudentFromCourse.fulfilled,
      (state, action: PayloadAction<RemoveResponseStudent>) => {
        if (state.courses && state.courses.length > 0) {
          const course = state.courses.find(
            (course) => course.id === action.payload.courseId
          );
          if (course) {
            const userCourse = course.usersCourse.find(
              (uc) =>
                uc.user.id == action.payload.studentId &&
                uc.withdrawDate == null
            );
            if (userCourse) {
              userCourse.withdrawDate = action.payload.withdrawDate;
            }
          }
        }
        state.status = "fulfilledRemoveStudentFromCourse";
      }
    );

    builder.addCase(removeStudentFromCourse.rejected, (state) => {
      state.status = "idle";
    });
  },
});

export const {
  setProfessorCourses,
  setCoursesParams,
  setPageNumber,
  resetCoursesParams,
  setMetaData,
  setStudentsParams,
  resetStudentsParams,
  setMyCoursesParams,
  resetMyCoursesParams,
} = courseSlice.actions;
