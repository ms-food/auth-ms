import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  async register(@Payload() registerUserDto: RegisterUserDto) {
    //
    return this.authService.registerUser(registerUserDto);
  }

  @MessagePattern('auth.login.user')
  async login(@Payload() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @MessagePattern('auth.verify.user')
  async verifyToken(@Payload() token: string) {
    return this.authService.verifyToken(token);
  }
}
