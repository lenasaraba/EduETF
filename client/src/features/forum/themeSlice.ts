import {
  createAsyncThunk,
  createSlice,
  isAction,
  PayloadAction,
} from "@reduxjs/toolkit";
import { CreateTheme, Theme, ThemesParams } from "../../app/models/theme";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

export interface ThemeState {
  themes: Theme[];
  currentTheme: Theme | null;
  status: string;
  themesParams: ThemesParams;
  filtersLoaded: boolean;
  themesLoaded: boolean;
  category: string[];
  themeStatus: string[];
  currentThemeLoaded: boolean;
}

const initialState: ThemeState = {
  themes: [],
  currentTheme: null,
  status: "idle",
  themesParams: initParams(),
  filtersLoaded: false,
  themesLoaded: false,
  category: [],
  themeStatus: [],
  currentThemeLoaded: false,
};

function initParams() {
  return {
    // pageNumber: 1,
    // pageSize: 6,
    // orderBy: "name",
    type: "all",
    category: "all",
    themeStatus: "all",
  };
}

function getAxiosParams(themesParams: ThemesParams) {
  const params = new URLSearchParams();

  if (themesParams.themeStatus)
    params.append("themeStatus", themesParams.themeStatus.toString());
  if (themesParams.searchTerm)
    params.append("searchTerm", themesParams.searchTerm.toString());
  if (themesParams.category)
    params.append("category", themesParams.category.toString());
  if (themesParams.type) params.append("type", themesParams.type.toString());
  return params;
}

export const fetchThemesAsync = createAsyncThunk<
  Theme[],
  void,
  { state: RootState }
>("theme/fetchThemesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().theme.themesParams);
  try {
    const themes = await agent.Theme.getAll(params);
    // thunkAPI.dispatch(setThemes(themes));
    return themes;
  } catch (error: any) {
    console.log(error.data);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchThemeByIdAsync = createAsyncThunk<Theme, number>(
  "theme/fetchThemeByIdAsync",
  async (id, thunkAPI) => {
    try {
      const theme = await agent.Theme.getTheme(id);
      console.log(theme);
      return theme;
    } catch (error: any) {
      console.log(error);
      console.log(error.data);
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchFilters = createAsyncThunk(
  "theme/fetchFilters",
  async (_, thunkAPI) => {
    try {
      return agent.Theme.fetchFilters();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const createThemeAsync = createAsyncThunk<Theme, CreateTheme>(
  "messages/createTheme",
  async (newTheme, thunkAPI) => {
    try {
      console.log(newTheme.date);
      const response = await agent.Theme.create(newTheme);
      console.log(response);
      return response.data; // Ovo vraća listu poruka sa servera
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

interface UpdateThemeDto {
  id: number;
  active: boolean;
}

export const updateThemeStatus = createAsyncThunk<Theme, UpdateThemeDto>(
  "theme/updateTheme",
  async (themeData, thunkAPI) => {
    try {
      const themeDto = await agent.Theme.updateTheme(themeData); // Pozivanje agenta sa parametrima
      console.log(themeDto);
      return themeDto;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteThemeAsync = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("theme/deleteTheme", async (id, thunkAPI) => {
  try {
    await agent.Theme.deleteTheme(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemes: (state, action) => {
      state.themes = action.payload;
    },
    setThemesParams: (state, action) => {
      // state.themesLoaded = false;
      state.themesParams = {
        ...state.themesParams,
        ...action.payload,
      };
      // console.log(state.themesParams);
    },
    resetThemesParams: (state) => {
      state.themesParams = initParams();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      createThemeAsync.fulfilled,
      (state, action: PayloadAction<Theme>) => {
        state.status = "succeeded";
        if (state.themes.length > 0) {
          state.themes.push(action.payload);
        } else {
          state.themes = [action.payload];
        }
        state.currentTheme = action.payload;
      }
    );
    builder.addCase(fetchFilters.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.category = action.payload.categories;
      state.themeStatus = action.payload.activeStatus;
      state.status = "idle";
      state.filtersLoaded = true;
    });
    builder.addCase(fetchFilters.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(fetchThemesAsync.pending, (state) => {
      state.status = "pendingFetchThemes";
      state.themesLoaded = false;
    });
    builder.addCase(fetchThemesAsync.rejected, (state) => {
      //state.loading = false;
      state.status = "idle";
    });
    builder.addCase(fetchThemesAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.themesLoaded = true;
      state.themes = action.payload;
    });
    builder.addCase(updateThemeStatus.pending, (state) => {
      state.status = "pendingUpdateTheme";
    });
    builder.addCase(updateThemeStatus.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(updateThemeStatus.fulfilled, (state, action) => {
      state.status = "idle";

      const index = state.themes?.findIndex(
        (theme) => theme.id === action.payload.id
      );
      if (state.currentTheme?.id == action.payload.id)
        state.currentTheme.active = action.payload.active;

      if (index !== undefined && index !== -1 && state.themes) {
        state.themes[index] = { ...state.themes[index], ...action.payload };
      }
    });
    builder.addCase(deleteThemeAsync.pending, (state) => {
      state.status = "pendingDeleteTheme";
    });
    builder.addCase(deleteThemeAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.themes = state.themes.filter(
        (theme) => theme.id !== action.payload
      );
    });
    builder.addCase(deleteThemeAsync.rejected, (state) => {
      state.status = "rejectedDelete";
    });
    builder.addCase(fetchThemeByIdAsync.pending, (state) => {
      state.status = "pendingFetchThemeByIdAsync";
      state.currentTheme = null;
      state.currentThemeLoaded = false;
    });
    builder.addCase(fetchThemeByIdAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.currentTheme = action.payload;
      state.currentThemeLoaded = true;
    });
    builder.addCase(fetchThemeByIdAsync.rejected, (state, action) => {
      console.log(action.payload);

      if (action.payload.error?.status == 401)
        state.status = "rejectedUnauthorized";
      else if (action.payload.error?.status == 404)
        state.status = "rejectedNotFound";

      state.currentTheme = null;

      state.currentThemeLoaded = false;
    });
  },
});
export const { setThemes, setThemesParams, resetThemesParams } =
  themeSlice.actions;
