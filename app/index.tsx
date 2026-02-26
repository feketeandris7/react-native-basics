
import { useState } from 'react';
import AppContent from './screens/app-content';
import Login from "./screens/login";

export default function Index() {
  let [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  if(isAuthenticated) {
    return (
      <AppContent />
    );
  }
  else {
    return (
      <Login setIsAuthenticated={setIsAuthenticated} />
    );
  }
}