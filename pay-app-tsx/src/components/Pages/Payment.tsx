import React, { useState, useEffect } from 'react';
import './Payment.css';
import Plaid from '../Plaid/Plaid';
import Stripe from '../Stripe/Stripe';
import { numberFormat } from '../../lib/numberFormat';
import { ButtonGroup, ToggleButton, Form, Placeholder } from 'react-bootstrap';
import Spinner from '../Spinner/spinner';
import Alert from '../Alert/Alert';

interface BillingData {
    // billing_details: {
    address: {
        city: string,
        country: string,
        state: string,
        line1: string,
        line2: string,
        postal_code: string
    }
    //}
}
const Payment = () => {
    const [isLoader, setIsLoader] = React.useState(true);
    const [showAch, setShowAch] = React.useState(false);
    const [showCard, setShowCard] = React.useState(false);
    const [acceptCondition, setAcceptCondition] = React.useState(false);
    const [paymentSelected, setPaymentSelected] = React.useState(false);
    const [showOtherAmoutTextField, setShowOtherAmoutTextField] = React.useState(false);
    const [apicustomerId, setApicustomerId] = useState<string | null>(null);
    const [urlmail,setUrlmail] = useState<string | null>(null);
    const [urlOrderId,setUrlOrderId] = useState<string | null>(null);
    const [urlContactId,setUrlContactId] = useState<string | null>(null);
    const [todaysDate,setTodaysDate] = useState<string | null>(null);
    const [baseUrl,setBaseUrl] = useState<string | null>(null);
    const [alert,setAlert] = useState({});
    const [validLink, setvalidLink] = React.useState(false);
    const [cardType, setCardType] = useState<string | null>(null);
    const [totalAmount, setTotalAmount] = useState<string | null>(null);
    const [patientName, setpatientName] = useState<string | null>(null);
    const [origin, setOrigin] = useState<string | null>(null);
    const [destination, setDestination] = useState<string | null>(null);
    const [travelDate, setTravelDate] = useState<string | null>(null);
    const [dueAmount, setDueAmount] = useState<string | null>(null);
    const [payableAmount, setPayableAmount] = useState<string | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [orderTotal, setOrderTotal] = useState<string | null>(null);
    const [paidAmount, setPaidAmount] = useState<string | null>(null);
    const [transactionTotal, setTransactionTotal] = useState<string | null>(null);
    const [orderOpportunity, setOrderOpportunity] = useState<string | null>(null);
    const [orderQuote, setOrderQuote] = useState<string | null>(null);
    const [billingAddress, setBillingAddress] = useState({});
    const [paymentUrl, setPaymentUrl] = useState('');
    const [billingCity, setBillingCity] = useState<string | null>(null);
    const [billingCountry, setBillingCountry] = useState<string | null>(null);
    const [billingState, setBillingState] = useState<string | null>(null);
    const [billingPostalcode, setBillingPostalcode] = useState<string | null>(null);
    const [billingLine1, setBillingLine1] = useState<string | null>(null);
    const [billingLine2, setBillingLine2] = useState<string | null>(null);
    const [showBillingDetails, setShowBillingDetails] = React.useState(false);
    const [chargeAmount, setChargeAmount] = useState<string | null>(null);
    const [charge, setCharge] = useState('');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const urlPaymentLinkId = urlParams.get('Id')

    const [radioValue, setRadioValue] = useState('card');

    const radios = [
        { name: 'Card', value: 'card' },
        { name: 'ACH', value: 'ach' },
    ];
    const [selectedPaymentOption, setSelectedPaymentOption] = useState('default');

    useEffect(() => {
        getPaymentLinkDetails();
        if (apicustomerId && dueAmount && orderTotal) {
            setIsLoader(false);
        }
        if (selectedPaymentOption) {
            console.log("selectedPaymentOption" + selectedPaymentOption)
            if (selectedPaymentOption === 'default') {
                if (dueAmount) {
                    setShowOtherAmoutTextField(false);
                    setPayableAmount(JSON.stringify(dueAmount));
                }
            }
            else {
                setShowOtherAmoutTextField(true);
            }
        }
        if (cardType && payableAmount) {
            let charge = '2';
            let chargeAmd = (parseInt(charge) / 100) * parseInt(payableAmount)
            setChargeAmount(JSON.stringify(chargeAmd))
            setTotalAmount(JSON.stringify(parseInt(payableAmount) + chargeAmd));
        }
        if(radioValue === 'card' && apicustomerId){setShowCard(true);
        }
    }, [apicustomerId, dueAmount, orderTotal, selectedPaymentOption, payableAmount, cardType,radioValue])

    const getPaymentLinkDetails = () => {
        let baseUrl = "https://crma-pay-developer-edition.na163.force.com/";
        setBaseUrl(baseUrl);
        var payLinkParams = { paymentLinkId: urlPaymentLinkId };
        var url = baseUrl + "InteractPay/services/apexrest/crma_pay/InterACTPayAuthorizationUpdated/?methodType=GET&inputParams=" +
            JSON.stringify(payLinkParams);
        fetch(url, {
            method: "GET",
            headers: {
                mode: "cors",
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then((response) => response.text())
            .then((response) => {
                response = response.slice(1, response.length - 1);
                var apiResponse = [];
                apiResponse = JSON.parse(response);
                var amountDue = apiResponse.crma_pay__AmountDue__c;
                var linkActive = apiResponse.crma_pay__Active__c;
                var apiUrl = apiResponse.crma_pay__PaymentURL__c;
                let url = new URL(apiUrl);
                setUrlOrderId(url.searchParams.get("orderId"));
                let urlCustomerId = url.searchParams.get("customerId");
                setApicustomerId(urlCustomerId);
                // if (urlCustomerId) {
                //     setShowCard(true);
                // }
                setUrlContactId(url.searchParams.get("contactId"));
                let urlAmount = url.searchParams.get("amount");
                setUrlmail(url.searchParams.get("mail"));
                let createdDate = apiResponse.CreatedDate;
                let date = new Date(Date.parse(createdDate));
                var addedDate = date.setHours(date.getHours() + 8);
                const current = new Date();
                setTodaysDate(`${current.getFullYear()}-${current.getMonth() + 1
                }-${current.getDate()}`);
                var d1 = new Date(addedDate);
                var d2 = new Date(current);
                var timeleft = d1.getTime() - d2.getTime();
                var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
                var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
                console.log(days + ' Day' + hours + ' Hr' + minutes + ' Min' + seconds + ' Sec');
                let valid = false;
                if (days >= 0) {
                    if (hours > 0) {
                        setvalidLink(true);
                    }
                }
                var inputJson = apiResponse.crma_pay__JSON_Input__c;
                var x = JSON.stringify(inputJson);
                var xy = x.slice(1, x.length - 1);
                var new1 = xy.replace(/!/g, '"');
                var y = JSON.parse(new1);
                if (y[0].PatientName__c) {
                    setpatientName(y[0].PatientName__c);
                }
                if (y[0].OriginDesired__c) {
                    setOrigin(y[0].OriginDesired__c);
                }
                if (y[0].DestinationDesired__c) {
                    setDestination(y[0].DestinationDesired__c);
                }
                if (y[0].TravelDate__c) {
                    var dateValue = y[0].TravelDate__c;
                    setTravelDate(dateValue.substring(0, 10));
                }
                if (y[0].AmountDue__c) {
                    setDueAmount(y[0].AmountDue__c);
                }
                getOrderDetails(urlOrderId, baseUrl);
                //getStripeKey();
            })
            .catch((err) => {
                console.log("err" + err);
            })
    }

    const getOrderDetails = (orderId: string | null, baseUrl: string | null) => {
        var orderParams = { orderId: orderId };
        console.log("baseUrls--->" + baseUrl);
        var url =
            baseUrl +
            "InteractPay/services/apexrest/crma_pay/InterACTPayAuthorizationUpdated/?methodType=GET&inputParams=" +
            JSON.stringify(orderParams);
        console.log("this.order url ---->" + url);
        fetch(url, {
            method: "GET",
            headers: {
                mode: "cors",
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then((response) => response.text())
            .then((response) => {
                response = response.slice(1, response.length - 1);
                var contactReponse = JSON.parse(response);
                var orderReponse = JSON.stringify(JSON.parse(response));
                var orderNum = contactReponse.orderdetails[0].OrderNumber;
                var total = contactReponse.orderdetails[0].TotalAmount;
                setOrderNumber(orderNum);
                setOrderTotal(total);
                let initialOrderAmount = '' + total + '';
                setTransactionTotal(initialOrderAmount);
                if (contactReponse.orderdetails[0].OpportunityId) {
                    setOrderOpportunity(contactReponse.orderdetails[0].OpportunityId);
                    setOrderQuote(contactReponse.orderdetails[0].QuoteId);
                }
                if (orderTotal && dueAmount) {
                    setPaidAmount(JSON.stringify(parseInt(orderTotal) - parseInt(dueAmount)));
                }
            })
            .catch((err) => {
                console.log("err" + err);
            })
    }

    const selectedCardPayment = (id: string, billing_details: {
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
    }) => {
        console.log("id" + id);
        console.log("brand" + card.brand);
        if (id) {
            setPaymentSelected(true);
        }
        if (card) {
            setCardType(card.brand);
        }
        let payementUrl = "https://api.stripe.com/v1/payment_intents?currency=usd&confirm=true&customer=" + apicustomerId + "&payment_method=" + id
        setPaymentUrl(payementUrl);
        const billingDetails = billing_details;
        const billingInfo: BillingData = billingDetails;
        setBillingAddress({ city: billingInfo.address.city, country: billingInfo.address.country, line1: billingInfo.address.line1, line2: billingInfo.address.line2, postal_code: billingInfo.address.postal_code, state: billingInfo.address.state })
        setBillingCity(billingInfo.address.city);
        setBillingCountry(billingInfo.address.country);
        setBillingLine1(billingInfo.address.line1);
        setBillingLine2(billingInfo.address.line2);
        setBillingPostalcode(billingInfo.address.postal_code);
        setBillingState(billingInfo.address.state);
        if (billingInfo.address.city || billingInfo.address.country || billingInfo.address.line1 || billingInfo.address.line2 || billingInfo.address.postal_code || billingInfo.address.state) {
            setShowBillingDetails(true)
        }
        console.log(payementUrl);
    }

    const selectedBankPayment = (id: string) => {
        if (id) {
            console.log("Bank-Id" + id);
            setPaymentSelected(true);
            let payementUrl = "https://api.stripe.com/v1/charges?currency=usd&customer=" + apicustomerId + "&source=" + id
            setPaymentUrl(payementUrl);
            console.log(payementUrl);
        }
    }

    async function makepayment() {
        setIsLoader(true);
        fetch(paymentUrl + '&amount=' + totalAmount, {
            method: "POST",
            headers: {
                "x-rapidapi-host": "https://api.stripe.com",
                Authorization: " Bearer sk_test_51K9PF1JZdmpiz6ZwomLVnx7eXnu0Buv19EwOe262mK5uj5E4bTpWO1trTF5S1OvVmdnpWtd2fm8s0HHbMlrqY2uZ00lWc3uV7c",
            },
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(JSON.stringify('PaymentReaponse' + response));
                let transactionId = response.id;
                let transactionstatus = response.status;
                let gatewayMessage = JSON.parse(
                    JSON.stringify(response.charges.data[0].outcome.seller_message)
                );
                let gatewayStatus = JSON.parse(
                    JSON.stringify(response.charges.data[0].outcome.network_status)
                );
                let currencyCode = response.currency;
                createTransactionRecord(transactionId, transactionstatus, gatewayMessage, gatewayStatus, currencyCode);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function createTransactionRecord(
        transactionId: string,
        transactionstatus: string,
        gatewayMessage: string,
        gatewayStatus: string,
        currencyCode: string
    ) {

        // if (this.urlContactId) {
        //   this.contactId = this.urlContactId;
        // } else {
        //   this.contactId = this.newContactId;
        // }
        // if (this.urlmail) {
        //   this.mail = this.urlmail;
        // } else {
        //   this.mail = this.email;
        // }
        //var amount = '"'+ this.payingAmount+  '"';
        //console.log("New amount------>"+amount);
        //const amount = this.payingAmount;
        var transactionParams = {paymentGatewayIdentifier:transactionId,
            Amount:payableAmount,
            transactionEmail:urlmail,
            transactionCurrencyCode:currencyCode,
            transactionOrder:urlOrderId,
            transactionContact:urlContactId,
            processedDateTime:todaysDate,
            transactionStatus:transactionstatus,
            gatewayMessage:gatewayMessage,
            gatewayNetworkStatus:gatewayStatus,
            transactionQuote:orderQuote,
            transctionOpportunity:orderOpportunity,
            billingStreet:billingLine1,
            billingCity:billingCity,
            billingCountry:billingCountry,
            billingState:billingState,
            billingZip:billingPostalcode
        };
        
        var url = baseUrl +
            "InteractPay/services/apexrest/crma_pay/InterACTPayAuthorizationUpdated/?methodType=POST&inputParams=" +
            JSON.stringify(transactionParams);
        console.log("this.final transaction url --->" + url);
        fetch(url, {
            method: "GET",
            headers: {
                mode: "cors",
                "Access-Control-Allow-Origin": "*",
            },
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) {
                    console.log('LstResponse------------------------->'+response);
                    setIsLoader(false);
                    setAlert({status:'success',message:'Payment completed successfully'});
                    getPaymentLinkDetails();
                    //this.transIdUrl = response;
                    //var redirectUrl = 'https://medviation-developer-edition.na213.force.com/s/invoice-page' + '?transId=' + this.transIdUrl;
                    //console.log("invoked redirecturl" + redirectUrl);
                    //this.updatePaymentLinkRecord();
                }
                console.log(" create  transaction-->" + JSON.stringify(response));
                //this.navigateTo(redirectUrl);
            })
            .catch((err) => {
                setIsLoader(false);
                setAlert({status:'fail',message:'Something went wrong'});
                console.log("err" + err);
            });
    }

    const setPayType = (payType: string) => {
        setSelectedPaymentOption(payType);
    }
    return (
        <>
            {isLoader ? <Spinner /> : null}
            <Alert alert={alert} setAlert={setAlert}/>
            <div className="payment-container container">
                <div className="row m-0">
                    <div className="col-md-7 col-12">
                        <div className="row">
                            <div className="col-12 mb-4">
                                <div className="row box-right card-bg-img">
                                    <div className="col-md-8 ps-0 ">
                                        <p className="ps-3 textmuted fw-bold h6 mb-0">TOTAL AMOUNT</p>
                                        <p className="h1 fw-bold d-flex"> <span
                                            className=" fas fa-dollar-sign textmuted pe-1 h6 align-text-top mt-1"></span>{numberFormat(orderTotal)}
                                            {/* <span className="textmuted">.58</span> */}
                                        </p>
                                        {/* <p className="ms-3 px-2 bg-green">+10% since last month</p> */}
                                    </div>
                                    <div className="col-md-4">
                                        <p className="p-org"> <span className="fas fa-circle pe-2"></span>Due amount </p>
                                        <p className="fw-bold mb-3">{numberFormat(dueAmount)}
                                        </p>
                                        {/* <p className="p-blue"><span className="fas fa-circle pe-2"></span>Amount Paid</p>
                                        <p className="fw-bold">{numberFormat(paidAmount)}
                                        </p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 px-0 mb-4">
                                <div className="box-right card-bg-img">
                                    <div className="d-flex pb-2">
                                        <p className="fw-bold h7">
                                            Order Summary  <span className="textmuted"> / ({orderNumber})</span></p>
                                        <p className="ms-auto p-blue text-end">
                                        </p>
                                    </div>
                                    <div className="row pb-2">
                                        <div className="col-6">
                                            <p className="textmuted h8">Patient Name</p>
                                            <p className='h7'>{patientName ? patientName : <Placeholder className="w-100 h9" animation="glow">
                                                <Placeholder xs={7} />
                                            </Placeholder>}
                                            </p>
                                        </div>
                                        <div className="col-6 text-end">
                                            <p className="textmuted h8">Travel Date</p>
                                            <p className='h7'>{travelDate ? travelDate : <Placeholder className="w-100 h9" animation="glow">
                                                <Placeholder xs={7} />
                                            </Placeholder>}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <p className="textmuted h8">Orgin</p>
                                            <p className='h7'>{origin ? origin : <Placeholder className="w-100 h9" animation="glow">
                                                <Placeholder xs={7} />
                                            </Placeholder>}</p>
                                        </div>
                                        <div className="col-6 text-end">
                                            <p className="textmuted h8">Destination</p>
                                            <p className='h7'>{destination ? destination : <Placeholder className="w-100 h9" animation="glow">
                                                <Placeholder xs={7} />
                                            </Placeholder>} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showBillingDetails ?
                                <div className="col-12 px-0">
                                    <div className="box-right card-bg-img">
                                        <div className="d-flex mb-2">
                                            <p className="fw-bold">Billing address</p>
                                        </div>
                                        <div className="mb-2">
                                            <p className="h7 mb-1">{billingCity} </p>
                                            <p className="h7 mb-1">{billingLine1}, {billingLine2}</p>
                                            <p className="h7 "><span>{billingState}</span> ,<span> {billingCountry} </span> <span> {billingPostalcode}</span></p>
                                        </div>
                                    </div>
                                </div> : ''}
                        </div>
                    </div>
                    <div className="col-md-5 col-12 ps-md-5 p-0 ">
                        <div className="box-left card-bg-img">

                            <div className="">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="fw-bold h7 mb-1 pt-2">Choose Payment Method</p>
                                    </div>
                                    <div className="col-md-6 float-right text-end">
                                        <ButtonGroup>
                                            {radios.map((radio, idx) => (
                                                <ToggleButton
                                                    key={idx}
                                                    id={`radio-${idx}`}
                                                    type="radio"
                                                    variant={idx % 2 ? 'outline-primary' : 'outline-primary'}
                                                    name="radio"
                                                    size="sm"
                                                    value={radio.value}
                                                    checked={radioValue === radio.value}
                                                    onChange={(e) => {
                                                        setShowBillingDetails(false);
                                                        setPaymentSelected(false);
                                                        setRadioValue(e.currentTarget.value); if (e.currentTarget.value === 'card') {
                                                            setShowCard(true);
                                                            setShowAch(false);
                                                        } else { setShowAch(true); setShowCard(false); }
                                                    }}
                                                >
                                                    {radio.name}
                                                </ToggleButton>
                                            ))}
                                        </ButtonGroup>
                                    </div>
                                </div>
                                <p className="textmuted h8 mb-0">Please choose any payment method to continue</p>
                                <div className="">
                                    {showAch ? <Plaid apicustomerid={apicustomerId} selectedBankPayment={selectedBankPayment} /> : null}
                                </div>
                                <div className="">
                                    {showCard ? <Stripe apicustomerid={apicustomerId} selectedCardPayment={selectedCardPayment} /> : null}
                                </div>
                                {showCard || showAch ? null : <div className="card card-body bg-light- d-flex flex-row justify-content-between align-items-center mb-3"><Placeholder className="w-100 h9" animation="glow">
                                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                                    <Placeholder xs={6} /> <Placeholder xs={8} />
                                </Placeholder></div>}
                            </div>
                            <div className='mb-2'>
                                <form className="list-group">
                                    <label className="list-group-item">
                                        <div className="row">
                                            <div className='col-1 py-2'>
                                                <input type="radio" className="me-3" id="default" name="Default-Payment" value="default" checked={selectedPaymentOption === 'default'} onChange={(e) => {
                                                    setPayType(e.target.value)
                                                }} disabled={!paymentSelected} /></div>
                                            <div className='col-5 py-2'>
                                                Total amount due
                                            </div>
                                            <div className='col-6 py-2 text-end'>
                                                {numberFormat(dueAmount)}
                                            </div>
                                        </div>
                                    </label>
                                    <label className="list-group-item">
                                        <div className="row">
                                            <div className='col-1 py-2'>
                                                <input type="radio" className="me-3" id="other-payment" name="other-payment" value="other-payment" checked={selectedPaymentOption === 'other-payment'} onChange={(e) => {
                                                    setPayType(e.target.value); setPayableAmount(''); setTotalAmount(''); setChargeAmount('');
                                                }} disabled={!paymentSelected} /></div>
                                            <div className='col-5 py-2'>
                                                Other amount
                                            </div>
                                            <div className='col-6 text-end'>
                                                {showOtherAmoutTextField ?
                                                    <div className="input-group">
                                                        <span className="input-group-text">$</span>
                                                        <input type="text" className="form-control border-end-0 text-end pe-0" aria-label="Amount (to the nearest dollar)" onKeyUp={(e) => {
                                                            setPayableAmount(e.currentTarget.value);
                                                        }} />
                                                        <span className="input-group-text bg-transparent ps-0">.00</span>
                                                    </div> : null}
                                            </div>
                                        </div>
                                    </label>
                                </form>
                            </div>
                            <div>
                                <div className="h8">
                                    <div className="row m-0 border-bottom mb-3">
                                        <div className="col-8 h8 pe-0 ps-2">
                                            <span className="d-block py-2">Payment Charge</span>
                                        </div>
                                        <div className="col-4 p-0 pe-2 text-end">
                                            <span className="d-block py-2">{numberFormat(chargeAmount)}</span>
                                        </div>
                                    </div>

                                    <div className="d-flex h7 mb-2 px-2">
                                        <p className="">Total Amount</p>
                                        <p className="ms-auto"> <span className='fw-bold'>{numberFormat(totalAmount)}</span></p>
                                    </div>
                                    <div className="h8 mb-4">
                                        <Form.Check aria-label="option 1" label='I accept Lorem ipsum dolor sit amet elit. Adipisci ea harum sed quaerat tenetur' onChange={(e) => { setAcceptCondition(e.target.checked) }} disabled={!paymentSelected} />
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary d-block h8 w-100" onClick={makepayment} disabled={!acceptCondition}>PAY NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}
export default Payment;