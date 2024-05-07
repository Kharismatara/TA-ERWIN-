import { useState, useEffect } from "react";
import Dahboard from './dahboard'
import JPelatihan from './j-Pelatihan/JadwalPelatihan'
import JUjian from './jadwal/JadwalUjian'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Admin from './Admin/com-admin';
import GoogleLogin from './Auth/login';
import { getAuth, onAuthStateChanged } from 'firebase/auth'


function App() {

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (result) => {
      if (result) {
        const isAdminUser = result.email === 'adminupt@gmail.com';
        setIsAdmin(isAdminUser);
        setIsLoggedIn(true);
        console.log(result.email);
      } else {
        setIsLoggedIn(false);
        
      }

      setLoading(false);
    });

    // Fungsi pembersihan untuk berhenti berlangganan dari listener perubahan status otentikasi
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Anda dapat menambahkan spinner atau pesan loading di sini
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isLoggedIn ? (
        <Router>
          <Routes>
            {isAdmin ? (
                <Route path="/admin" element={<Admin />} />
            ):(
                <Route path="/dashboard" element={<Dahboard />} />
            )}
           
            <Route path="/dashboard" element={<Dahboard />} />
            <Route path="/jadwal-pelatihan" element={<JPelatihan />} />
            <Route path="/jadwal-ujian" element={<JUjian />} />
            {/* Tambahkan rute lain sesuai kebutuhan */}
          </Routes>
        </Router>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<GoogleLogin />} />
            {/* Tambahkan rute lain sesuai kebutuhan */}
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
