import { Routes, Route } from "react-router-dom";
import RspPage from "./pages/page-rsp/RspPage";
import Weather from "./pages/page-weather/Weather";

function App() {
  return(
    <Routes>
      <Route path="/rsp" element={<RspPage />} />
      <Route path="/weather" element={<Weather />} />
    </Routes>
  )

}

export default App;