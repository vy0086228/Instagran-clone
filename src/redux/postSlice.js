import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Example API fetch action
export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  const response = await fetch("/api/posts");
  return await response.json();
});

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
  },
  reducers: {
    //actions
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
  },
});
export const { setPosts } = postSlice.actions;

export default postSlice.reducer;
