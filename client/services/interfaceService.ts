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
    business: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      image: string;
      category: string;
      currency: string;
      rating: number;
    };
  }

  interface CustomerLoginResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
    customer: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      image: string;
      rating: number;
    };
  }



  export type { AuthData, LoginCredentials, AuthResponse, BusinessLoginResponse, CustomerLoginResponse };