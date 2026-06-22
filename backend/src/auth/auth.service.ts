import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(username: string, pass: string) {
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'password';

    if (username === validUsername && pass === validPassword) {
      // In a real app, you would generate a JWT token here.
      // For simplicity in this personal portfolio, we'll return a simple token.
      return {
        access_token: 'valid-admin-token-123',
      };
    }
    
    throw new UnauthorizedException('Invalid credentials');
  }
}
