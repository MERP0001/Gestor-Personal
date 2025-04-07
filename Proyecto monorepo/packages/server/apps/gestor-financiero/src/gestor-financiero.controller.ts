import { Controller, Get } from '@nestjs/common';
import { GestorFinancieroService } from './gestor-financiero.service';

@Controller()
export class GestorFinancieroController {
  constructor(private readonly gestorFinancieroService: GestorFinancieroService) {}

  @Get()
  getHello(): string {
    return this.gestorFinancieroService.getHello();
  }
}
