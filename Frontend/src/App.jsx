import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext.jsx";
import AppRoutes from "./routes/Routes.jsx";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Toaster position="top-right" />

        <AppRoutes />

      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;