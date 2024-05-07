import React from 'react';
import { Card } from 'react-bootstrap';
import './pelatihan.css'; // Import the CSS file

function Pelatihan() {
  return (
    <div>
      <Card className="custom-card">
        <Card.Body>
          <Card.Title className="card-title">Training Registration</Card.Title>
          <Card.Text className="card-text">
            <strong>Date:</strong> January 31, 2024
          </Card.Text>
          <Card.Text className="card-text">
            <strong>Location:</strong> Virtual
          </Card.Text>
          <Card.Text className="card-text">
            <strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Pelatihan;
