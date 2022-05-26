import React, { useEffect, useState } from "react";
import "./Stripe.css";
import StripeCardList from "./StripeCardList/StripeCardList";
import { Modal, Button, Placeholder } from 'react-bootstrap';
// import Ccard from '../Card/Ccard';
import AddCard from '../CardManager/AddCard/AddCard'
import Spinner from '../Spinner/spinner';
import Alert from '../Alert/Alert';

interface cardDataformat {
  id: string;
  bank_name: string;
  card: {
    last4: string;
    exp_year: string;
    exp_month: string;
    brand: string;
  },
  billing_details: {
    address: {
      city: string,
      country: string,
      state: string,
      line1: string,
      line2: string,
      postal_code: string,
    }
  };
  selectedCardPayment: (id: string, billing_details: {
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
}

const Stripe = (props: any) => {
  const [alert,setAlert] = useState({});
  const [isLoader, setIsLoader] = React.useState(false);
  const [paymentExist, setPaymentExist] = React.useState(false);
  const [cardList, setCardList] = useState<cardDataformat[]>([]);
  const [isshowAddress, setIsShowAddress] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log("props.apicustomerid" + props.apicustomerid);
    loadCardData(props.apicustomerid);
  }, []);

  const loadCardData = (cusId: string) => {
    console.log("invoked Card()!!!!");
    fetch(
      "https://api.stripe.com/v1/payment_methods?type=card&customer=" + cusId,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "https://api.stripe.com",
          Authorization:
            " Bearer sk_test_51K9PF1JZdmpiz6ZwomLVnx7eXnu0Buv19EwOe262mK5uj5E4bTpWO1trTF5S1OvVmdnpWtd2fm8s0HHbMlrqY2uZ00lWc3uV7c",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        console.log("Card list--------------" + JSON.stringify(response));
        setCardList(response.data);
        if (response.data) {
          setPaymentExist(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectedCard = (id: string, billing_details: {},card:{}) => {
    console.log(id, billing_details,card);
    props.selectedCardPayment(id, billing_details,card)
  };

  const handleClose = () => { setShow(false) };
  const handleShow = () => setShow(true);
  const handleAddCard = () => {
    setShow(true)
  }
  const createPaymentMethod = (cardNumber:string,cvv:string,validMonth:string,validYear:string,billingLine1:string,billingLine2:string,billingCity:string,billingCountry:string,billingState:string,billingPostalcode:string) => {
    setIsLoader(true);
    var createMethodUrl =
      "https://api.stripe.com/v1/payment_methods"
      +
      "?type=card&card[number]=" +
      cardNumber +
      "&card[exp_month]=" +
      validMonth +
      "&card[exp_year]=" +
      validYear +
      "&card[cvc]=" +
      cvv +
      "&billing_details[address[city]]=" + billingCity + "&billing_details[address[line1]]=" + billingLine1 + "&billing_details[address[country]]=" + billingCountry + "&billing_details[address[postal_code]]=" + billingPostalcode + "&billing_details[address[state]]=" + billingState;
    console.log("createcard url-->" + createMethodUrl);

    fetch(createMethodUrl, {
      method: "POST",
      headers: {
        "x-rapidapi-host": "https://api.stripe.com",
        Authorization: "Bearer sk_test_51K9PF1JZdmpiz6ZwomLVnx7eXnu0Buv19EwOe262mK5uj5E4bTpWO1trTF5S1OvVmdnpWtd2fm8s0HHbMlrqY2uZ00lWc3uV7c",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.id) {
          console.log(response);
          attachPaymentmethod(response.id, props.apicustomerid)
        } else {
          var message = response.error.message;
        }
      }).catch((err) => {
        console.log(err);
        var message = " Error Occurred";
        var type = "error";
      });
  }

  const attachPaymentmethod = (paymentMethodId: string, customerId: string) => {
    console.log("this.customerId in attachPaymentmethod---->" + paymentMethodId, customerId);
    var attachUrl =
      "https://api.stripe.com/v1/payment_methods/" +
      paymentMethodId +
      "/attach?customer=" +
      customerId;
    fetch(attachUrl, {
      method: "POST",
      headers: {
        "x-rapidapi-host": "https://api.stripe.com",
        Authorization: "Bearer sk_test_51K9PF1JZdmpiz6ZwomLVnx7eXnu0Buv19EwOe262mK5uj5E4bTpWO1trTF5S1OvVmdnpWtd2fm8s0HHbMlrqY2uZ00lWc3uV7c",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("attach payment medthod----->", response);
        setAlert({status:'success',message:'New card added Sucessfully'})
        loadCardData(props.apicustomerid);
        setIsLoader(false);
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        var message = " Error Occurred";
        var type = "error";
      });
  }
  const getCardvalues = (cardinputs: {
    id: string;
    cardNumber: string;
    cardHolder: string;
    cardMonth: string;
    cardYear: string;
    cardCvv: string;
    addrressline1: string;
    addrressline2: string;
    country: string;
    city: string;
    state: string;
    postalCode: string
  }) => {
    console.log(JSON.stringify(cardinputs.cardHolder));
    console.log(cardinputs.cardNumber, cardinputs.cardCvv, cardinputs.cardMonth, cardinputs.cardYear, cardinputs.addrressline1, cardinputs.addrressline2, cardinputs.city, cardinputs.country, cardinputs.state && cardinputs.postalCode)
    if (cardinputs.cardNumber && cardinputs.cardCvv && cardinputs.cardMonth && cardinputs.cardYear && cardinputs.addrressline1 && cardinputs.addrressline2 && cardinputs.city && cardinputs.country && cardinputs.state && cardinputs.postalCode) {
      createPaymentMethod(cardinputs.cardNumber,cardinputs.cardCvv,cardinputs.cardMonth,cardinputs.cardYear,cardinputs.addrressline1,cardinputs.addrressline2,cardinputs.city,cardinputs.country,cardinputs.state,cardinputs.postalCode);
    }
  };
  function refreshComponent() {
    setIsLoader(true);
    loadCardData(props.apicustomerid);
    setIsLoader(false);
  }
  return (
    <>
      {isLoader ? <Spinner /> : null}
      <Alert alert={alert} setAlert={setAlert}/>
      {paymentExist ? <StripeCardList cardList={cardList} selectedCard={selectedCard} refreshComponent={refreshComponent} /> : <div className="card card-body bg-light- d-flex flex-row justify-content-between align-items-center"><Placeholder className="w-100 h9" animation="glow">
        <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
        <Placeholder xs={6} /> <Placeholder xs={8} />
      </Placeholder></div>}
      <div className="text-end">
        <button className="btn btn-outline-success btn-sm lnch-btn my-2 rounded-pill rounded-pill" onClick={() => handleShow()}>
          Add new card
        </button>
      </div>

      <div className='d-block'>
        <Modal show={show} onHide={handleClose}
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header className='border-0 pb-0'>
            <Modal.Title className='fw-bold h6'>Add new card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddCard getCardvalues={getCardvalues} handleClose={handleClose} />

          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
export default Stripe;
