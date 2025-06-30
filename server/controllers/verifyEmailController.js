import db from "../config/db";

const verifyEmail = (req, res) => {
  const { token } = req.params;
  
  const sql = `
  UPDATE users 
  SET is_verified = true, verification_token = NULL 
  WHERE verification_token = ?
  `;
  
  db.query(sql, [token], (err, result) => {
    if (err) return res.status(500).send('Database error');
    if (result.affectedRows === 0) return res.status(400).send('Invalid or expired verification link');
    
    res.send('Email verified successfully!');
  });
};

export default verifyEmail;