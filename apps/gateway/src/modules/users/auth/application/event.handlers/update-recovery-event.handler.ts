import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MailService } from '../../../../../common/adapters/mailer/mail.service';
import { UpdateRecoveryEvent } from '../../events/update-recovery.event';

@EventsHandler(UpdateRecoveryEvent)
export class UpdateRecoveryEventHandler
  implements IEventHandler<UpdateRecoveryEvent>
{
  constructor(private mailService: MailService) {}

  handle({ nickname, email, code }: UpdateRecoveryEvent) {
    this.mailService
      .sendPasswordRecoveryEmail(nickname, code, email)
      .catch((error) =>
        console.error(
          `Error in send registration email: ${JSON.stringify(error)}`,
        ),
      );
  }
}
