export interface User {
  id: number;
  username: string;
  email: string;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (username: string, email: string, password: string) => Promise<void>;
}


// 以下追記

export interface AuthResponse{

}

export interface UserCredentials{

}
