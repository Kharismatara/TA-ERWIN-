// Admin component

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../API/fire';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

function Admin() {
  const [newClass, setNewClass] = useState({
    classId: '', // Ubah id menjadi classId
    className: '',
    classDescription: '',
    kuota: 0
  });
  const [classes, setClasses] = useState([]);
  const [showClassToDeleteId, setShowClassToDeleteId] = useState(null); // State to track class to delete
  const classesCollectionRef = collection(db, 'classes');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      const querySnapshot = await getDocs(classesCollectionRef);
      const data = querySnapshot.docs.map((doc) => ({ classId: doc.id, ...doc.data() })); // Ubah id menjadi classId
      setClasses(data);
    };
    fetchClasses();
  }, [classesCollectionRef]);

  const handleLogout = async () => {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_nim');

    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('Logout successful');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNewClassChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddClass = async () => {
    try {
      const newId = uuidv4();
      await addDoc(classesCollectionRef, { ...newClass, classId: newId }); // Ubah id menjadi classId
      setNewClass({
        classId: '', // Ubah id menjadi classId
        className: '',
        classDescription: '',
        kuota: 0
      });
      alert('Kelas berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding class:', error);
      alert('Terjadi kesalahan saat menambahkan kelas.');
    }
  };

  const showDeleteConfirmation = (classId) => {
    setShowClassToDeleteId(classId); // Set class to delete
  };

  const hideDeleteConfirmation = () => {
    setShowClassToDeleteId(null); // Hide delete confirmation
  };

  const handleDeleteClass = async (classId) => {
    try {
      const classRef = doc(db, 'classes', classId);
      await deleteDoc(classRef);
      setClasses((prevClasses) => prevClasses.filter((kelas) => kelas.classId !== classId)); // Ubah id menjadi classId
      alert('Kelas berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Terjadi kesalahan saat menghapus kelas.');
    }
  };

  return (
    <div className='admin-body'>
      <h2>Tambah Kelas</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formClassName">
          <Form.Label>Nama Kelas</Form.Label>
          <Form.Control type="text" placeholder="Masukkan nama kelas" name="className" value={newClass.className} onChange={handleNewClassChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formClassDescription">
          <Form.Label>Deskripsi Kelas</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Masukkan deskripsi kelas" name="classDescription" value={newClass.classDescription} onChange={handleNewClassChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formKuota">
          <Form.Label>Kuota</Form.Label>
          <Form.Control type="number" placeholder="Masukkan kuota kelas" name="kuota" value={newClass.kuota} onChange={handleNewClassChange} />
        </Form.Group>
        <Button variant="primary" onClick={handleAddClass}>Tambah Kelas</Button>
      </Form>
      <div className="mt-5">
        <h2>Kelas yang Telah Dibuat</h2>
        <div className="d-flex flex-wrap justify-content-start">
          {classes.map((kelas) => (
            <Card key={kelas.classId} className="m-2" style={{ width: '18rem' }} >
              <Card.Body>
                <Card.Title>{kelas.className}</Card.Title>
                <hr />
                <Card.Text>
                  <strong>Keterangan:</strong> {kelas.classDescription}
                </Card.Text>
                <Card.Text>
                  <strong>Kuota:</strong> {kelas.kuota}
                </Card.Text>
                <Button variant="danger" onClick={() => showDeleteConfirmation(kelas.classId)}>Hapus Kelas</Button> {/* Show delete confirmation */}
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
      {/* Modal for delete confirmation */}
      <Modal show={showClassToDeleteId !== null} onHide={hideDeleteConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus Kelas</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus kelas ini?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideDeleteConfirmation}>Batal</Button>
          <Button variant="danger" onClick={() => { handleDeleteClass(showClassToDeleteId); hideDeleteConfirmation(); }}>Hapus</Button> {/* Execute delete function */}
        </Modal.Footer>
      </Modal>
      <Button variant='danger' onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default Admin;
