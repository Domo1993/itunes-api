import React, { useState } from 'react';
// Importing bootstrap modules
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// This component uses a popop-on-click modal to display a preview clip of the corresponding media type 
function VideoModal(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Preview
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Preview Clip</Modal.Title>
          </Modal.Header>
          <Modal.Body>{props.video}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
export default VideoModal 