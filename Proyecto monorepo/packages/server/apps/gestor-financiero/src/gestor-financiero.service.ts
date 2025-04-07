import { Injectable } from '@nestjs/common';

@Injectable()
export class GestorFinancieroService {
  getHello(): string {
    return 'Hello World!';
  }
}
