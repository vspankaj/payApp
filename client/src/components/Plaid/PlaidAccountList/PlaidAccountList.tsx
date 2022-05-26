import React, { useCallback, useState, useEffect } from 'react';

interface plaidInterface {

    testbankacc: { id: string, name: string,mask:string }[];

    selectBank: (id: string) => void;

}

const PlaidAccountList: React.FC<plaidInterface> = (props) => {
    console.log(JSON.stringify(props.testbankacc))
    return (<div className='acc-list'>

        {

            props.testbankacc.map(acc => {

                return <label key={acc.id}>
                <input type="radio" name="demo" className="card-input-element d-none" id={acc.id} onChange={props.selectBank.bind(null, acc.id)} />
                <div className="card card-body bg-light- d-flex flex-row justify-content-between align-items-center">
                    <div className='row w-100'>
                        <div className='col-2'>
                        <i className="fa fa-university text-black-50 fs-1" aria-hidden="true"></i>
                        </div>
                        <div className='col-10'>
                            <p className='h7 mb-1'>{acc.name}</p>
                            <p className='fw-bold h8 mb-0'><span className=' ccNumber position-relative'>XXXXXXXX{acc.mask}</span></p>
                        </div>
                    </div>
                </div>
            </label>


            })

        }

    </div>);

}

export default PlaidAccountList;