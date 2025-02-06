import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthCallback from "./components/auth-callback";
import Home from "./components/home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />{" "}
          {/* Route for the AuthCallback */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
