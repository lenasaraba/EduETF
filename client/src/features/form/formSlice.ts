import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateForm, Form } from "../../app/models/form";
import { RootState } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import { VolunteerActivismOutlined } from "@mui/icons-material";

export interface FormState {
  forms: Form[] | null;
  formsLoaded: boolean;
  status: string;
  courseForms: Form[] | null;
  messageForms: Form[] | null;
}
const initialState: FormState = {
  forms: null,
  formsLoaded: false,
  status: "idle",
  courseForms: null,
  messageForms: null,
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

export const fetchFormsByThemeIdAsync = createAsyncThunk<
  Form[],
  number,
  { state: RootState }
>("form/fetchFormsByThemeIdAsync", async (id, thunkAPI) => {
  try {
    const forms = await agent.Form.messageForms(id);
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

interface AssignForm {
  formId: number;
  courseId: number;
}

export const assignToCourse = createAsyncThunk<Form, AssignForm>(
  "form/assignToCourse",
  async (formData, thunkAPI) => {
    try {
      console.log(formData);
      const response = await agent.Form.assignToCourse(
        formData.formId,
        formData.courseId
      ); // Koristite agent za slanje zahteva
      console.log(response);
      return response; // Vraćamo odgovor sa backend-a
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data }); // Greška
    }
  }
);

interface AssignFormMessage {
  formId: number;
  messageId: number;
}

export const assignToMessage = createAsyncThunk<Form, AssignFormMessage>(
  "form/assignToMessage",
  async (formData, thunkAPI) => {
    try {
      console.log(formData);
      const response = await agent.Form.assignToMessage(
        formData.formId,
        formData.messageId
      ); // Koristite agent za slanje zahteva
      console.log(response);
      return response; // Vraćamo odgovor sa backend-a
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data }); // Greška
    }
  }
);

export const deleteFormAsync = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("course/deleteForm", async (id, thunkAPI) => {
  try {
    await agent.Form.deleteForm(id);
    // console.log(thunkAPI.fulfillWithValue(id))
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const vote = createAsyncThunk<Form, number[]>(
  "form/vote",
  async (optionIds, thunkAPI) => {
    try {
      console.log(optionIds);
      const response = await agent.Form.vote(optionIds); // Koristite agent za slanje zahteva
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
      // state.formsLoaded = true;
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
    builder.addCase(createForm.pending, (state, action) => {
      const { messageId } = action.meta.arg; // messageId dolazi iz `createForm`
      console.log(action.meta.arg);
      if (messageId) state.status = messageId!.toString();
    });
    builder.addCase(createForm.fulfilled, (state, action) => {
      state.status = "idle";
      // if (state.forms?.length) state.forms = [];
      // state.forms.push(action.payload);
      state.forms = state.forms || [];
      state.forms.push(action.payload);
      if (action.payload.courseId != null) {
        state.courseForms = state.courseForms || [];
        state.courseForms.push(action.payload);
      }

      if (action.payload.messageId != null) {
        state.messageForms = state.messageForms || [];
        state.messageForms.push(action.payload);
      }

      console.log(action.payload);
      // state.forms = action.payload;
    });
    builder.addCase(createForm.rejected, (state) => {
      state.status = "rejectedCreateForm";
    });
    builder.addCase(assignToCourse.pending, (state) => {
      state.status = "pendingAssignToCourse";
    });
    builder.addCase(assignToCourse.fulfilled, (state, action) => {
      state.status = "idle";
      // if (state.forms?.length) state.forms = [];
      // state.forms.push(action.payload);
      if (!state.courseForms) state.courseForms = [];
      state.courseForms?.push(action.payload);
      const form = state.forms?.find((f) => f.id == action.payload.id);
      if (form) form.courseId = action.payload.courseId;
      // state.forms = action.payload;
    });
    builder.addCase(assignToCourse.rejected, (state) => {
      state.status = "rejectedAssignToCourse";
    });
    builder.addCase(vote.pending, (state) => {
      state.status = "pendingVote";
    });
    builder.addCase(vote.fulfilled, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
      // if (state.forms?.length) state.forms = [];
      // state.forms.push(action.payload);
      // if (!state.courseForms) state.courseForms = [];
      // state.courseForms?.push(action.payload);
      const form = state.courseForms?.find((f) => f.id == action.payload.id);
      if (form) form.options = action.payload.options;
      const formMess = state.messageForms?.find(
        (f) => f.id == action.payload.id
      );
      if (formMess) formMess.options = action.payload.options;
      // state.forms = action.payload;
    });
    builder.addCase(vote.rejected, (state) => {
      state.status = "rejectedVote";
    });

    builder.addCase(assignToMessage.pending, (state, action) => {
      const { messageId } = action.meta.arg; // messageId dolazi iz `createForm`
      console.log(action.meta.arg);
      if (messageId) state.status = messageId!.toString();
    });
    builder.addCase(assignToMessage.fulfilled, (state, action) => {
      state.status = "idle";
      if (!state.messageForms) state.messageForms = [];
      state.messageForms?.push(action.payload);
      const form = state.forms?.find((f) => f.id == action.payload.id);
      if (form) form.messageId = action.payload.messageId;
    });
    builder.addCase(assignToMessage.rejected, (state) => {
      state.status = "rejectedassignToMessage";
    });
    builder.addCase(fetchFormsByThemeIdAsync.pending, (state) => {
      state.status = "pendingFetchFormsByThemeId";
    });
    builder.addCase(fetchFormsByThemeIdAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.formsLoaded = true;
      console.log(action.payload);
      state.messageForms = action.payload;
    });
    builder.addCase(fetchFormsByThemeIdAsync.rejected, (state) => {
      state.status = "rejectedFetchFormsByThemeId";
    });
    builder.addCase(deleteFormAsync.pending, (state) => {
      state.status = "pendingDeleteForm";
    });
    builder.addCase(deleteFormAsync.fulfilled, (state, action) => {
      state.status = "idle";
      if (state.courseForms)
        state.courseForms = state.courseForms.filter(
          (form) => form.id !== action.payload
        );
    });
    builder.addCase(deleteFormAsync.rejected, (state) => {
      state.status = "rejectedDeleteForm";
    });
  },
});

// export const{

// }=formSlice.acions;
