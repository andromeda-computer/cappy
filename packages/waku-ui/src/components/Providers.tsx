"use client";

import { createStore, Provider } from "jotai";
import { usernameAtom } from "../atoms";
import { ReactNode } from "react";

type ProvidersProps = { children: ReactNode };

const store = createStore();
store.set(usernameAtom, null);

export const Providers = ({ children }: ProvidersProps) => {
  return <Provider store={store}>{children}</Provider>;
};
