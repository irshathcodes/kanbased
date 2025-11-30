import {createContext, useContext, useEffect, useState} from "react";

type Theme = "light" | "dark" | "system";
type AppContextValues = {
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  isCmdKOpen: boolean;
  openCmdK: () => void;
  closeCmdK: () => void;
  isOrgSwitchOpen: boolean;
  openOrgSwitch: () => void;
  closeOrgSwitch: () => void;
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
};

const AppContext = createContext<AppContextValues>({} as AppContextValues);

export function AppContextProvider(props: React.PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    return savedTheme || "system";
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrgSwitchOpen, setIsOrgSwitchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const updateTheme = (value: Theme) => {
    const htmlElement = document.documentElement;

    if (value === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      if (systemTheme === "dark") {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    } else if (value === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }

    setTheme(value);
    localStorage.setItem("theme", value);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    handleChange(); // Initial check
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        theme,
        updateTheme,
        isCmdKOpen: isSearchOpen,
        openCmdK: openSearch,
        closeCmdK: closeSearch,
        isOrgSwitchOpen,
        openOrgSwitch: () => setIsOrgSwitchOpen(true),
        closeOrgSwitch: () => setIsOrgSwitchOpen(false),
        isHelpOpen,
        openHelp: () => setIsHelpOpen(true),
        closeHelp: () => setIsHelpOpen(false),
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext should be used within AppContextProvider");
  }

  return context;
}
