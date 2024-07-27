# Authentication API Documentation

This documentation provides details about the Authentication API endpoints.

## Info

- **Name**: Authentication

## Endpoints

### Signup

**Endpoint**: `POST /api/v1/user/signup`

**URL**: `http://localhost:5100/api/v1/user/signup`

**Request Body**:

```json
{
  "firstName": "first name",
  "lastName": "last name",
  "dob": "YYYY-MM-DD",
  "email": "email",
  "password": "password",
  "confirmPassword": "password"
}
```

**Description**: Registers a new user with the provided details.

### Login

**Endpoint**: `POST /api/v1/user/login`

**URL**: `http://localhost:5100/api/v1/user/login`

**Request Body**:

```json
{
  "email": "email",
  "password": "password"
}
```

**Description**: Authenticates a user and provides a JWT token.

### Forget Password

**Endpoint**: `POST /api/v1/user/forgetPassword`

**URL**: `http://localhost:5100/api/v1/user/forgetPassword`

**Request Body**:

```json
{
  "email": "email"
}
```

**Description**: Sends a password reset link to the provided email address.

### Reset Password

**Endpoint**: `POST /api/v1/user/reset-password/<your token>`

**URL**: `http://localhost:5100/api/v1/user/reset-password/<your token>`

**Request Body**:

```json
{
  "password": "password",
  "confirmPassword": "password"
}
```

**Description**: Resets the password using the provided token.

### Logout

**Endpoint**: `GET /api/v1/user/logout`

**URL**: `http://localhost:5100/api/v1/user/logout`

**Description**: Logs out the authenticated user.

## Drawbacks

1. **Unlimited Password Reset Requests**: Users can request password resets an unlimited number of times, which can be exploited for spamming.
2. **No Email Verification**: Anyone can create an account without verifying their email, leading to potential issues with fake or invalid accounts.

---
