import type { ColumnWithCard } from "@/lib/queries";
import type { Board, Card, Tab } from "@/lib/mutators";
import { create } from "zustand";

type Data = {
  boards: Board[] | undefined;
  tabs: Tab[] | undefined;
  columns: ColumnWithCard[] | undefined;
  cards: Card[] | undefined;
};

export type DataStore = Data & {
  updateStore: <T extends StoreKeys>(
    key: T,
    updator: (data: Data[T]) => Data[T]
  ) => void;
};

export type StoreKeys = keyof Data;

export const useDataStore = create<DataStore>((set) => ({
  boards: [],
  tabs: [],
  columns: [],
  cards: [],
  updateStore: <T extends StoreKeys>(
    key: T,
    updator: (data: Data[T]) => Data[T]
  ) => {
    set((storeData) => {
      const updatedData = updator(storeData[key]);
      return { [key]: updatedData };
    });
  },
}));

export function useGetStoreData<T extends StoreKeys>(storeKey: T) {
  return useDataStore((state) => state[storeKey]);
}
