import { Route, Routes } from "react-router-dom";
import Form from "./components/Form";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
    <Routes>
      <Route path="/reset-password" element={<Form />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
