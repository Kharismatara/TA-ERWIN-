// CreateUserForm.js
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './API/fire';
import { Form, Button, Alert } from 'react-bootstrap';

const CreateUserForm = () => {
  const [name, setName] = useState('');
  const [nim, setNIM] = useState('');
  const [error, setError] = useState(null);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      // Simpan data pengguna baru ke Firestore
      const usersCollection = collection(db, 'users');
      await addDoc(usersCollection, {
        name: name,
        nim: nim,
      });

      // Setel state kembali ke nilai awal
      setName('');
      setNIM('');
      setError(null);

      console.log('User data created successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter user's name" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formNIM">
          <Form.Label>NIM</Form.Label>
          <Form.Control type="text" placeholder="Enter user's NIM" value={nim} onChange={(e) => setNIM(e.target.value)} />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button variant="success" type="submit" onClick={handleCreateUser}>
          Create User
        </Button>
      </Form>
    </div>
  );
};

export default CreateUserForm;
