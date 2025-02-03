import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Professor, ProfessorsParams } from "../../app/models/professor";
import { Course, StudyProgram, Year } from "../../app/models/course";
import { RootState } from "../../app/store/configureStore";
import { Theme } from "../../app/models/theme";

export interface ProfessorState {
  professors: Professor[];
  status: string;
  professorsParams: ProfessorsParams;
  filtersLoaded: boolean;
  professorsLoaded: boolean;

  professorCourses: Record<number, Course[]> | null;
  professorThemes: Record<number, Theme[]> | null;
  coursesLoaded: boolean;
  programs: string[];
  years: string[];
  profYears: Record<number, Year[]> | null;
  profPrograms: Record<number, StudyProgram[]> | null;
}

const initialState: ProfessorState = {
  professors: [],
  status: "idle",
  professorsParams: initParams(),
  filtersLoaded: false,
  professorsLoaded: false,
  //
  professorCourses: {},
  professorThemes: {},
  coursesLoaded: false,
  programs: [],
  years: [],
  profYears: {},
  profPrograms: {},
};

function initParams() {
  return {
    year: "Sve",
    program: "Sve",
  };
}

function getAxiosParams(professorsParams: ProfessorsParams) {
  const params = new URLSearchParams();

  if (professorsParams.searchTerm)
    params.append("searchTerm", professorsParams.searchTerm.toString());
  if (professorsParams.program)
    params.append("program", professorsParams.program.toString());
  if (professorsParams.year)
    params.append("year", professorsParams.year.toString());
  return params;
}

//za kurseve profesora iskoristila metodu iz courseSlice jer je ovdje pod tim imenom druga metoda
export const fetchProfessorYearsProgramsAsync = createAsyncThunk<
  void,
  { id: number; totalCount: number }
>(
  "professor/fetchProfessorYearsProgramsAsync",
  async ({ id, totalCount }, thunkAPI) => {
    try {
      const { years, programs } =
        await agent.Professor.getProfessorYearsPrograms(id);
      const professorCourses = await agent.Course.getProfessorCourses(id);

      thunkAPI.dispatch(
        setProfessorCourses({
          professorId: id,
          years: years,
          programs: programs,
          courses: professorCourses,
          totalCount: totalCount, // Dodaj ukupni broj profesora
        })
      );
    } catch (error: any) {
      console.error(error.data);
      throw error;
    }
  }
);



export const deleteProfessorsThemeAsync = createAsyncThunk<
  { id: number; idProfessor: number }, 
  { id: number; idProfessor: number }, 
  { state: RootState }
>("theme/deleteProfessorsTheme", async ({ id, idProfessor }, thunkAPI) => {
  try {
    await agent.Theme.deleteTheme(id);
    
    return { id, idProfessor };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteProfessorsCourseAsync = createAsyncThunk<
  { id: number; idProfessor: number }, 
  { id: number; idProfessor: number }, 
  { state: RootState }
>("course/deleteProfessorsCourseAsync", async ({ id, idProfessor }, thunkAPI) => {
  try {
    await agent.Course.deleteCourse(id);
    
    return { id, idProfessor };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchProfessorThemesAsync = createAsyncThunk<void, number>(
  "professor/fetchProfessorThemesAsync",
  async (id, thunkAPI) => {
    try {
      // const { themes } =
      //   await agent.Professor.getProfessorThemes(id);
      const professorThemes = await agent.Theme.getProfessorThemes(id);

      thunkAPI.dispatch(
        setProfessorThemes({
          professorId: id,
          themes: professorThemes,
        })
      );
    } catch (error: any) {
      console.error(error.data);
      throw error;
    }
  }
);

export const fetchProfessorsAsync = createAsyncThunk<
  Professor[],
  void,
  { state: RootState }
>("professor/fetchProfessorsAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().professor.professorsParams);
  try {
    const professors = await agent.Professor.GetAllProfessors(params);
    thunkAPI.dispatch(setProfessors(professors));
    return professors;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchFilters = createAsyncThunk(
  "professor/fetchFilters",
  async (_, thunkAPI) => {
    try {
      const filters = agent.Professor.fetchFilters();

      return filters;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
interface UpdateThemeDto {
  id: number;
  active: boolean;
}

export const updateThemeStatus = createAsyncThunk<void, UpdateThemeDto>(
  "theme/updateTheme",
  async (themeData, thunkAPI) => {
    try {
      const themeDto = await agent.Theme.updateTheme(themeData); // Pozivanje agenta sa parametrima
      const professorThemes = await agent.Theme.getProfessorThemes(themeDto.user.id);

      // console.log(professorThemes);

      thunkAPI.dispatch(
        setProfessorThemes({
          professorId: themeDto.user.id,
          themes: professorThemes,
        })
      );
      // return themeDto;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const professorSlice = createSlice({
  name: "professor",
  initialState,
  reducers: {
    setProfessors: (state, action) => {
      state.professors = action.payload;
      state.professorsLoaded = true;
    },
    setProfessorsParams: (state, action) => {
      state.professorsLoaded = false;
      state.professorsParams = {
        ...state.professorsParams,
        ...action.payload,
      };
    },
    resetProfessorsParams: (state) => {
      state.professorsParams = initParams();
    },
    setProfessorCourses: (state, action) => {
      state.profYears![action.payload.professorId] = action.payload.years;
      state.profPrograms![action.payload.professorId] = action.payload.programs;
      state.professorCourses![action.payload.professorId] =
        action.payload.courses;

      if (state.profYears !== null) {
        const allCoursesLoaded =
          Object.keys(state.profYears).length === action.payload.totalCount;
        state.coursesLoaded = allCoursesLoaded;
      }
    },
    setProfessorThemes: (state, action) => {
      state.professorThemes![action.payload.professorId] =
        action.payload.themes;
    },
    setCoursesLoaded: (state, action) => {
      state.coursesLoaded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfessorsAsync.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchProfessorsAsync.fulfilled, (state) => {
      state.status = "idle";
      state.professorsLoaded = true;
    });
    builder.addCase(fetchProfessorsAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.years = action.payload.years;
      state.programs = action.payload.programs;
      state.status = "idle";
      state.filtersLoaded = true;
    });
    builder.addCase(fetchFilters.rejected, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(updateThemeStatus.pending, (state) => {
      state.status = "pendingUpdateTheme";
    });
    builder.addCase(updateThemeStatus.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(fetchProfessorYearsProgramsAsync.pending, (state) => {
      state.status = "pendingFetchProfessorCoursesAsync";
      state.coursesLoaded = false;
    });
    builder.addCase(fetchProfessorYearsProgramsAsync.rejected, (state) => {
      //state.loading = false;
      state.status = "idle";
    });
    builder.addCase(fetchProfessorYearsProgramsAsync.fulfilled, (state) => {
      //state.loading = false; // Postavi loading na true
      // state.coursesLoaded = true;
      state.status = "idle";
    });
    builder.addCase(deleteProfessorsThemeAsync.fulfilled, (state, action) => {
      
      state.status = "idle";
      state.professorThemes![action.payload.idProfessor] = state.professorThemes![action.payload.idProfessor].filter(
        (theme) => theme.id !== action.payload.id
      );

    });
    builder.addCase(deleteProfessorsCourseAsync.fulfilled, (state, action) => {
      
      state.status = "idle";
      state.professorCourses![action.payload.idProfessor] = state.professorCourses![action.payload.idProfessor].filter(
        (course) => course.id !== action.payload.id
      );
      
      state.professorThemes![action.payload.idProfessor] = state.professorThemes![action.payload.idProfessor].filter(
        (theme) => theme.course?.id !== action.payload.id
      );
    });
    
    
  },
});

export const {
  setProfessors,
  setProfessorsParams,
  setProfessorCourses,
  resetProfessorsParams,
  setCoursesLoaded,
  setProfessorThemes,
} = professorSlice.actions;
