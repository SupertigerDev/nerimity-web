import { createSocket } from "./services/socket"

const App = () => {

  createSocket()
  return <div>
    Hello!
  </div>
}

export default App
