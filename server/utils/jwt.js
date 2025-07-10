const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  /* 1 */
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const isTokenValid = ({ token }) =>
  jwt.verify(token, process.env.JWT_SECRET); /* 2 */

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const expiration = 1000 * 60 * 60 * 2;
  /* cookies */
  res.cookie("token", token, {
    httpOnly: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + expiration),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};

/*************** COMMENTS **************

***1: here the word "token", refers to the token which is returned by createJWT() which in turn, is called inside attachCookiesToResponse() during "Register". If(!token) necessarily means that that name has not been registered yet. example of token:
token=s%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicGV0ZXIiLCJ1c2VySWQiOiI2NjQwOTBmNTEyYmQ2NGI5MTgwYzI3OGEiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxNTU5NjIzNCwiZXhwIjoxNzE1NjgyNjM0fQ.-r37sMkSWEQnrXkx8_5KUsLQ85nfdYv8GLIflio1aMo.KF0wNalxlLDOOw7Olu2IMz2SJLL02tACSWhtb2ljU3c; Path=/; Expires=Tue, 14 May 2024 10:30:34 GMT; HttpOnly.

how is a token created:

    const token = jwt.sign({ name: user.name, userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Expires in 30 days
    });

{ name: user.name, userId: user._id, role: user.role } is the payload of the JWT, containing the user's ID and username.
process.env.JWT_SECRET is the secret key used to sign the JWT, ensuring its integrity.
{ expiresIn: '30d' } specifies that the token will expire in 30 days.

In the context of JSON Web Tokens (JWTs), the term "token" typically refers to the entire string that includes the encoded header, payload, and signature, separated by dots. Let's clarify how these components fit together:

1. "Header": Contains metadata about the type of token and the signing algorithm used. It's JSON-encoded and then base64url-encoded. For example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

2. "Payload": Contains the claims or data being transferred, such as user ID, name, and any other information you want to include. It's also JSON-encoded and then base64url-encoded. For example: `eyJpZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0`

3. "Signature": The signature is created by hashing the base64url-encoded header and payload along with the secret key. It ensures the integrity of the token and verifies that it hasn't been tampered with. For example: `abc123def456`

When these three parts are combined, with dots between them, you get the complete JWT or "token":

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.abc123def456
```

In your example, when you create a JWT using `jwt.sign({ name: user.name, userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' })`, the library handles the creation of the entire JWT, including the signature. So, the resulting string that represents the JWT is what you would typically refer to as the "token".

This complete JWT, including the encoded header, payload, and signature, is the "token" that gets sent to clients or stored in cookies or local storage for later use. When the JWT is received by the server, it can decode the token, verify its signature using the secret key, and extract the claims from the payload.

***2: the isTokenValid function does not return true or false. Instead, it attempts to verify the JWT token using jwt.verify. If the token is valid, it returns the decoded payload (which might contain properties such as name, userId etc); if the token is invalid, it throws an error.
*/
