import React, { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "../componen/navbar";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Kirim permintaan ke API SSO
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "kminchelle",
          password: "0lelplR",
        }),
      });

      if (!response.ok) {
        // Tangani jika respon tidak berhasil
        throw new Error("Invalid credentials. Please try again.");
      }

      // Jika respon berhasil, lanjutkan dengan login
      const userData = await response.json();

      // Simpan data pengguna ke localStorage jika perlu
      localStorage.setItem("userData", JSON.stringify(userData));

      // Bersihkan kesalahan sebelumnya
      setError(null);

      // Simpan status login di localStorage
      localStorage.setItem("isLoggedIn", "true");

      // Alihkan ke halaman dashboard setelah login berhasil
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <Card style={{ minWidth: "30rem", width: "100%", marginLeft: "auto", marginRight: "auto" }} className="mt-5">
        <Card.Body style={{ minWidth: "20rem" }}>
          <Card.Title>
            <h2>Login</h2>
          </Card.Title>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button variant="primary" type="submit" onClick={handleLogin} className="mt-3">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default Login;
