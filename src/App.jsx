import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <MantineProvider>
      <>
        <Router>
          <Routes>
            <Route path="/" Component={Login} />
            <Route path="/register" Component={Register} />
            <Route path="/dashboard" Component={Dashboard} />
          </Routes>
        </Router>
      </>
    </MantineProvider>
  );
}

export default App;
