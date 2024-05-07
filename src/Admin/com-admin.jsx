// Admin.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button, Card, Table, Modal } from 'react-bootstrap';
import { db, imageDB } from '../API/fire';
import { getAuth, signOut } from 'firebase/auth';
import { FaUserShield } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

function Admin() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);

  const usersCollectionRef = collection(db, 'pendaftaran');

  const navigate = useNavigate();

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

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, [usersCollectionRef]);

  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'pendaftaran', userId));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const lihatBuktiPembayaran = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const lihatSertifikat = (certificateUrl) => {
    window.open(certificateUrl, '_blank');
  };

  const handleImageAndCertificateClick = (user) => {
    setSelectedUser(user);

    if (user.imageUrl) {
      lihatBuktiPembayaran(user.imageUrl);
    }
  };

  const handleUploadCertificate = async () => {
    if (!selectedUser || !certificateFile) {
      return;
    }

    const storageRef = ref(imageDB, `certificates/${selectedUser.id}`);
    const uploadTask = uploadBytesResumable(storageRef, certificateFile);

    try {
      const snapshot = await uploadTask;
      const downloadUrl = await getDownloadURL(snapshot.ref);

      await updateDoc(doc(db, 'pendaftaran', selectedUser.id), {
        certificateUrl: downloadUrl,
      });

      setCertificateFile(null);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error uploading certificate:', error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pendaftar');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Data_Pendaftar.xlsx';
    a.click();
  };

  return (
    <div className='admin-body'>
      <Card
        className='mb-2'
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '25px',
          padding: '20px',
          marginTop: '20px',
        }}
      >
        <Card.Body style={{ textAlign: 'left' }}>
          <h2>Data Pendaftar</h2>
          <Table striped bordered hover style={{ marginTop: '0px' }}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Phone</th>
                <th>NIM</th>
                <th>Tempat Tanggal Lahir</th>
                <th>Jurusan</th>
                <th>Gambar Bukti Pembayaran</th>
                <th>Sertifikat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.Alamat}</td>
                  <td>{user.phone}</td>
                  <td>{user.NIM}</td>
                  <td>{user.TempatTanggalLahir}</td>
                  <td>{user.Jurusan}</td>
                  <td>
                    {user.imageUrl && (
                      <img
                        src={user.imageUrl}
                        alt='Bukti Pembayaran'
                        style={{ maxWidth: '100%', maxHeight: '50px', cursor: 'pointer' }}
                        onClick={() => handleImageAndCertificateClick(user)}
                      />
                    )}
                  </td>
                  <td>
                    {user.certificateUrl && (
                      <a
                        href={user.certificateUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        onClick={(e) => {
                          e.preventDefault();
                          lihatSertifikat(user.certificateUrl);
                        }}
                      >
                        Lihat Sertifikat
                      </a>
                    )}
                  </td>
                  <td>
                    <input
                      type='file'
                      accept='application/pdf'
                      onChange={(e) => {
                        setCertificateFile(e.target.files[0]);
                        setSelectedUser(user);
                      }}
                    />
                    <Button variant='success' onClick={handleUploadCertificate}>
                      Unggah Sertifikat
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Gambar Bukti Pembayaran</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img src={selectedImage} alt='Bukti Pembayaran' style={{ width: '100%' }} />
            </Modal.Body>
          </Modal>
        </Card.Body>
      </Card>
      <Button variant='primary' onClick={exportToExcel}>
        Ekspor ke Excel
      </Button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Admin;
