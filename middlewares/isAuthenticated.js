{
  /*import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User Not auththeticated",
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid",
        success: false,
      });
    }
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};
export default isAuthenticated;*/
}

import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.token;

    // If no token is found, respond with an authentication error
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // If the token is invalid, handle the error
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    // Attach the userId to the request object for further use
    req.id = decoded.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log the error and return a response if something goes wrong during verification
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export default isAuthenticated;
