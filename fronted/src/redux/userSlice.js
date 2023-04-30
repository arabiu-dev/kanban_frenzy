import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createBoard, fetchRBoards } from "./boardsSlice";
import examples from "../data.json";
const SIGNUP_URL = "https://kanbanfrenzy.up.railway.app/api/v1/signup";
const LOGIN_URL = "https://kanbanfrenzy.up.railway.app/api/v1/signin";
const USER_SIGNED = "user_signup";
const USER_LOGGED = "user_login";
const USER_LOGGEDOUT = "user_loggedout";

// User login and signup helper function
const userAuth = async (url, userInfo) => {
  const data = await fetch(url, {
    method: "post",
    mode: "cors",
    headers: {
      Accept: "*/*",
    },
    body: JSON.stringify(userInfo),
  })
    .then((res) => {
      if (res.ok) {
        localStorage.setItem("token", res.headers.get("token"));
        sessionStorage.setItem("userLogged", res.ok);
        return res.json();
      }
      return res.json().then((response) => {
        throw new Error(response.error);
      });
    })
    .then((res) => res)
    .catch((error) => {
      return { error: error.message };
    });
  return data;
};

// User SignUp thunk
export const userSignUp = createAsyncThunk(
  USER_SIGNED,
  async (userInfo, { dispatch, rejectWithValue }) => {
    const data = await userAuth(SIGNUP_URL, userInfo);
    if (sessionStorage.getItem("userLogged")) {
      await dispatch(createBoard(examples.boards[0]));
      await dispatch(createBoard(examples.boards[1]));
    }
    if (data["error"]) return rejectWithValue(data);

    return data;
  }
);

// User Login thunk
export const userLogin = createAsyncThunk(
  USER_LOGGED,
  async (userInfo, { dispatch, rejectWithValue }) => {
    const data = await userAuth(LOGIN_URL, userInfo);
    if (sessionStorage.getItem("userLogged")) {
      await dispatch(fetchRBoards());
    }
    if (data["error"]) return rejectWithValue(data);

    return data;
  }
);

// User Logout thunk
export const userLogout = createAsyncThunk(USER_LOGGEDOUT, async () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("userLogged");
  return {};
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    error: "",
    username: "",
    isLogged: false,
    requestLoading: false,
  },
  reducers: {
    setUserLogged: (state, action) => {
      return { ...state, isLogged: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSignUp.fulfilled, (state, action) => ({
      ...state,
      error: "Valid",
      username: action.payload.username,
      isLogged: action.payload.username != undefined,
      requestLoading: false,
    }));
    builder.addCase(userSignUp.pending, (state, action) => ({
      ...state,
      requestLoading: true,
    }));
    builder.addCase(userLogin.pending, (state, action) => ({
      ...state,
      requestLoading: true,
    }));
    builder.addCase(userLogin.fulfilled, (state, action) => ({
      ...state,
      error: "Valid",
      username: action.payload.username,
      isLogged: action.payload.username != undefined,
      requestLoading: false,
    }));
    builder.addCase(userLogout.fulfilled, (state, action) => ({
      ...state,
      username: "",
      error: "",
      isLogged: false,
    }));
    builder.addCase(userSignUp.rejected, (state, action) => ({
      ...state,
      error: action.payload.error,
      requestLoading: false,
    }));
    builder.addCase(userLogin.rejected, (state, action) => ({
      ...state,
      error: action.payload.error,
      requestLoading: false,
    }));
  },
});

export default userSlice;
