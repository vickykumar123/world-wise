import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
  name: "Vicky",
  email: "venom@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const initalState = {
  user: null,
  isAuthenticated: false,
  loginFailure: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loginFailure: false,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loginFailure: false,
      };
    case "failure":
      return {
        ...state,
        loginFailure: true,
      };
    default:
      throw new Error("Unknown type");
  }
}
function AuthProvider({ children }) {
  const [{ user, isAuthenticated, loginFailure }, dispatch] = useReducer(
    reducer,
    initalState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    } else {
      dispatch({ type: "failure" });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginFailure,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("Context is used outside of AuthContext");
  return context;
}

export { AuthProvider, useAuth };
