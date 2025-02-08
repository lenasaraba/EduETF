import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Message } from "../../app/models/theme";
import { RootState } from "../../app/store/configureStore";

export interface MessageState {
  messages: Record<number, Message[]> | null;
  status: string;
  //loaded ?
}

const initialState: MessageState = {
  messages: {},
  status: "idle",
};

export const fetchMessagesAsync = createAsyncThunk<Message[], number>(
  "message/fetchMessagesAsync",
  async (id, thunkAPI) => {
    const messages = await agent.Message.getAll(id);
    console.log(messages);
    thunkAPI.dispatch(setMessages({ themeId: id, messagesTheme: messages }));
    return messages;
  }
);

export const createMessage = createAsyncThunk<Message[], Message>(
  "messages/createMessage",
  async (newMessage, { rejectWithValue }) => {
    try {
      console.log(newMessage);
      const response = await agent.Message.createMessage(newMessage);
      return response.data; // Ovo vraća listu poruka sa servera
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMessageAsync = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("theme/deleteMessageAsync", async (id, thunkAPI) => {
  try {
    await agent.Message.deleteMessage(id);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      console.log(action.payload);
      state.messages![action.payload.themeId] = action.payload.messagesTheme;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteMessageAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.messages = state.messages
        ? Object.fromEntries(
            Object.entries(state.messages).map(([key, messages]) => [
              Number(key),
              messages.filter((message) => message.id !== action.payload),
            ])
          )
        : null;
    });
  },
});
export const { setMessages } = messageSlice.actions;
