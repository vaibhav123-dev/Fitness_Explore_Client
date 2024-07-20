import { Navbar } from "./components/Navbar";
import { Toaster } from "./components/Toaster";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Signup />
      <Login />
      <Toaster />
    </>
  );
}

export default App;
