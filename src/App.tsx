import "./App.css";

import Layout from "./components/Layout";
import { StorageProvider } from "./context/StorageContext";

function App() {
  return (
    <StorageProvider>
      <Layout />
    </StorageProvider>
  );
}

export default App;
