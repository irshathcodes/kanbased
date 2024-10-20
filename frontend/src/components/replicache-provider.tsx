import React, { createContext, useContext, useEffect, useState } from "react";
import { Replicache } from "replicache";
import { nanoid } from "nanoid";
import { mutators, type Mutators } from "@/lib/mutators";

// @ts-expect-error
const ReplicacheContext = createContext<Replicache<Mutators>>();

export type Rep = Replicache<Mutators>;

export function ReplicacheProvider(props: React.PropsWithChildren) {
  const [rep, setRep] = useState<Replicache<Mutators> | null>(null);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = nanoid();
      localStorage.setItem("userId", userId);
    }

    const r = new Replicache({
      // See https://doc.replicache.dev/licensing for how to get a license key.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      licenseKey: process.env.NEXT_PUBLIC_REPLICACHE_LICENSE_KEY!,
      // pushURL: `/api/replicache/push`,
      // pullURL: `/api/replicache/pull`,
      name: userId,
      mutators,
    });

    setRep(r);

    return () => {
      r.close();
    };
  }, []);

  // Always do this Or else bad things happen.
  if (!rep) {
    return null;
  }

  return (
    <ReplicacheContext.Provider value={rep}>
      {props.children}
    </ReplicacheContext.Provider>
  );
}

export function useRepContext() {
  const context = useContext(ReplicacheContext);

  if (!context) {
    throw new Error("useRepContext should be used inside <ReplicacheProvider>");
  }

  return context;
}
