import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/services/users.service';
import { SignInDto } from '../dtos/login.dto';

@Injectable()
export class LoginService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.findUserByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }
}
