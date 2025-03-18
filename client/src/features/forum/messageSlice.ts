import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { CreateMessage, Message } from "../../app/models/theme";
import { RootState } from "../../app/store/configureStore";

export interface MessageState {
  messages: Message[] | null;
  status: string;
  messagesLoaded: boolean;
  resultMessages: Message[] | null;
}

const initialState: MessageState = {
  messages: [],
  status: "idle",
  messagesLoaded: false,
  resultMessages: [],
};

export const fetchMessagesAsync = createAsyncThunk<
  Message[],
  number
>("message/fetchMessagesAsync", async (id, thunkAPI) => {
  const messages = await agent.Message.getAll(id);
  return messages;
});

interface MessageRequest {
  themeId: number;
  query: string;
}

export const searchMessagesAsync = createAsyncThunk<Message[], MessageRequest>(
  "message/searchMessagesAsync",
  async (query, thunkAPI) => {
    const messagesA = await agent.Message.searchMessage(
      query.themeId,
      query.query
    );
    return messagesA;
  }
);

export const createMessage = createAsyncThunk<Message, CreateMessage>(
  "messages/createMessage",
  async (newMessage, { rejectWithValue }) => {
    try {
      const response = await agent.Message.createMessage(newMessage);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(error);
    }
  }
);

export const uploadFile = createAsyncThunk(
  "message/uploadFile",
  async (
    {
      file,
      themeId,
    }: {
      file: File;
      themeId: number;
    },
    thunkAPI
  ) => {
    try {
      const response = await agent.Message.uploadMessageMaterial(file, themeId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
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
      state.messages![action.payload.themeId] = action.payload.messagesTheme;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessagesAsync.pending, (state) => {
      state.status = "pendingFetchMessages";
      state.messagesLoaded = false;
    });
    builder.addCase(fetchMessagesAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.messages = action.payload;
      state.messagesLoaded = true;
    });
    builder.addCase(fetchMessagesAsync.rejected, (state) => {
      state.status = "rejected";
      state.messagesLoaded = true;
    });
    builder.addCase(createMessage.pending, (state) => {
      state.status = "pendingCreateMessage";
    });
    builder.addCase(createMessage.fulfilled, (state, action) => {
      state.status = "idle";

      if (!state.messages) {
        state.messages = []; 
      }

      state.messages.push(action.payload);
    });
    builder.addCase(createMessage.rejected, (state) => {
      state.status = "rejectedCreate";
    });
    builder.addCase(deleteMessageAsync.pending, (state) => {
      state.status = "pendingDeleteMessage";
    });
    builder.addCase(deleteMessageAsync.fulfilled, (state, action) => {
      state.status = "idle";
      
      if (state.messages)
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload
        );
    });
    builder.addCase(deleteMessageAsync.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(searchMessagesAsync.fulfilled, (state, action) => {
      state.status = "fulfilledMessages";
      state.resultMessages = action.payload;
    });
  },
});
export const { setMessages } = messageSlice.actions;
