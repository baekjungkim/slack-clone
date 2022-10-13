import loadable from '@loadable/component';
import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/:workspace/*" element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
