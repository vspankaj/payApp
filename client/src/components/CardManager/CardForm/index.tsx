import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { CreditCard } from '../../CardManager/CreditCard';

const currentYear = new Date().getFullYear();
const monthsArr = Array.from({ length: 12 }, (x, i) => {
  const month = i + 1;
  return month <= 9 ? '0' + month : month;
});
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i);
interface CardFormProps {
  selectedCreditCard: CreditCard;
  onUpdateState: any;
  setIsCardFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitAction: () => void;
  handleCloseModal: () => void;
  children: any;
}
export default function CardForm(props: CardFormProps) {
  const {
    selectedCreditCard,
    onUpdateState,
    setIsCardFlipped,
    handleSubmitAction,
    handleCloseModal,
    children,
  } = props;
  const [errors, setErrors] = useState<CreditCard>({
    id: '',
    cardNumber: '',
    cardHolder: '',
    cardMonth: '',
    cardYear: '',
    cardCvv: '',
    addrressline1: '',
    addrressline2: '',
    country: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const handleFormChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;

    onUpdateState(name, value);
  };

  const handleFormChangeNumbers = (event: {
    target: { value: string; name: string };
  }) => {
    const { name, value } = event.target;
    if (isNaN(Number(value))) return; //only accept numbers
    onUpdateState(name, value);
  };

  const onCvvFocus = () => {
    setIsCardFlipped(true);
  };

  const onCvvBlur = () => {
    setIsCardFlipped(false);
  };

  const handleConfirmAction = (e: any) => {
    // validate errors
    if (!isFormHasErrors()) {
      handleSubmitAction();
    }
  };
  const isFormHasErrors = () => {
    const newErrors: CreditCard = {
      id: '',
      cardNumber: '',
      cardHolder: '',
      cardMonth: '',
      cardYear: '',
      cardCvv: '',
      addrressline1: '',
      addrressline2: '',
      country: '',
      city: '',
      state: '',
      postalCode: ''
    };
    //first validate blank fields
    let isErrorFlag = false;
    Object.keys(newErrors).forEach(function (key: any) {
      const keyPair = key as keyof CreditCard;
      const displayableKeyName = key.toLowerCase().replace('card', 'Card ');
      if (!selectedCreditCard[keyPair]) {
        newErrors[keyPair] = `${displayableKeyName} value required.`;
        isErrorFlag = true;
      } else {
        newErrors[keyPair] = '';
        isErrorFlag = false;
      }
    });
    if (isErrorFlag) {
      setErrors(newErrors);
      return isErrorFlag;
    }
    //if no blank field then check other validation
    if (selectedCreditCard['cardNumber'].length !== 16) {
      newErrors.cardNumber = 'Card number should be 16 digits';
      isErrorFlag = true;
    }
    if (selectedCreditCard['cardCvv'].length !== 3) {
      newErrors.cardCvv = 'Card number should be 4 digits';
      isErrorFlag = true;
    }
    setErrors(newErrors);
    return isErrorFlag;
  };

  return (
    <div className="card-form">
      <div className="card-list">{children}</div>
      <div className="card-form__inner">
        <div className="card-input">
          <div className="row mt-4">
            <div className="col-8">
              <Form.Control
                type="text"
                name="cardNumber"
                className="form-control mb-3"
                autoComplete="off"
                onChange={handleFormChangeNumbers}
                maxLength={16}
                placeholder="Card Number"
                value={selectedCreditCard.cardNumber}
                isInvalid={!!errors.cardNumber}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.cardNumber}
              </Form.Control.Feedback> */}
            </div>
            <div className="col-2">
              <Form.Control
                as="select"
                className="card-input__input -select form-control"
                value={selectedCreditCard.cardMonth}
                name="cardMonth"
                placeholder='Expiration Date'
                onChange={handleFormChange}
                isInvalid={!!errors.cardMonth}
              >
                <option value="" disabled>
                  MM
                </option>

                {monthsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Control>
              {/* <Form.Control.Feedback type="invalid">
                {errors.cardMonth}
              </Form.Control.Feedback> */}
            </div>
            <div className="col-2">
              <Form.Control
                as="select"
                name="cardYear"
                placeholder='Expiration Year'
                className="card-input__input -select form-control"
                value={selectedCreditCard.cardYear}
                onChange={handleFormChange}
                isInvalid={!!errors.cardYear}
              >
                <option value="" disabled>
                  YY
                </option>

                {yearsArr.map((val, index) => (
                  <option key={index} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Control>
              {/* <Form.Control.Feedback type="invalid">
                {errors.cardYear}
              </Form.Control.Feedback> */}
            </div>
            <div className="col-8">
              <Form.Control
                type="text"
                className="form-control mb-3"
                autoComplete="off"
                name="cardHolder"
                placeholder='Card Holder Name'
                onChange={handleFormChange}
                value={selectedCreditCard.cardHolder}
                isInvalid={!!errors.cardHolder}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.cardHolder}
              </Form.Control.Feedback> */}
            </div>
            <div className="col-4">
              <Form.Control
                type="text"
                className="form-control mb-3"
                maxLength={4}
                autoComplete="off"
                name="cardCvv"
                placeholder='CVV'
                value={selectedCreditCard.cardCvv}
                onChange={handleFormChangeNumbers}
                onFocus={onCvvFocus}
                onBlur={onCvvBlur}
                isInvalid={!!errors.cardCvv}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.cardCvv}
              </Form.Control.Feedback> */}
            </div>
          </div>
          <div className='mb-3 p-2 bg-opacity-10 h7 bg-primary border-start border-primary'>Billing Address</div>
          <div className='row'>
            <div className="col-12">
              <Form.Control
                type="text"
                className="form-control mb-3"
                autoComplete="off"
                name="addrressline1"
                placeholder='Addres Line 1'
                value={selectedCreditCard.addrressline1}
                onChange={handleFormChange}
                isInvalid={!!errors.addrressline1}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.addrressline1}
              </Form.Control.Feedback> */}
            </div>
            <div className="col-12">
              <Form.Control
                type="text"
                className="form-control mb-3"
                autoComplete="off"
                name="addrressline2"
                placeholder='Addres Line 1'
                value={selectedCreditCard.addrressline2}
                onChange={handleFormChange}
                isInvalid={!!errors.addrressline2}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.addrressline2}
              </Form.Control.Feedback> */}
            </div>
            <div className="col-3">
              <Form.Control
                type="text"
                className="form-control mb-3"
                autoComplete="off"
                name="country"
                placeholder='Country'
                value={selectedCreditCard.country}
                onChange={handleFormChange}
                isInvalid={!!errors.country}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.country}
              </Form.Control.Feedback> */}
            </div>
            <div className="col-3">
              <Form.Control
                type="text"
                className="form-control mb-3"
                autoComplete="off"
                name="city"
                placeholder='City'
                value={selectedCreditCard.city}
                onChange={handleFormChange}
                isInvalid={!!errors.city}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback> */}
            </div>
            <div className="col-3">
              <Form.Control
                type="text"
                className="form-control mb-3"
                autoComplete="off"
                name="state"
                placeholder='State'
                value={selectedCreditCard.state}
                onChange={handleFormChange}
                isInvalid={!!errors.state}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.state}
              </Form.Control.Feedback> */}
            </div>
            <div className="col-3">
              <Form.Control
                type="text"
                className="form-control mb-3"
                autoComplete="off"
                name="postalCode"
                placeholder='Postal code'
                value={selectedCreditCard.postalCode}
                onChange={handleFormChange}
                isInvalid={!!errors.postalCode}
              />
              {/* <Form.Control.Feedback type="invalid">
                {errors.postalCode}
              </Form.Control.Feedback> */}
            </div>
          </div>
        </div>
        <div className="card-form__row">
          <div className="card-form__col">
            <div className="text-end gap-2">
            <Button variant="secondary" className='btn-sm me-3' onClick={handleCloseModal}>
              Cancel
            </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmAction}>
                Continue
              </Button>{' '}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
