import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
const Alert = (props: any) => {
    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false); props.setAlert({}) };
    const handleShow = () => setShow(true);
    useEffect(() => {
        // console.log("props.status"+props.alert.status)
        if (props.alert.status && props.alert.message) {
            handleShow();
        }
    }, [props]);
    return (
        <Modal show={show} onHide={handleClose}
            {...props}
            // size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className='border-0 pb-0' closeButton>
            </Modal.Header>
            <Modal.Body className='pt-0'>
                <div className='h2 text-center'>{props.alert.status === 'success' ? <i className="fa fa-check-circle text-success" aria-hidden="true"></i> : <i className="fa fa-exclamation-circle text-danger" aria-hidden="true"></i>}</div>
                <p className='text-center'>
                    {props.alert.message ? props.alert.message : 'Success'}
                </p>
            </Modal.Body>
        </Modal>
    );
}
export default Alert;

// Read ME:
// Impot File
// import Alert from '../Alert/Alert';
// set Use State
// const [alert,setAlert] = useState({});

// Add value inside Method 
// setAlert({status:'success',message:'Added Sucessfully'});
// setAlert({status:'fail',message:'************8'});
// <Alert alert={alert} setAlert={setAlert}/>

