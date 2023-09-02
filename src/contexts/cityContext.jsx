import { createContext, useCallback, useContext, useReducer } from "react";
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:9000";
const cityContext = createContext();

const initalState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type..");
  }
}
function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initalState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // setCities(data);
        dispatch({ type: "cities/loaded", payload: data });
        console.log(data);
      } catch {
        dispatch({
          type: "rejected",
          action: "Unknown Error while loading data",
        });
      }
    }
    fetchCities();
  }, []);

  const getCities = useCallback(
    async function getCities(id) {
      if (Number(id) === currentCity.id) return; //call same country to be cached
      dispatch({ type: "loading" });
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
        // setCurrentCity(data);
        //   console.log(data);
      } catch {
        dispatch({
          type: "rejected",
          action: "Unknown Error while loading data",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-type": "application/json" },
      });
      const data = await res.json();
      // console.log(data);
      // setCities((cities) => [...cities, newCity]);
      dispatch({ type: "city/created", payload: newCity });
    } catch {
      dispatch({
        type: "rejected",
        action: "Unknown Error while loading data",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      // setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      // setCurrentCity(data);
      // console.log(data);
      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        action: "Unknown Error while loading data",
      });
    }
  }

  // function handleAddCity(newCity) {
  //   // setCurrentCity((current) => [...current, newCity]);
  //   setCities((cities) => [...cities, newCity]);
  // }

  // function handleDelete(id) {
  //   setCities((city) => city.filter((cities) => cities.id !== id));
  // }

  return (
    <cityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCities,
        // onDelete: handleDelete,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </cityContext.Provider>
  );
}
function useCities() {
  const context = useContext(cityContext);
  if (context === undefined)
    throw new Error("Context used outside of the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
