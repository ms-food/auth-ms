import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to database mongodb 🚀');
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const { email, name, password } = registerUserDto;
      const user = await this.user.findFirst({
        where: {
          email,
        },
      });
      if (user) {
        throw new RpcException({ status: 400, message: 'User already exists' });
      } else {
        const newUser = await this.user.create({
          data: {
            email,
            name,
            password: await bcrypt.hash(password, 10),
          },
        });
        const { password: _, ...rest } = newUser;
        return {
          user: rest,
          token: await this.signJWT({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          }),
        };
      }
    } catch (error) {
      throw new RpcException({ status: 400, message: error.message });
    }
  }

  async loginUser(logintUnserDto: LoginUserDto) {
    try {
      const { email, password } = logintUnserDto;
      const user = await this.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new RpcException({ status: 400, message: 'User not found' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new RpcException({ status: 400, message: 'Invalid password' });
      }
      const { password: _, ...rest } = user;
      return {
        user: rest,
        token: await this.signJWT({
          id: rest.id,
          name: rest.name,
          email: rest.email,
        }),
      };
    } catch (error) {
      throw new RpcException({ status: 400, message: error.message });
    }
  }

  async verifyToken(token: string) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return {
        user,
        token: await this.signJWT(user),
      };
    } catch (error) {
      throw new RpcException({ status: 401, message: 'Invalid token' });
    }
  }

  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
