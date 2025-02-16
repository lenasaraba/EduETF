import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Message } from "../../app/models/theme";
import { RootState } from "../../app/store/configureStore";

export interface MessageState {
  messages: Record<number, Message[]> | null;
  status: string;
  messagesLoaded: boolean;
}

const initialState: MessageState = {
  messages: {},
  status: "idle",
  messagesLoaded:false,
};

interface MessagesResponse{
  messages: Message[],
  themeId: number,
}
export const fetchMessagesAsync = createAsyncThunk<MessagesResponse, number>(
  "message/fetchMessagesAsync",
  async (id, thunkAPI) => {
    const messages = await agent.Message.getAll(id);
    console.log(messages);
    // thunkAPI.dispatch(setMessages({ themeId: id, messagesTheme: messages }));
    return {messages:messages,themeId:id};
  }
);

// interface MessageResponse{
//   message: Message
//   themeId: number;
// }

export const createMessage = createAsyncThunk<Message, Message>(
  "messages/createMessage",
  async (newMessage, { rejectWithValue }) => {
    try {
      console.log(newMessage);
      const response = await agent.Message.createMessage(newMessage);
      console.log(response);
      return response.data; 
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
    builder.addCase(fetchMessagesAsync.pending, (state)=>{
      state.status="pendingFetchMessages";
      state.messagesLoaded=false;
    });
    builder.addCase(fetchMessagesAsync.fulfilled, (state, action)=>{
      state.status="idle";
      state.messages![action.payload.themeId] = action.payload.messages;
      state.messagesLoaded=true;
    });
    builder.addCase(fetchMessagesAsync.rejected, (state)=>{
      state.status="rejected";
      state.messagesLoaded=true;

    });
    builder.addCase(createMessage.pending, (state)=>{
      state.status="pendingCreateMessage";
    });
    builder.addCase(createMessage.fulfilled, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    
      if (!state.messages) {
        state.messages = {}; // Inicijalizuj ako ne postoji
      }
    
      if (!state.messages[action.payload.themeId]) {
        state.messages[action.payload.themeId] = []; // Inicijalizuj niz ako ne postoji
      }
    
      state.messages[action.payload.themeId].push(action.payload);
    });
    builder.addCase(createMessage.rejected, (state)=>{
      state.status="rejectedCreate";
      // state.messagesLoaded=true;

    });
    builder.addCase(deleteMessageAsync.pending, (state)=>{
      state.status="pendingDeleteMessage";
    })
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
    builder.addCase(deleteMessageAsync.rejected, (state)=>{
      state.status="rejected";
    })
  },
});
export const { setMessages } = messageSlice.actions;
