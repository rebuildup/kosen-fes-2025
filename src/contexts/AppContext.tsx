// src/contexts/AppContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface AppState {
  searchQuery: string;
  activeCategory: string;
  loading: boolean;
}

type AppAction =
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_ACTIVE_CATEGORY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AppState = {
  searchQuery: "",
  activeCategory: "all",
  loading: false,
};

const AppContext = createContext<
  | {
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
    }
  | undefined
>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_ACTIVE_CATEGORY":
      return { ...state, activeCategory: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
