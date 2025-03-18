/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";

interface AccountState {
  user: User | null; // Stanje čuva korisničke podatke ili je null ako korisnik nije prijavljen.
  status: string;
}

const initialState: AccountState = {
  user: null, // Početno stanje: korisnik nije prijavljen.
  status: "idle",
};

export const signInUser = createAsyncThunk<User, FieldValues>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.login(data);
      const { ...user } = userDto;
      localStorage.setItem("user", JSON.stringify(user));
      // console.log("USER:    " + user);

      return user;
    } catch (error: any) {
      console.log("-----------------------------------greska");
      console.log(error);
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    // thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    // if (localStorage.getItem("user")) {
      try {
        const userDto = await agent.Account.currentUser();
        const { ...user } = userDto;
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      } catch (error: any) {
        return thunkAPI.rejectWithValue({ error: error.data });
      }
    

    // },
    // {
    //   condition: () => {
    //     if (!localStorage.getItem("user")) {
    //       return false;
    //     }
    //   },
  }
);

export const logout = createAsyncThunk(
  "account/logout",
  async (_, thunkAPI) => {
    // thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
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
      const response = await agent.Firebase.addToken({
        userId: userToken.userId,
        token: userToken.token,
      });
      console.log("Odgovor od backenda:", response);

      if (response.status === 200 && response.data === "Token već postoji.") {
        console.log("Token već postoji u bazi.");
      } else {
        console.log("Token uspješno dodan u bazu.");
      }
    } catch (error: any) {
      console.log("Greška prilikom slanja tokena na backend:", error);
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
      const userDto = await agent.Account.updateUser(userData); // Pozivanje agenta sa parametrima
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
    // signOut: (state) => {
    //   state.user = null;
    //   localStorage.removeItem("user");
    //   router.navigate("/");
    // },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInUser.rejected, (_state, action) => {
      // toast.error("Neuspješna prijava")

      throw action.payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");

      router.navigate("/");
      // toast.error("Odjavljeni ste.");
    });

    builder.addCase(updateUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");

      router.navigate("/");
      // toast.error("Odjavljeni ste.");
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

export const { signOut, setUser } = accountSlice.actions;
