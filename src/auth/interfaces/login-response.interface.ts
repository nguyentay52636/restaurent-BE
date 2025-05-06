import { ProfileResponse } from 'src/auth/interfaces/profile-response.interface';

export interface LoginResponse {
  user: ProfileResponse;
  access_token: string;
  refresh_token: string;
}
