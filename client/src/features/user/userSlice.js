import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const themes = {
  cupcake: "cupcake",
  dracula: "dracula",
};

// const getUserFromLocalStorage = () => {
//   return JSON.parse(localStorage.getItem("user")) || null;
// };

const getUserFromLocalStorage = () => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem("theme") || themes.cupcake;
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
};

const initialState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const user = action.payload;
      if (user) {
        state.user = user;
        localStorage.setItem("user", JSON.stringify(user)); // Ensure this is setting correctly
      } else {
        console.error("User data is undefined or null");
        state.user = null;
        localStorage.removeItem("user");
      }
    },

    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    },
    toggleTheme: (state) => {
      const { dracula, cupcake } = themes;
      state.theme = state.theme === dracula ? cupcake : dracula;
      document.documentElement.setAttribute("data-theme", state.theme);
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { loginUser, logoutUser, toggleTheme } = userSlice.actions;

export default userSlice.reducer;
