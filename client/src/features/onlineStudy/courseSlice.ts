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
import { router } from "../../app/router/Routes";
import { StudentsParams } from "../../app/models/professor";

export interface CourseState {
  courses: Course[] | null;
  allCourses: Course[] | null;
  currentCourse: Course | null;
  currentCourseMaterials: Material[] | null;
  materialsLoaded: boolean;
  // myCourses: Course[] | null;
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
  //loading: boolean;
}

const initialState: CourseState = {
  courses: null,
  // myCourses: null,
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
  //loading: false,
};

function initParams() {
  return {
    pageNumber: 1,
    pageSize: 6,
    // orderBy: "name",
    type: "all",
    years: [],
    studyPrograms: [],
  };
}

function getAxiosParams(coursesParams: CoursesParams) {
  const params = new URLSearchParams();

  params.append("pageNumber", coursesParams.pageNumber.toString());
  params.append("pageSize", coursesParams.pageSize.toString());
  // params.append("orderBy", coursesParams.orderBy.toString());

  if (coursesParams.type) params.append("type", coursesParams.type.toString());
  if (coursesParams.searchTerm)
    params.append("searchTerm", coursesParams.searchTerm.toString());
  if (coursesParams.years.length > 0) {
    // params.append("years", coursesParams.years.toString());
    coursesParams.years.forEach((year) => {
      params.append("years", year);
    });
  }
  if (coursesParams.studyPrograms.length > 0)
    // params.append("studyPrograms", coursesParams.studyPrograms.toString());
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

export const fetchCoursesAsync = createAsyncThunk<
  { coursesDto: Course[]; metaData: MetaData }, // Tip povratne vrednosti: objekat sa kursevima i meta podacima
  void, // Parametri koje šaljemo (i dalje undefined, pa je tip void)
  { state: RootState } // Tip za state (koristiš RootState za pristup stanjima u aplikaciji)
>("course/fetchCoursesAsync", async (_, thunkAPI) => {
  try {
    // Pristup parametrima iz stanja
    const params = getAxiosParams(thunkAPI.getState().course.coursesParams);

    // Logovanje parametara radi debagovanja
    //params.forEach((a) => console.log(a));

    // Pozivanje API-ja za kurs
    const response = await agent.Course.list(params);

    console.log(response);
    // Pretpostavljamo da odgovor sadrži kurseve (coursesDto) i meta podatke (metaData)
    return {
      coursesDto: response.coursesDto, // Ovo je lista kurseva
      metaData: response.metaData, // Ovo su meta podaci
    };
  } catch (error: any) {
    console.log(error.data);
    // Ako dođe do greške, vraćanje greške sa rejectWithValue
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchCoursesListAsync = createAsyncThunk<
  Course[],
  void,
  { state: RootState }
>("course/fetchCoursesListAsync", async (_, thunkAPI) => {
  // const params = getAxiosParams(thunkAPI.getState().course.coursesParams);

  try {
    const courses = await agent.Course.fullList();
    console.log(courses);
    //thunkAPI.dispatch(setAllCourses(courses));
    //thunkAPI.dispatch(setMetaData(courses.metaData));
    return courses;
  } catch (error: any) {
    console.log(error.data);
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
      console.log(error.data);
      // router.navigate("/onlineStudy");
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
    console.log(students);

    return students;
  } catch (error: any) {
    console.log(error.data);
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
    // thunkAPI.dispatch(
    //   setProfessorCourses({
    //     professorId: id,
    //     courses: professorCourses,
    //   })
    // );
    return professorCourses;
  } catch (error: any) {
    console.log(error.data);
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
      return response.data; // Ovo vraća listu sa servera
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
      console.log(userCourse);
      return userCourse;
    } catch (error: any) {
      console.log(error.data);
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
    // console.log(thunkAPI.fulfillWithValue(id))
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
    // console.log(thunkAPI.fulfillWithValue(id))
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
    console.log(profCourse);
    return profCourse;
  } catch (error: any) {
    console.log(error.data);
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
    // console.log(profCourse);
    return profCourse;
  } catch (error: any) {
    console.log(error.data);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

interface RemoveResponseStudent {
  Message: string;
  studentId: number;
  courseId: number;
}

export const removeStudentFromCourse = createAsyncThunk<
  RemoveResponseStudent,
  number
>("course/removeStudentFromCourse", async (courseId, thunkAPI) => {
  try {
    const studentCourse =
      await agent.Course.removeStudentFromCourse(courseId);
    console.log(studentCourse);
    return studentCourse;
  } catch (error: any) {
    console.log(error.data);
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
      // Koristi agent za slanje 'FormData' sa fajlom
      const response = await agent.Course.upload(file, courseId, weekNumber);
      console.log(response);
      const responseMaterial = await agent.Course.uploadMaterial({
        ...material,
        filePath: response.filePath,
      });
      console.log(responseMaterial);
      return responseMaterial.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentCourseMaterialAsync = createAsyncThunk<
  Material[],
  number
>("course/fetchCurrentCourseMaterialAsync", async (id, thunkAPI) => {
  try {
    const materials = await agent.Course.getMaterialsByCourseId(id);
    return materials;
  } catch (error: any) {
    console.log(error.data);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setProfessorCourses: (state, action) => {},
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
      console.log(action.payload);
      state.professorCourses![action.payload.profId] = action.payload.courses;
    });
    builder.addCase(fetchProfessorCoursesAsync.rejected, (state) => {
      state.status = "rejectedFetchProfessorCourses";
    });
    builder.addCase(createCourseAsync.fulfilled, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
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
    builder.addCase(fetchCourseAsync.pending, (state) => {
      state.currentCourse = null;
      state.status = "pendingFetchCourse";
      state.currentCourseLoaded = false;
    });
    builder.addCase(fetchCourseAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.currentCourse = action.payload;
      console.log(state.currentCourse);
      state.currentCourseLoaded = true;
    });
    builder.addCase(fetchCourseAsync.rejected, (state, action) => {
      console.log(action.payload.error.status);
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
    builder.addCase(
      enrollOnCourse.fulfilled,
      (state, action: PayloadAction<EnrollResponse>) => {
        state.status = "idle";
        console.log(action.payload);
        // Pretpostavljamo da je tip stanja 'userCourses' tipa Record<number, Course[]>
        state.userCourses![action.payload.student.id] =
          state.userCourses![action.payload.student.id] || [];
        state.userCourses![action.payload.student.id].push(
          action.payload.course
        );
        //OVO PROMIJENITI
        //state.currentCourse?.usersCourse=state.currentCourse?.usersCourse.concat(action.payload);
      }
    );
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
      //state.loading = false;
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
      //state.loading = false;
    });
    builder.addCase(fetchAllYearsPrograms.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchCoursesAsync.pending, (state) => {
      state.status = "pendingFetchCourses";
      state.pagecoursesLoaded = false;
    });
    builder.addCase(fetchCoursesAsync.rejected, (state) => {
      //state.loading = false;
      state.status = "idle";
    });
    builder.addCase(fetchCoursesAsync.fulfilled, (state, action) => {
      //state.loading = false; // Postavi loading na true
      console.log(action.payload);
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
      state.materialsLoaded = false;
    });
    builder.addCase(uploadFile.fulfilled, (state, action) => {
      state.status = "idle";
      state.currentCourseMaterials?.push(action.payload); // Ažuriranje liste materijala
      // state.currentCourse?.materials?.concat(action.payload);
      console.log(action.payload);
      if (action.payload.week > state.currentCourse!.weekCount)
        state.currentCourse!.weekCount = action.payload.week;
      else {
        state.materialsLoaded = true;
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
        state.currentCourseMaterials = action.payload; // Ažuriranje liste materijala
        state.materialsLoaded = true;

        console.log(action.payload);
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
        // state.status = "idle";
        console.log(action.payload);
        // Pretpostavljamo da je tip stanja 'userCourses' tipa Record<number, Course[]>
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
        console.log(state.currentCourse);
        state.status = "fulfilledRemoveProfessorFromCourse";
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
        console.log(action.payload);

        // Proveri da li professorCourses postoji za datog profesora
        if (
          state.professorCourses &&
          state.professorCourses[action.payload.professorId]
        ) {
          state.professorCourses[action.payload.professorId] =
            state.professorCourses[action.payload.professorId].filter(
              (pc) => pc.id !== action.payload.courseId
            );
        }

        // Proveri da li currentCourse i professorsCourse postoje pre nego što primeniš filter
        if (state.currentCourse?.professorsCourse) {
          state.currentCourse.professorsCourse =
            state.currentCourse.professorsCourse.filter(
              (pc) => pc.courseId !== action.payload.courseId
            );
        }

        if (state.courses && state.courses.length>0) {
          const course = state.courses.find(
            (course) => course.id === action.payload.courseId
          );
          if (course) {
            course.professorsCourse = course.professorsCourse.filter(
              (professor) => professor.user.id !== action.payload.professorId
            );
          }
        }

        if (state.allCourses && state.allCourses.length>0) {
          const course = state.allCourses.find(
            (course) => course.id === action.payload.courseId
          );
          if (course) {
            course.professorsCourse = course.professorsCourse.filter(
              (professor) => professor.user.id !== action.payload.professorId
            );
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
        console.log(action.payload);

        if (
          state.userCourses &&
          state.userCourses[action.payload.studentId]
        ) {
          state.userCourses[action.payload.studentId] =
            state.userCourses[action.payload.studentId].filter(
              (uc) => uc.id !== action.payload.courseId
            );
        }

        // Proveri da li currentCourse i usersCourse postoje pre nego što primeniš filter
        if (state.currentCourse?.usersCourse) {
          state.currentCourse.usersCourse =
            state.currentCourse.usersCourse.filter(
              (uc) => uc.courseId !== action.payload.courseId
            );
        }

        if (state.courses && state.courses.length>0) {
          const course = state.courses.find(
            (course) => course.id === action.payload.courseId
          );
          if (course) {
            course.usersCourse = course.usersCourse.filter(
              (student) => student.user.id !== action.payload.studentId
            );
          }
        }

        if (state.allCourses && state.allCourses.length>0) {
          const course = state.allCourses.find(
            (course) => course.id === action.payload.courseId
          );
          if (course) {
            course.usersCourse = course.usersCourse.filter(
              (student) => student.user.id !== action.payload.studentId
            );
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
  // setCourses,
  // setAllCourses,
  // setMyCourses,
  setProfessorCourses,
  setCoursesParams,
  setPageNumber,
  resetCoursesParams,
  setMetaData,
  setStudentsParams,
  resetStudentsParams,
} = courseSlice.actions;
