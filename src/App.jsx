import { RouterProvider } from "react-router-dom";
import { Header } from "./components/Header";
import { Toaster } from "./components/Toaster";
import { router } from "./routes/routesConfig.jsx";

function App() {
  return (
    <div>
      <Header />
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
