import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db, imageDB } from '../API/fire';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CSSTransition } from 'react-transition-group';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import './Pendaftaran.css';

function FormFloatingCustom() {
  const [newName, setNewName] = useState('');
  const [newAlamat, setNewAlamat] = useState('');
  const [newPhone, setNewPhone] = useState(0);
  const [newNIM, setNewNIM] = useState('');
  const [newTempatTanggalLahir, setNewTempatTanggalLahir] = useState('');
  const [newJurusan, setNewJurusan] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const jurusanOptions = ['Jurusan A', 'Jurusan B', 'Jurusan C'];
  const [classes, setClasses] = useState([]);
  const [notification, setNotification] = useState({ variant: '', message: '' });
  const [showCard, setShowCard] = useState(false);

  const usersCollectionRef = collection(db, 'pendaftaran');
  const classesCollectionRef = collection(db, 'classes');

  useEffect(() => {
    const fetchData = async () => {
      const classData = await getDocs(classesCollectionRef);
      setClasses(classData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setShowCard(true);
    };
    fetchData();
  }, [classesCollectionRef]);

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setSelectedImage(image);
  };

  const uploadImage = async () => {
    try {
      if (!selectedImage) {
        return null;
      }

      const storage = imageDB;
      const imageRef = ref(storage, `images/${selectedImage.name}`);
      await uploadBytes(imageRef, selectedImage);
      const imageUrl = await getDownloadURL(imageRef);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const createUser = async () => {
    try {
      const imageUrl = await uploadImage();

      await addDoc(usersCollectionRef, {
        name: newName,
        phone: Number(newPhone),
        Alamat: newAlamat,
        NIM: newNIM,
        TempatTanggalLahir: newTempatTanggalLahir,
        Jurusan: newJurusan,
        imageUrl: imageUrl,
        classId: selectedClass
      });

      setNotification({ variant: 'success', message: 'Data berhasil disubmit!' });

      setNewName('');
      setNewPhone(0);
      setNewAlamat('');
      setNewNIM('');
      setNewTempatTanggalLahir('');
      setNewJurusan('');
      setSelectedImage(null);
      setSelectedClass('');
    } catch (error) {
      setNotification({ variant: 'danger', message: 'Gagal submit data. Terjadi kesalahan.' });
      console.error('Error submitting data:', error.message);
    }
  };

  return (
    <div className='pendaftaran-con'>
      <CSSTransition in={showCard} timeout={500} classNames='card-transition' unmountOnExit>
        <Card
          className='mb-2'
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '25px',
            padding: '20px',
            transition: 'margin-top 500ms',
          }}
        >
          <Card.Body style={{ textAlign: 'left' }}>
            {notification.message && <Alert variant={notification.variant}>{notification.message}</Alert>}
            <h1 style={{ fontSize: '1.5rem', fontStyle: 'revert' }}>Silahkan Mengisi Form Pendaftaran</h1>
            <br />
            <Form>
              <Form.Group className='mb-3' controlId='formSelectClass'>
                <Form.Label>Pilih Kelas</Form.Label>
                <Form.Select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value=''>Pilih Kelas...</option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>{classItem.className}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Floating className='mb-3'>
                <Form.Control
                  id='floatingInputName'
                  type='text'
                  placeholder='Name...'
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  style={{ fontSize: '14px' }}
                />
                <Form.Label htmlFor='floatingInputName' style={{ fontSize: '12px', textAlign: 'left' }}>
                  Masukkan nama
                </Form.Label>
              </Form.Floating>
              <Form.Floating className='mb-3'>
                <Form.Control
                  id='floatingInputPhone'
                  type='number'
                  placeholder='Phone...'
                  onChange={(event) => {
                    setNewPhone(event.target.value);
                  }}
                  style={{ fontSize: '14px' }}
                />
                <Form.Label htmlFor='floatingInputPhone' style={{ fontSize: '12px', textAlign: 'left' }}>
                  Masukkan Whatsapp Number
                </Form.Label>
              </Form.Floating>

              <Form.Floating className='mb-3'>
                <Form.Control
                  id='floatingInputAlamat'
                  type='text'
                  placeholder='Alamat...'
                  onChange={(event) => {
                    setNewAlamat(event.target.value);
                  }}
                  style={{ fontSize: '14px' }}
                />
                <Form.Label htmlFor='floatingInputAlamat' style={{ fontSize: '12px', textAlign: 'left' }}>
                  Masukkan Alamat
                </Form.Label>
              </Form.Floating>

              <Form.Floating className='mb-3'>
                <Form.Control
                  id='floatingInputNIM'
                  type='text'
                  placeholder='NIM...'
                  onChange={(event) => {
                    setNewNIM(event.target.value);
                  }}
                  style={{ fontSize: '14px' }}
                />
                <Form.Label htmlFor='floatingInputNIM' style={{ fontSize: '12px', textAlign: 'left' }}>
                  Masukkan NIM
                </Form.Label>
              </Form.Floating>

              <Form.Floating className='mb-3'>
                <Form.Control
                  id='floatingInputTempatTanggalLahir'
                  type='text'
                  placeholder='Tempat Tanggal Lahir...'
                  onChange={(event) => {
                    setNewTempatTanggalLahir(event.target.value);
                  }}
                  style={{ fontSize: '14px' }}
                />
                <Form.Label htmlFor='floatingInputTempatTanggalLahir' style={{ fontSize: '12px', textAlign: 'left' }}>
                  Masukkan Tempat Tanggal Lahir
                </Form.Label>
              </Form.Floating>

              <Form.Floating className='mb-3'>
                <Form.Select
                  id='floatingInputJurusan'
                  onChange={(event) => {
                    setNewJurusan(event.target.value);
                  }}
                  style={{ fontSize: '14px' }}
                >
                  <option value=''>Pilih Jurusan...</option>
                  {jurusanOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
                <Form.Label htmlFor='floatingInputJurusan' style={{ fontSize: '12px', textAlign: 'left' }}>
                  Pilih Jurusan
                </Form.Label>
              </Form.Floating>

              <Form.Floating className='mb-3'>
                <Form.Control
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  style={{ fontSize: '14px' }}
                />
                <Form.Label style={{ fontSize: '12px', textAlign: 'left' }}>Unggah Bukti Pembayaran</Form.Label>
              </Form.Floating>
              <Button onClick={createUser} style={{ fontSize: '14px', width: '99px' }}>
                Tambah +
              </Button>
            </Form>

            {selectedImage && (
              <div style={{ marginTop: '20px' }}>
                <h5>Gambar Bukti Pembayaran:</h5>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt='Bukti Pembayaran'
                  style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                />
              </div>
            )}
          </Card.Body>
        </Card>
      </CSSTransition>
    </div>
  );
}

export default FormFloatingCustom;
