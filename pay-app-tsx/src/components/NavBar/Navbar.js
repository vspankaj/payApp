import React, { useSteate } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-white- shadow-sm-">
                <div className="container">
                    <Link to='/' className='navbar-brand fw-bold'><i className="fa fa-info-circle me-2 text-primary" aria-hidden="true"></i>Interact Pay</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to='/' className="nav-link active" >Stripe</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/Plaid' className="nav-link" aria-current="page" >Ach</Link>
                            </li>
                        </ul> */}
                    </div>
                </div>
            </nav>
        </>
    )

}
export default Navbar