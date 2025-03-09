import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateForm, Form } from "../../app/models/form";
import { RootState } from "../../app/store/configureStore";
import agent from "../../app/api/agent";

export interface FormState {
  forms: Form[] | null;
  formsLoaded: boolean;
  status: string;
  courseForms:Form[]|null;
}
const initialState: FormState = {
  forms: null,
  formsLoaded: false,
  status: "idle",
  courseForms:null,
};

export const fetchAllFormsAsync = createAsyncThunk<
  Form[],
  void,
  { state: RootState }
>("form/fetchAllFormsAsync", async (_, thunkAPI) => {
  try {
    const forms = await agent.Form.allForms();
    console.log(forms);

    return forms;
  } catch (error: any) {
    console.log(error.data);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchFormsByCourseIdAsync = createAsyncThunk<
  Form[],
  number,
  { state: RootState }
>("form/fetchFormsByCourseIdAsync", async (id, thunkAPI) => {
  try {
    const forms = await agent.Form.courseForms(id);
    console.log(forms);

    return forms;
  } catch (error: any) {
    console.log(error.data);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});


export const createForm = createAsyncThunk<Form, CreateForm>(
  "form/createForm",
  async (newForm, thunkAPI) => {
    try {
      console.log(newForm);
      const response = await agent.Form.createForm(newForm); // Koristite agent za slanje zahteva
      console.log(response);
      return response; // Vraćamo odgovor sa backend-a
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data }); // Greška
    }
  }
);

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    //   setMetaData: (state, action) => {
    //     state.metaData = action.payload;
    //   },
    //   resetCoursesParams: (state) => {
    //     state.coursesParams = initParams();
    //   },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllFormsAsync.pending, (state) => {
      state.status = "pendingFetchAllForms";
    });
    builder.addCase(fetchAllFormsAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.formsLoaded = true;
      console.log(action.payload);
      state.forms = action.payload;
    });
    builder.addCase(fetchAllFormsAsync.rejected, (state) => {
      state.status = "rejectedFetchAllForms";
    });
    builder.addCase(fetchFormsByCourseIdAsync.pending, (state) => {
      state.status = "pendingFetchFormsByCourseId";
    });
    builder.addCase(fetchFormsByCourseIdAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.formsLoaded = true;
      console.log(action.payload);
      state.courseForms = action.payload;
    });
    builder.addCase(fetchFormsByCourseIdAsync.rejected, (state) => {
      state.status = "rejectedFetchFormsByCourseId";
    });
    builder.addCase(createForm.pending, (state) => {
      state.status = "pendingCreateForm";
    });
    builder.addCase(createForm.fulfilled, (state, action) => {
      state.status = "idle";
      // if (state.forms?.length) state.forms = [];
      // state.forms.push(action.payload);
      state.forms = state.forms || [];
      state.forms.push(action.payload);
      if(action.payload.courseId!=null){
        state.courseForms = state.courseForms || [];
        state.courseForms.push(action.payload);
      }

      if(action.payload.messageId!=null){
        // state.courseForms = state.courseForms || [];
        // state.courseForms.push(action.payload);
      }
     

      console.log(action.payload);
      // state.forms = action.payload;
    });
    builder.addCase(createForm.rejected, (state) => {
      state.status = "rejectedCreateForm";
    });
  },
});

// export const{

// }=formSlice.acions;
