"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Keep server and hydration output stable without a state-setting mount effect. */
export function useClientReady(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
