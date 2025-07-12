import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import './App.css';

function App() {
  // The user's name is now managed here, in the top-level state.
  // It starts as null, meaning no one is logged in.
  const [userName, setUserName] = useState(null);

  // This function will be passed to LoginPage.
  // When LoginPage calls it, the user will be logged in.
  const handleLogin = (name) => {
    console.log(`App.js: Logging in user: ${name}`);
    setUserName(name);
  };

  // This function will be passed to ChatPage.
  const handleLogout = () => {
    console.log("App.js: Logging out user.");
    setUserName(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/*
            The login route is now only accessible if `userName` is null.
            We pass the handleLogin function as a prop.
          */}
          <Route 
            path="/login" 
            element={
              !userName ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/chat" />
            } 
          />
          
          {/*
            The chat route is now only accessible if `userName` is set.
            We pass the userName and handleLogout function as props.
          */}
          <Route 
            path="/chat" 
            element={
              userName ? <ChatPage userName={userName} onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />

          {/*
            The root path will redirect based on the login state.
          */}
          <Route 
            path="/" 
            element={<Navigate to={userName ? "/chat" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;