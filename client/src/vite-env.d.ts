// /// <reference types="vite/client" />

declare module "*";

export {};
declare global {
  interface Window {
    ethereum: {
      [key: string]: Item;
    };
    [key: string]: any;
  }
}