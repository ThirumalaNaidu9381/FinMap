export const getLoansByLender = async (req, res) => {
    try {
      const lenderId = req.query.lenderId;
      const loans = await Loan.find({ lenderId: lenderId });
      res.json(loans);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch lender loans' });
    }
  };
  
  export const getLoansByBorrower = async (req, res) => {
    try {
      const borrowerId = req.query.borrowerId;
      const loans = await Loan.find({ borrowerId: borrowerId });
      res.json(loans);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch borrower loans' });
    }
  };
  