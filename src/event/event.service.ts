import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventService {
  @OnEvent('fetching.all', { async: true }) //to make the event asynchrounous
  notify({ dto }: { dto: string }) {
    console.log('fetching all roles', dto);
  }
  @OnEvent('fetching.all')
  notifyAfter({ dto }: { dto: string }) {
    console.log('fetching all roles', dto);
  }
  @OnEvent('fetching.one')
  notifyOne({ dto }: { dto: string }) {
    console.log('fetching one role', dto);
    return 1;
  }
}
