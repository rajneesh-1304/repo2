import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { banUser, fetchAllUsers, loginUser, registerUser, unbanUser } from "./service";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UserState {
  userData: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await registerUser(userData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth",
  async (userData: any, { rejectWithValue }) => {
    try {
      return await loginUser(userData);
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchAllUsersThunk = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllUsers();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const banUserThunk = createAsyncThunk(
  'auth/banUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await banUser(userId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to ban user'
      );
    }
  }
);

export const unbanUserThunk = createAsyncThunk(
  'auth/unbanUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await unbanUser(userId);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to unban user'
      );
    }
  }
);


const usersSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    clearUsers: (state) => {
      state.userData = [];
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.userData;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(fetchAllUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsersThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchAllUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(banUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banUserThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userData = state.userData.map(user =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(banUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(unbanUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unbanUserThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.userData = state.userData.map(user =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(unbanUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export const { logout, clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
