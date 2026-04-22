import style from "./App.module.css";
import { createSocket } from "../../services/socket";
import "../../store/serverStore";
import { Sidebar } from "./Sidebar/Sidebar";
import { CurrentServerProvider } from "../../contexts/CurrentServerContext";
import { ServerChannelDrawer } from "./ServerChannelDrawer/ServerChannelDrawer";

const App = () => {
  createSocket();
  return (
    <CurrentServerProvider>
      <div class={style.app}>
        <Sidebar />
        <ServerChannelDrawer />
      </div>
    </CurrentServerProvider>
  );
};

export default App;
