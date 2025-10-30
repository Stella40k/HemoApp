import { useState } from "react"

export const App = () => {
  const [user, setUser] = useState("");

  const handleLogin = (username) => {
    setUser(username);
  }
  return (
    <>
    <h1>¡Bienvenido a HemoApp</h1>
    <button>Logout</button>

    <login onLogin={handleLogin}/>
    </>
  )
}

export default App

