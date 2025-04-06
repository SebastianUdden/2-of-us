import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import { StorageProvider } from "./context/StorageContext";

function App() {
  return (
    <AuthProvider>
      <StorageProvider>
        <Layout />
      </StorageProvider>
    </AuthProvider>
  );
}

export default App;
