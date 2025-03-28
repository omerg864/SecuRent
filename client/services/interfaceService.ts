interface AuthData {
  name?: string;
  email?: string;
  password?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
}

interface BusinessLoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    image: string;
    category: string;
    currency: string;
    rating: number;
    role: string;
  };
}

interface CustomerLoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    image: string;
    rating: number;
    role: string;
  };
}

type LoginResponse = CustomerLoginResponse | BusinessLoginResponse;

interface CreditCardData {
  number: string;
  expiry: string;
  cvv: string;
  cardHolderName: string;
}

interface BankDetails {
  accountNumber: string;
  sortCode: string;
  accountHolderName: string;
  bankName: string;
}

export type {
  AuthData,
  LoginCredentials,
  AuthResponse,
  BusinessLoginResponse,
  CustomerLoginResponse,
  CreditCardData,
  LoginResponse,
  BankDetails,
};
