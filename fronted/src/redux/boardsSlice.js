import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL = 'https://kanbanfrenzy.up.railway.app/api/v1/auth/';

export const fetchRBoards = createAsyncThunk('frenzy/Boards', async () => {
  const res = await fetch(`${URL}boards`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      token: localStorage.getItem('token'),
    },
  });
  const data = await res.json();
  if (data.length > 0) data[0]["isActive"] = true;
  return data;
},
);

export const updateBoard = createAsyncThunk(
  'frenzy/update',
  async (board) => {
    await fetch(`${URL}update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
      body: JSON.stringify(board),
    });
  },
);

export const createBoard = createAsyncThunk(
  'frenzy/update',
  async (board) => {
    await fetch(`${URL}create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
      body: JSON.stringify(board),
    });
  },
);

export const shareBoard = createAsyncThunk(
  'frenzy/update',
  async (body) => {
    await fetch(`${URL}share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
      body: JSON.stringify(body),
    });
  },
);

export const deleteBoard = createAsyncThunk(
  'frenzy/update',
  async (id) => {
    await fetch(`${URL}delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token'),
      },
    });
  },
);

export const boardDetails = createAsyncThunk(
  'frenzy/update',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const board = state.boards.find((board) => board.isActive)
    dispatch(updateBoard({...board, isActive: false}));
  },
);

const boardsSlice = createSlice({
  name: "boards",
  initialState: null,
  reducers: {
    addBoard: (state, action) => {
      const isActive = state.length > 0 ? false : true;
      const payload = action.payload;
      const board = {
        name: payload.name,
        isActive,
        columns: [],
      };
      board.columns = payload.newColumns;
      state.push(board);
    },
    editBoard: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      board.name = payload.name;
      board.columns = payload.newColumns;
    },
    deleteBoard: (state) => {
      const board = state.find((board) => board.isActive);
      state.splice(state.indexOf(board), 1);
    },
    setBoardActive: (state, action) => {
      state.map((board, index) => {
        index === action.payload.index
          ? (board.isActive = true)
          : (board.isActive = false);
        return board;
      });
    },
    addTask: (state, action) => {
      const { title, color, status, description, subtasks, newColIndex } =
        action.payload;
      const task = { title, description, subtasks, status, color };
      const board = state.find((board) => board.isActive);
      const column = board.columns.find((col, index) => index === newColIndex);
      column.tasks.push(task);
    },
    editTask: (state, action) => {
      const {
        title,
        color,
        status,
        description,
        subtasks,
        prevColIndex,
        newColIndex,
        taskIndex,
      } = action.payload;
      const board = state.find((board) => board.isActive);
      const column = board.columns.find((col, index) => index === prevColIndex);
      const task = column.tasks.find((task, index) => index === taskIndex);
      task.title = title;
      if (color != "") task.color = color;
      task.status = status;
      task.description = description;
      task.subtasks = subtasks;
      if (prevColIndex === newColIndex) return;
      column.tasks = column.tasks.filter((task, index) => index !== taskIndex);
      const newCol = board.columns.find((col, index) => index === newColIndex);
      newCol.tasks.push(task);
    },
    dragTask: (state, action) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const board = state.find((board) => board.isActive);
      const prevCol = board.columns.find((col, i) => i === prevColIndex);
      const task = prevCol.tasks.splice(taskIndex, 1)[0];
      board.columns.find((col, i) => i === colIndex).tasks.push(task);
    },
    setSubtaskCompleted: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board.columns.find((col, i) => i === payload.colIndex);
      const task = col.tasks.find((task, i) => i === payload.taskIndex);
      const subtask = task.subtasks.find((subtask, i) => i === payload.index);
      subtask.isCompleted = !subtask.isCompleted;
    },
    setTaskStatus: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const columns = board.columns;
      const col = columns.find((col, i) => i === payload.colIndex);
      if (payload.colIndex === payload.newColIndex) return;
      const task = col.tasks.find((task, i) => i === payload.taskIndex);
      task.status = payload.status;
      col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
      const newCol = columns.find((col, i) => i === payload.newColIndex);
      newCol.tasks.push(task);
    },
    deleteTask: (state, action) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board.columns.find((col, i) => i === payload.colIndex);
      col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRBoards.fulfilled, (state, action) => action.payload);
  },
});

export default boardsSlice;
