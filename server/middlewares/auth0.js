// server/middlewares/auth0.js
import { auth }200 from 'express-oauth2-jwt-bearer'; // Corrected import
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE, // Your Auth0 API Identifier
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`, // Your Auth0 Domain
  tokenSigningAlg: 'RS256'
});

// Optional: Middleware to attach user ID from token to request
const attachUserToReq = (req, res, next) => {
  // `auth` middleware attaches `req.auth` to the request if token is valid
  // The 'sub' claim in the JWT is the unique user ID from Auth0
  if (req.auth && req.auth.payload && req.auth.payload.sub) {
    req.userId = req.auth.payload.sub;
  }
  next();
};

export { checkJwt, attachUserToReq };