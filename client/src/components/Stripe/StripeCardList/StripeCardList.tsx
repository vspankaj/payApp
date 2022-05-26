import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Modal, Button, Placeholder, Dropdown } from 'react-bootstrap';
import Alert from '../../Alert/Alert';

interface AccInterface {

  cardList: {
    id: string, bank_name: string, billing_details: {
      address: {
        city: string,
        country: string,
        state: string,
        line1: string,
        line2: string,
        postal_code: string,
      }
    }, card: {
      last4: string;
      exp_year: string;
      exp_month: string;
      brand: string;

    }
  }[];

  selectedCard: (id: string, billing_details: {
    address: {
      city: string,
      country: string,
      state: string,
      line1: string,
      line2: string,
      postal_code: string,
    }
  }, card: {
    brand: string
  }) => void;
  refreshComponent: () => void;
}
const StripeCardList: React.FC<AccInterface> = (props) => {
  const [alert, setAlert] = useState({});
  const [show, setShow] = useState(false);
  const [action, setAction] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const cradListContainer = useRef(null);

  function refreshCardList() {
    props.refreshComponent();
  }

  const deletePaymentMethod = (id: string) => {
    console.log("myContainer..", cradListContainer.current);
    setDeleteCardId(id);
    handleShow();
  }
  function ConfirmDelete() {
    var deleteUrl = "https://api.stripe.com/v1/payment_methods/" + deleteCardId + "/detach";
    fetch(deleteUrl,
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "https://api.stripe.com",
          Authorization: " Bearer sk_test_51K9PF1JZdmpiz6ZwomLVnx7eXnu0Buv19EwOe262mK5uj5E4bTpWO1trTF5S1OvVmdnpWtd2fm8s0HHbMlrqY2uZ00lWc3uV7c",

        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(" delete response -->" + JSON.stringify(response));
        handleClose()
        refreshCardList();
        setAlert({status:'success',message:'Payment Methode removed Sucessfully'});
      })
      .catch((err) => {
        console.log(err);
        setAlert({status:'fail',message:err.message});
      });

  }
  function showCardActions() {
    setAction(true);
  }
  console.log("StripeAccountList" + JSON.stringify(props.cardList))
  return (<div className='acc-list'>
    <Alert alert={alert} setAlert={setAlert} />
    {

      props.cardList.map(acc => {
        return <label key={acc.id}>
          <input type="radio" name="demo" className="card-input-element d-none" id={acc.id} onChange={props.selectedCard.bind(null, acc.id, acc.billing_details, acc.card)} />
          <div className="card card-body bg-light- d-flex flex-row justify-content-between align-items-center" ref={cradListContainer}>
            <div className='row w-100'>
              <div className='col-2 py-1'>
                <img
                  src={`/card-type/${acc.card.brand}.svg`}
                  alt="" className='CardListIcon'
                />
              </div>
              <div className='col-10'>
                <p className='fw-bold h7 mb-0'><span className='ccNumber position-relative'>XXXXXXXX{acc.card.last4}</span></p>
                <p className='h8 mb-1'><span className='textmuted h8'> Valid Thru</span><span className='ms-md-2'>{acc.card.exp_month}</span> / <span>{acc.card.exp_year}</span></p>
                <div className='carActionBtn'>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" className='text-muted bg-white dropdown-toggle-custom-' size='lg' id="dropdown-basic">
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item >Edit</Dropdown.Item>
                      <Dropdown.Item onClick={deletePaymentMethod.bind(null, acc.id)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>

        </label>

      })

    }
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header >
        <Modal.Title className='fw-bold h6'><i className="fa fa-exclamation-triangle text-warning me-3" aria-hidden="true"></i>Remove</Modal.Title>
      </Modal.Header>
      <Modal.Body>The payment method will no longer be usable for you !.</Modal.Body>
      <Modal.Footer className='pt-0 border-top-0'>
        <Button variant="secondary" size="sm" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" size="sm" onClick={ConfirmDelete}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  </div>

  );

}

export default StripeCardList;