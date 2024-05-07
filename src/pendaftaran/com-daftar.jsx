import React, { useState, useEffect } from 'react';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../API/fire';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function User() {
  const [classes, setClasses] = useState([]);
  const [registrations, setRegistrations] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesCollectionRef = collection(db, 'classes');
        const querySnapshot = await getDocs(classesCollectionRef);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();

    const fetchRegistrations = async () => {
      const pendaftaranCollectionRef = collection(db, 'pendaftaran');
      const querySnapshot = await getDocs(pendaftaranCollectionRef);
      const data = {};
      querySnapshot.forEach((doc) => {
        const registration = doc.data();
        if (!data[registration.classId]) {
          data[registration.classId] = 1;
        } else {
          data[registration.classId]++;
        }
      });
      setRegistrations(data);
    };
    fetchRegistrations();
  }, []);

  const handleCheckQuota = (classId, kuota) => {
    const count = registrations[classId] || 0;
    if (count >= kuota) {
      return false;
    }
    return true;
  };

  return (
    <div className='user-body'>
      <h2 style={{textAlign:'center'}}>Daftar Kelas</h2>
      <div className="d-flex flex-wrap justify-content-start">
        {classes.map((kelas) => (
          <Card key={kelas.id} className="m-2" style={{width:'250px'}}>
            <Card.Body>
              <Card.Title>{kelas.className}</Card.Title>
              <hr />
              <Card.Text>
                <strong>Keterangan:</strong> {kelas.classDescription}
              </Card.Text>
              <Card.Text>
                <strong>Jumlah Pendaftar:</strong> {registrations[kelas.id] || 0}
              </Card.Text>
              {!handleCheckQuota(kelas.id, kelas.kuota) ? (
                <div style={{border:'5px', color:'red'}}>Kelas Penuh</div>
              ) : (
                <Link to={`/class/${kelas.id}`}>
                  <Button variant="primary">Masuk Kelas</Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default User;
