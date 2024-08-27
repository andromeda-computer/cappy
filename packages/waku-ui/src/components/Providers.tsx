"use client";

import { createStore, Provider } from "jotai";
import { ReactNode } from "react";

type ProvidersProps = { children: ReactNode };

const store = createStore();

export const Providers = ({ children }: ProvidersProps) => {
  return <Provider store={store}>{children}</Provider>;
};
