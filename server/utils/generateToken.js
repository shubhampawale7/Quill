import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // NOTE: In production, you would set `secure: true`
  // We are not using cookies for now, but this is how you would set it
  // res.cookie('jwt', token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',
  //   sameSite: 'strict',
  //   maxAge: 30 * 24 * 60 * 60 * 1000,
  // });

  return token;
};

export default generateToken;
