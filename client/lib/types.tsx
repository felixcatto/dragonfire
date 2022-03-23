export {};

declare global {
  interface Window {
    INITIAL_STATE: {
      routes: any;
      currentUser: any;
      ssrData: any;
      getApiUrl: any;
    };
  }
}
