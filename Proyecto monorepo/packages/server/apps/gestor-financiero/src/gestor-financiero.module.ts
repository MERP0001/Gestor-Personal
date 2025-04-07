import { Module } from '@nestjs/common';
import { GestorFinancieroController } from './gestor-financiero.controller';
import { GestorFinancieroService } from './gestor-financiero.service';

@Module({
  imports: [],
  controllers: [GestorFinancieroController],
  providers: [GestorFinancieroService],
})
export class GestorFinancieroModule {}
