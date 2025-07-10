import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const themes = {
  cupcake: "cupcake",
  dracula: "dracula",
};

const getUserFromLocalStorage = () => {
  const userString = localStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

const getThemeFromLocalStorage = () => {
  const user = getUserFromLocalStorage();
  const theme = user?.theme || localStorage.getItem("theme") || themes.cupcake;
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
        state.theme = user.theme;
        document.documentElement.setAttribute("data-theme", state.theme); // Apply theme to the page
        localStorage.setItem("user", JSON.stringify(user)); // Ensure this is setting correctly
        localStorage.setItem("theme", user.theme);
      } else {
        console.error("User data is undefined or null");
        state.user = null;
        state.theme = themes.cupcake; // Reset to default theme
        document.documentElement.setAttribute("data-theme", themes.cupcake);
        localStorage.removeItem("user");
        localStorage.setItem("theme", themes.cupcake);
      }
    },

    logoutUser: (state) => {
      state.user = null;
      state.theme = "cupcake";
      document.documentElement.setAttribute("data-theme", themes.cupcake);
      localStorage.removeItem("user");
      localStorage.setItem("theme", themes.cupcake);
    },
    toggleTheme: (state) => {
      const { dracula, cupcake } = themes;
      state.theme = state.theme === dracula ? cupcake : dracula;
      if (state.user) {
        state.user.theme = state.theme; // Update user.theme in state
        localStorage.setItem("user", JSON.stringify(state.user)); // Update user in localStorage
        document.documentElement.setAttribute("data-theme", state.theme);
        localStorage.setItem("theme", state.theme);
      }
    },
  },
});

export const { loginUser, logoutUser, toggleTheme } = userSlice.actions;

export default userSlice.reducer;
