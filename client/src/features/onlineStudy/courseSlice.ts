import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Course,
  CoursesParams,
  CreateCourse,
  StudyProgram,
  Year,
} from "../../app/models/course";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/pagination";

export interface CourseState {
  courses: Course[] | null;
  allCourses: Course[] | null;
  currentCourse: Course | null;
  // myCourses: Course[] | null;
  professorCourses: Record<number, Course[]> | null;
  status: string;
  filtersLoaded: boolean;
  allcoursesLoaded: boolean;
  pagecoursesLoaded: boolean;

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
  currentCourse:null,
  professorCourses: {},
  status: "idle",
  allcoursesLoaded: false,
  pagecoursesLoaded:false,
  filtersLoaded: false,
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

export const fetchCoursesAsync = createAsyncThunk<
  { coursesDto: Course[], metaData: MetaData }, // Tip povratne vrednosti: objekat sa kursevima i meta podacima
  void, // Parametri koje šaljemo (i dalje undefined, pa je tip void)
  { state: RootState } // Tip za state (koristiš RootState za pristup stanjima u aplikaciji)
>(
  "course/fetchCoursesAsync",
  async (_, thunkAPI) => {
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
        coursesDto: response.coursesDto,  // Ovo je lista kurseva
        metaData: response.metaData,   // Ovo su meta podaci
      };
    } catch (error: any) {
      console.log(error.data);
      // Ako dođe do greške, vraćanje greške sa rejectWithValue
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);



export const fetchCoursesListAsync = createAsyncThunk<
  Course[],
  void,
  { state: RootState }
>("course/fetchCoursesListAsync", async (_, thunkAPI) => {
  // const params = getAxiosParams(thunkAPI.getState().course.coursesParams);

  try {
    const courses = await agent.Course.fullList();

    //thunkAPI.dispatch(setAllCourses(courses));
    //thunkAPI.dispatch(setMetaData(courses.metaData));
    return courses;
  } catch (error: any) {
    console.log(error.data);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});


export const fetchCourseAsync = createAsyncThunk<
  Course,
  number
>("course/fetchCourseAsync", async (id, thunkAPI) => {

  try {
    const course = await agent.Course.getCourse(id);
    return course;
  } catch (error: any) {
    console.log(error.data);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchProfessorCoursesAsync = createAsyncThunk<
  Record<number, Course[]>,
  number
>("course/fetchProfessorCoursesAsync", async (id, thunkAPI) => {
  try {
    const professorCourses = await agent.Course.getProfessorCourses(id);
    thunkAPI.dispatch(
      setProfessorCourses({
        professorId: id,
        courses: professorCourses,
      })
    );
    return { id, professorCourses };
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

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // setCourses: (state, action) => {
    //   console.log(action.payload);
    //   // if (action.payload.items) state.courses = action.payload.items;
    //   // else state.courses = action.payload;
    // },
    // setAllCourses: (state, action) => {
    //   state.allCourses = action.payload;
    // },
    setProfessorCourses: (state, action) => {
      state.professorCourses![action.payload.professorId] =
        action.payload.courses;
    },
    setCoursesParams: (state, action) => {
      state.pagecoursesLoaded = false;
      state.coursesParams = {
        ...state.coursesParams,
        ...action.payload,
        pageNumber: 1,
      };
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
    // setLoading(state, action) {
    //   state.loading = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(createCourseAsync.fulfilled, (state) => {
      state.status = "idle"; 

      // if (state.allCourses) {
      //   state.allCourses.push(action.payload);
      // } else {
      //   state.allCourses = [action.payload];
      // }
      // if (state.courses) {
      //   state.courses.push(action.payload);
      // } else {
      //   state.courses = [action.payload];
      // }
    });
    builder.addCase(fetchCoursesListAsync.pending, (state) => {
      state.status = "pendingFetchCoursesList";
      state.allcoursesLoaded=false;
    });
    builder.addCase(fetchCoursesListAsync.fulfilled, (state, action) => {
      state.allCourses = action.payload;
      state.status = "idle";
      state.allcoursesLoaded=true;;
    });
    builder.addCase(fetchCoursesListAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchCourseAsync.pending, (state)=>{
      state.status='pendingFetchCourse';
     });
   builder.addCase(fetchCourseAsync.fulfilled, (state, action)=>{
    state.status='idle';
    state.currentCourse=action.payload;
   });
   builder.addCase(fetchCourseAsync.rejected, (state)=>{
    state.status='idle';
   });
    builder.addCase(fetchFilters.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.years = action.payload.years;
      state.programs = action.payload.programs;
      state.status = "idle";
      state.filtersLoaded = true;
      //state.loading = false;
    });
    builder.addCase(fetchFilters.rejected, (state) => {
      state.status = "idle";
    });
    // builder.addCase(fetchUserCoursesAsync.pending, (state) => {
    //   //state.loading = true; // Postavi loading na true
    //   state.status='pendingFetchCourses';

    // });
    // builder.addCase(fetchUserCoursesAsync.fulfilled, (state) => {
    //   //state.loading = false; // Postavi loading na true
    //   state.coursesLoaded = true;
    //   state.status='idle';

    // });
    // builder.addCase(fetchUserCoursesAsync.rejected, (state) => {
    //   //state.loading = false;
    //   state.status='idle';

    // });
    builder.addCase(fetchCoursesAsync.pending, (state) => {
      state.status = "pendingFetchCourses";
      state.pagecoursesLoaded=false;
    });
    builder.addCase(fetchCoursesAsync.rejected, (state) => {
      //state.loading = false;
      state.status = "idle";
    });
    builder.addCase(fetchCoursesAsync.fulfilled, (state, action) => {
      //state.loading = false; // Postavi loading na true
      console.log(action.payload);
      state.courses=action.payload.coursesDto;
      state.metaData=action.payload.metaData;
      state.status = "idle";
      state.pagecoursesLoaded = true;
    });
    builder.addCase(deleteCourseAsync.fulfilled, (state, action) => {
          state.status = "idle";
          state.allCourses = state.allCourses!.filter((course) => course.id !== action.payload);
        });
    // builder.addCase(fetchProfessorCoursesAsync.pending, (state) => {
    //   state.status = "pendingFetchProfessorCoursesAsync";
    // });
    // builder.addCase(fetchProfessorCoursesAsync.rejected, (state) => {
    //   //state.loading = false;
    //   state.status = "idle";
    // });
    // builder.addCase(fetchProfessorCoursesAsync.fulfilled, (state) => {
    //   //state.loading = false; // Postavi loading na true
    //   state.status = "idle";
    //   state.coursesLoaded = true;
    // });
    // builder.addCase(createCourseAsync.fulfilled, (state, action) => {
    //   state.status = "succeeded"; // Ažuriramo status kako bismo pokazali da je operacija uspešna
    //   if (state.allCourses) {
    //     console.log("State.allcourses push");
    //     state.allCourses.push(action.payload);
    //     console.log(state.allCourses);
    //   } else {
    //     console.log("State.allcourses push");
    //     state.allCourses = [action.payload];
    //   }
    //   if (state.courses) {
    //     console.log("State.courses push");
    //     state.courses.push(action.payload);
    //     console.log(state.courses);
    //   } else {
    //     console.log("State.courses push");
    //     state.courses = [action.payload];
    //   }
    // });
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
} = courseSlice.actions;
