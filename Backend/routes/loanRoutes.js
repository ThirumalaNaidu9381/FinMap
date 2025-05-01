import express from 'express';
import {
  requestLoan,
  getPendingLoans,
  updateLoanStatus,
  getLoansByLender,
  getLoansByBorrower
} from '../controllers/loanController.js';


const router = express.Router();

router.post('/request', requestLoan);
router.get('/pending', getPendingLoans);
router.patch('/:id/:action', updateLoanStatus);
router.get('/lender', getLoansByLender);
router.get('/borrower', getLoansByBorrower);

export default router;
