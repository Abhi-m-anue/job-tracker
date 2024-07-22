import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import "./App.css";
import LoginRegister from "./pages/LoginRegister";
import Home from "./pages/Home";
import UnAuthorised from "./components/UnAuthorised";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

function App() {

  return (
    <MantineProvider>
      <>
        <Router>
          <Routes>
            <Route path="/" Component={LoginRegister}/>
            <Route path="/home" Component={Home}/>
            <Route path="/unauthorised" Component={UnAuthorised}></Route>
          </Routes>
        </Router>
      </>
    </MantineProvider>
  );
}

export default App;
