import React, { useEffect, useState } from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";
import { initCsrf, getCurrentUser, logout, User } from "./authApi";
import RunsOverTimeChart from "./components/RunsOverTimeChart";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      await initCsrf();                 
      const me = await getCurrentUser(); // check existing session
      setUser(me);
      setChecking(false);
    }

    bootstrap();
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  if (checking) return <div>Loading…</div>;

  return (
    <div className="App">
      {user ? (
        <>
          <h1>Welcome, {user.username}</h1>
          <button onClick={handleLogout}>Log out</button>
          <br />
          <RunsOverTimeChart />
        </>
      ) : (
        <LoginForm onLogin={setUser} />
      )}
    </div>
  );
};

export default App;
