import { Test, TestingModule } from '@nestjs/testing';
import { FileModule } from './file.module';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { ConfigModule } from '@nestjs/config';

describe('FileModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Attachment],
          synchronize: true,
        }),
        FileModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide FileService', () => {
    const service = module.get<FileService>(FileService);
    expect(service).toBeDefined();
  });

  it('should provide FileController', () => {
    const controller = module.get<FileController>(FileController);
    expect(controller).toBeDefined();
  });

  it('should export FileService', () => {
    const exportedService = module.get<FileService>(FileService);
    expect(exportedService).toBeDefined();
  });
}); 