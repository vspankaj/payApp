function Spinner() {
    return (
        <div className="d-flex justify-content-center">
        <div className="spinner-border loading text-danger" role="status">
        </div>
        <div className='modal-backdrop fade show cust-backdrop'></div>
        </div>
    );
  }
  
  export default Spinner;