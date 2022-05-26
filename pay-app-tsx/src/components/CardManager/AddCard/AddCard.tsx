import React, { Fragment, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Card from '../Card';
import CardForm from '../CardForm';
import { CreditCard, updateLocalStorageCards } from '../CreditCard';

const initialState: CreditCard = {
  id: '',
  cardNumber: '',
  cardHolder: '',
  cardMonth: '',
  cardYear: '',
  cardCvv: '',
  addrressline1:'',
  addrressline2:'',
  country:'',
  city:'',
  state:'',
  postalCode:''
};

export default function AddCard(props:any) {
  const navigate = useNavigate();
  const [state, setState] = useState<CreditCard>(initialState);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const updateStateValues = useCallback(
    (keyName:any, value:any) => {
      setState({
        ...state,
        [keyName]: value || '',
      });
    },
    [state],
  );

  function handleSubmitAction() {
    try {
      let newCardsList: CreditCard[] = [];
      // if (localStorage.getItem('cards')) {
      //   const storageCards = JSON.parse(localStorage.getItem('cards') ?? '');
      //   newCardsList = storageCards ? [...storageCards] : [];
      // }

      // newCardsList.push({
      //   ...state,
      //   id: uuid(),
      // });
      console.log(state);
      props.getCardvalues(state);
     // updateLocalStorageCards(newCardsList);
     // navigate('/');
    } catch (error: any) {
      alert(error);
      console.log(error);
    } finally {
      //release resources or stop loader
    }
  }
function handleCloseModal(){
  props.handleClose();
}
  return (
    <Fragment>
      <div className="add-card-content">
        <div className="wrapper">
          <CardForm
            selectedCreditCard={state}
            onUpdateState={updateStateValues}
            setIsCardFlipped={setIsCardFlipped}
            handleSubmitAction={handleSubmitAction}
            handleCloseModal={handleCloseModal}
          >
            <Card
              cardNumber={state.cardNumber}
              cardHolder={state.cardHolder}
              cardMonth={state.cardMonth}
              cardYear={state.cardYear}
              cardCvv={state.cardCvv}
              isCardFlipped={isCardFlipped}
            ></Card>
          </CardForm>
        </div>
      </div>
    </Fragment>
  );
}
