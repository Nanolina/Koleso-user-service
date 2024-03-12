import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MyLogger } from '../../logger/my-logger.service';
import { UserCreatedDto } from '../dto';
import { UserService } from '../user.service';

@Controller()
export class UserEventsController {
  constructor(
    private userService: UserService,
    private readonly logger: MyLogger,
  ) {}

  @EventPattern('user_created')
  async userCreatedEvent(dto: UserCreatedDto) {
    this.logger.log({
      method: 'userCreatedEvent',
      log: `received data for user: ${dto.id}`,
    });

    await this.userService.create(dto);
  }
}
