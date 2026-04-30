import { accountStore } from "../store/accountStore";
import AuthWorker from "./handleAuthWorker?worker";

let authWorker: Worker | null = null;

export const socketEventHandler = (event: string, payload: any) => {
  if (event === "user:authenticated") {
    onAuthenticated(payload);
  }
};

const onAuthenticated = (payload: any) => {
  authWorker = new AuthWorker();
  // account.setStore("user", payload.user);

  authWorker.onmessage = (e) => {
    if (e.data.status === "success") {
      console.log("Auth worker completed.");
      accountStore.setAuthenticated(true);
      terminateWorker();
    }
    if (e.data.status === "error") {
      console.error("Worker DB Error:", e.data.error);
      terminateWorker();
    }
  };

  authWorker.postMessage({ type: "AUTH_SUCCESS", payload });
};

const terminateWorker = () => {
  if (authWorker) {
    authWorker.terminate();
    authWorker = null;
  }
};