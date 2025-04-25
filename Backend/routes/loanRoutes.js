import {
    requestLoan,
    getPendingLoans,
    updateLoanStatus,
    getLoansByLender,
    getLoansByBorrower
  } from '../controllers/loanController.js';
  
  router.get('/lender', getLoansByLender);
  router.get('/borrower', getLoansByBorrower);  