import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';

type LoginResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  userId: string;
  username: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() credentials: LoginRequestDto): LoginResponse {
    return this.authService.login(credentials);
  }
}
