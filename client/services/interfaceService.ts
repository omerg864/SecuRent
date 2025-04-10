import { chargeDeposit } from "@/services/transactionService";
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
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    image: string;
    rating: number;
    role: string;
    category: string[];
    currency: string;
    verificationCode: string;
    isValid: boolean;
    isEmailValid: boolean;
    isBankValid: boolean;
    companyNumber: string;
    isCompanyNumberVerified: boolean;
    bank: {
      accountNumber: string;
      sortCode: string;
      accountHolderName: string;
      bankName: string;
    };
  };
}

interface CustomerLoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    image: string;
    rating: number;
    role: string;
    currency: string;
    verificationCode: string;
    isValid: boolean;
    isEmailValid: boolean;
    isPaymentValid: boolean;
    creditCard: {
      number: string;
      expiry: string;
      cvv: string;
      cardHolderName: string;
    };
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

interface Item {
  _id: string;
  description: string;
  date: Date;
  price: number;
  temporary: boolean;
  business: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
}

interface ChargeDepositPayload {
  amount: number;
  charged_description: string;
}

interface TransactionResponse {
  success: boolean;
  transaction: {
    _id: string;
    transaction_id: string;
    amount: number;
    currency: string;
    status: string;
    business: string;
    customer?: string;
    closed_at?: string;
    return_date?: string;
    charged?: number;
    charged_description?: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Transaction {
  _id: string;
  transaction_id?: string;
  amount: number;
  description: string;
  currency: string;
  status: string;
  business?: {
    name?: string;
    image?: string;
  };
  customer?: {
    _id: string;
    name: string;
    image?: string;
    phone?: string;
  };
  opened_at?: Date;
  closed_at?: Date;
  return_date?: Date;
  charged?: number;
  charged_description?: string;
  createdAt: string;
  updatedAt: string;
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
  Item,
  ChargeDepositPayload,
  TransactionResponse,
  Transaction,
};
