import React from 'react';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

const Toaster = ({showToast, setShowToast, toastMessage}) => {
    return (
        <ToastContainer position='top-end' className="p-3">
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg='danger'>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default Toaster;
