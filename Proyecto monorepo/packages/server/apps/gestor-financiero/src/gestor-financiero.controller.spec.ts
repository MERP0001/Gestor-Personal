import { Test, TestingModule } from '@nestjs/testing';
import { GestorFinancieroController } from './gestor-financiero.controller';
import { GestorFinancieroService } from './gestor-financiero.service';

describe('GestorFinancieroController', () => {
  let gestorFinancieroController: GestorFinancieroController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GestorFinancieroController],
      providers: [GestorFinancieroService],
    }).compile();

    gestorFinancieroController = app.get<GestorFinancieroController>(GestorFinancieroController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gestorFinancieroController.getHello()).toBe('Hello World!');
    });
  });
});
