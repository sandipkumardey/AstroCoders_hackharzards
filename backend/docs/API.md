# EventX API Documentation

## Authentication
### Login
- **Endpoint**: `/auth/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token

## NFT Operations
### Create NFT Ticket
- **Endpoint**: `/nft/create`
- **Method**: POST
- **Auth**: Required
- **Request Body**: Event details and ticket information

### Purchase Ticket
- **Endpoint**: `/orders/create`
- **Method**: POST
- **Auth**: Required
- **Request Body**: Order details

## Payment Operations
### Process Payment
- **Endpoint**: `/payments/process`
- **Method**: POST
- **Auth**: Required
- **Request Body**: Payment details

For detailed API documentation with request/response schemas, visit `/docs` or `/redoc` endpoints provided by FastAPI.
