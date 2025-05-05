import { useContext, createContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageId, setPageId] = useState(null);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleButton = () => {
    setIsSidebarOpen(true);
  };

  return (
    <GlobalContext.Provider
      value={{
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        toggleButton,
        pageId,
        setPageId,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
