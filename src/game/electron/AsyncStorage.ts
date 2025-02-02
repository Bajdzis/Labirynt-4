export type AsyncStorage = Omit<Storage, "getItem"> & {
  getItem: (key: string) => Promise<string | null>;
};
