import { createSignal } from 'solid-js'
import { socket } from './services/socket'

function App() {
  const [count, setCount] = createSignal(0)

  socket.connect();

  return (
    <>

      <button
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count()}
      </button>

    </>
  )
}

export default App
