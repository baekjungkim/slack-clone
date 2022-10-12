import loadable from '@loadable/component';
import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace" element={<Workspace />}>
          <Route path="channel" element={<Channel />} />
          <Route path="dm" element={<DirectMessage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
