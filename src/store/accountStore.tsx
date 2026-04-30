import { createRoot, createSignal } from "solid-js";
;



export const accountStore = createRoot(createAccountStore);


function createAccountStore () {
  const [authenticated, setAuthenticated] = createSignal<boolean>(false);


  return { authenticated, setAuthenticated };
};