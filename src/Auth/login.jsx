import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../API/fire';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Memeriksa apakah pengguna adalah "adminUPT" dengan email yang sesuai
      if (email === 'adminupt@gmail.com') {
        // Jika sesuai, login user sebagai admin
        await signInWithEmailAndPassword(auth, email, password); // Melakukan login sebagai admin

        // Bersihkan kesalahan sebelumnya
        setError(null);

        // Simpan status login di localStorage
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('isAdmin', 'true');

        // Alihkan ke halaman admin
        navigate('/admin');
      } else {
        // Jika bukan admin, login user dengan email dan password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Bersihkan kesalahan sebelumnya
        setError(null);

        // Simpan status login di localStorage
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('isAdmin', 'false');

        // Alihkan ke dasbor setelah login berhasil
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <Form>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="text" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="primary" type="submit" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
