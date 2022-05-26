import React, { useCallback, useState, useEffect } from 'react';

import { usePlaidLink, PlaidLinkOnSuccess } from 'react-plaid-link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import './Plaid.css';
import Spinner from '../Spinner/spinner';
import PlaidAccountList from './PlaidAccountList/PlaidAccountList';
import StripeAccList from '../Stripe/StripeAccList/StripeAccList';
import { Modal, Button, Placeholder } from 'react-bootstrap';
import Alert from '../Alert/Alert';

interface dataFormat {
  id: string;
  name: string;
  mask: string;
}
interface accDataformat {
  id: string;
  bank_name: string;
  last4: string;
  status: string;
  selectedBankPayment: (id: string) => void;
}
const Plaid = (props: any) => {
  const [alert,setAlert] = useState({});
  const [isLoader, setIsLoader] = React.useState(false);
  const [paymentExist, setPaymentExist] = React.useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [bankData, setBankData] = useState([{}])
  const [bankTocken, setBankTocken] = useState([{}])
  const [testbankacc, settestBankAcc] = useState<dataFormat[]>([])
  const [todo, addTodo] = useState<dataFormat[]>([]);
  const [apicustomerId, setApicustomerId] = useState<string | null>(null);
  const [accountlist, setaccountlist] = useState<accDataformat[]>([])
  const [selectedBank, setSelectedBank] = useState('');
  const [show, setShow] = useState(false);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const user = urlParams.get('user')
  const amount = urlParams.get('amount')
  const bankAchID = urlParams.get('bankAchID')

  // get link_token from your server when component mounts


  useEffect(() => {
    async function fetchlinktocken() {
      let response = await axios.post("/api/create_link_token");
      console.log("link token" + JSON.stringify(response.data.link_token));
      setToken(response.data.link_token);
    }

    fetchlinktocken();
    loadAchData(props.apicustomerid);
    //testapi();
  }, [])

  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
    console.log(publicToken, metadata);
    console.log(JSON.stringify(metadata))
    //setBankData(metadata.accounts);
    if (metadata.accounts) {
      settestBankAcc(metadata.accounts);
      handleShow();
    }
    getAccessTocken(publicToken);
  }, []);

  async function getAccessTocken(publicToken: string) {
    var data = {
      public_token: publicToken
    };
    var response = await axios.post("/api/set_access_token", data);
    console.log(JSON.stringify(response));
    console.log(response.data.access_token);
    setAccessToken(response.data.access_token);
  }

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
    // onEvent
    // onExit
  });

  async function getbanktocken(accountId: string) {
    var data = { access_token: accessToken, account_id: accountId };
    console.log(data)
    var response = await axios.post("/api/get_banktoken", data);
    console.log(JSON.stringify(response.data));
    setBankTocken(response.data);
    linkstripe(response.data);
    //alert("Your Account has been confirmed with the ID " + JSON.stringify(response.data))
  }

  async function linkstripe(btn: string) {
    fetch("https://api.stripe.com/v1/customers/" + props.apicustomerid + "?source=" + btn, {
      method: "POST",
      headers: {
        "x-rapidapi-host": "https://api.stripe.com",
        Authorization: " Bearer sk_test_51K9PF1JZdmpiz6ZwomLVnx7eXnu0Buv19EwOe262mK5uj5E4bTpWO1trTF5S1OvVmdnpWtd2fm8s0HHbMlrqY2uZ00lWc3uV7c",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(JSON.stringify(response));
        loadAchData(props.apicustomerid);
        handleClose();
        setIsLoader(false);
        setAlert({status:'success',message:'Your Account has been verified add added to the stripe Account'});
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const loadAchData = (cusId: string) => {
    console.log("invoked onloadfetchAch()!!!!");
    fetch("https://api.stripe.com/v1/customers/" + cusId + "/sources", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "https://api.stripe.com",
        Authorization: " Bearer sk_test_51K9PF1JZdmpiz6ZwomLVnx7eXnu0Buv19EwOe262mK5uj5E4bTpWO1trTF5S1OvVmdnpWtd2fm8s0HHbMlrqY2uZ00lWc3uV7c",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("ach list--------------" + JSON.stringify(response));
        setaccountlist(response.data)
        if (response.data) {
          setPaymentExist(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const selectBank = (id: string) => {
    console.log(id);
    setSelectedBank(id)
  }


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLinkTostrip = () => {
    setIsLoader(true);
    getbanktocken(selectedBank);
    setShow(true)
  }

  const selectedAccount = (id: string) => {
    console.log("selectedAccount" + id);
    props.selectedBankPayment(id)
  }

  function refreshComponent() {
    setIsLoader(true);
    loadAchData(props.apicustomerid);
    setIsLoader(false);
  }

  return (
    <>
    <Alert alert={alert} setAlert={setAlert}/>
    {isLoader ? <Spinner /> : null}
      <div className=''>
        {paymentExist ? <StripeAccList accountlist={accountlist} selectedAccount={selectedAccount} refreshComponent={refreshComponent} /> : <div className="card card-body bg-light- d-flex flex-row justify-content-between align-items-center"><Placeholder className="w-100 h9" animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder></div>}

        <div className='text-end'>
          <button className="btn btn-outline-success btn-sm lnch-btn my-2 rounded-pill rounded-pill" type="button" onClick={() => open()} disabled={!ready}>
            {ready ?  null:<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
            
            Add new back account
          </button>
        </div>
        <div className='d-block'>
          <Modal show={show} onHide={handleClose}
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header className='border-0'>
              <Modal.Title className='fw-bold h6'>Select an account </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PlaidAccountList testbankacc={testbankacc} selectBank={selectBank} />
            </Modal.Body>
            <Modal.Footer className='border-0'>
              <Button variant="secondary" className='btn-sm' onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" className='btn-sm' onClick={handleLinkTostrip}>
                Continue
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );

};

export default Plaid;