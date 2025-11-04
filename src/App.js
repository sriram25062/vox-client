import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home/Home.jsx"
import Register from "./pages/Register/Register.jsx"
import Login from "./pages/Login/Login.jsx"
import Landing from "./pages/Landing/Landing.jsx"
import Profile from "./pages/Profile/Profile.jsx"
import ProtectedLayout from "./routes/ProtectedLayout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  // return <Button label={"Follow"} style={{}} bootstrap= "btn btn-dark"/>
  return(
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path = "/" element = {<Landing/>} />
          <Route path = "/signup" element = {<Register/>} />
          <Route path = "/login" element = {<Login/>} />
          <Route element={<ProtectedLayout/>}>
            <Route path = "/profile" element = {<Profile/>} />
            <Route path = "/home" element = {<Home/>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
