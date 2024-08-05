import { Context, createContext, useContext } from "react";

export const createStrictContext = <T>() => {
  return createContext<T | null>(null);
};

export const useStrictContext = <T>(context: Context<T | null>) => {
  const value = useContext(context);

  if (value === null) {
    throw new Error("Strict context not passed");
  }

  return value;
};
