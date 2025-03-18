/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";
import { router } from "../../app/router/Routes";

interface AccountState {
  user: User | null; 
  status: string;
}

const initialState: AccountState = {
  user: null, 
  status: "idle",
};

export const signInUser = createAsyncThunk<User, FieldValues>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.login(data);
      const { ...user } = userDto;
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {

      try {
        const userDto = await agent.Account.currentUser();
        const { ...user } = userDto;
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      } catch (error: any) {
        return thunkAPI.rejectWithValue({ error: error.data });
      }
  }
);

export const logout = createAsyncThunk(
  "account/logout",
  async (_, thunkAPI) => {
    try {
      await agent.Account.logout();
      localStorage.removeItem("user");
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

interface UserToken {
  userId: number;
  token: string;
}

export const sendTokenToBackend = createAsyncThunk<void, UserToken>(
  "firebase/sendTokenToBackend",
  async (userToken, { rejectWithValue }) => {
    try {
       await agent.Firebase.addToken({
        userId: userToken.userId,
        token: userToken.token,
      });

    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
interface UpdateUserDto {
  firstName: string;
  lastName: string;
}
export const updateUser = createAsyncThunk<User, UpdateUserDto>(
  "account/updateUser",
  async (userData, thunkAPI) => {
    try {
      const userDto = await agent.Account.updateUser(userData); 
      const { ...user } = userDto;
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInUser.rejected, (_state, action) => {
      throw action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");

      router.navigate("/");
    });

    builder.addCase(updateUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");

      router.navigate("/");
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.status = "idle";
      state.user!.firstName = action.payload.firstName;
      state.user!.lastName = action.payload.lastName;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.status = "pendingUpdateUser";
    });
    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        state.user = action.payload;
      }
    );
  },
});

export const {setUser } = accountSlice.actions;
