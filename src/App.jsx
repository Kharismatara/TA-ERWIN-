import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dahboard from './dahboard';
import JPelatihan from './j-Pelatihan/JadwalPelatihan';
import JUjian from './jadwal/JadwalUjian';
import Regis from './Auth/register';
import Admin from './Admin/com-admin';
import ClassAdmin from './Admin/classAdmin';
import GoogleLogin from './Auth/login';
import User from "./sertifikat/user";
import ClassDetail from "./pendaftaran/ClassDetail";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleLogin />} />
        <Route path="/register" element={<Regis />} />
        <Route path="/dashboard" element={<Dahboard />} />
        <Route path="/class/:id" element={<ClassDetail />} />
        <Route path="/jadwal-pelatihan" element={<JPelatihan />} />
        <Route path="/jadwal-ujian" element={<JUjian />} />
        <Route path="/sertifikat" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/class-admin" element={<ClassAdmin />} />
        
      </Routes>
    </Router>
  );
}

export default App;
