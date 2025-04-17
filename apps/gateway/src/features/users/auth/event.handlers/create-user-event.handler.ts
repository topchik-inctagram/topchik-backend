import { CreateUserEvent } from '../events/create-user.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../common/adapters/mailer/mail.service';

@EventsHandler(CreateUserEvent)
export class CreateUserEventHandler implements IEventHandler<CreateUserEvent> {
  constructor(private mailService: MailService) {}

  handle({ nickname, email, code }: CreateUserEvent) {
    this.mailService
      .sendRegistrationEmail(nickname, code, email)
      .catch((error) =>
        console.error(
          `Error in send registration email: ${JSON.stringify(error)}`,
        ),
      );
  }
}
