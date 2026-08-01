import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  console.log(process.env.JWT_SECRET);
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
    
  );

};

export default generateToken;