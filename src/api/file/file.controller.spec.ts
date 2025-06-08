import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { Attachment } from './entities/attachment.entity';

describe('FileController', () => {
  let controller: FileController;
  let service: FileService;

  const mockAttachment = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    originalName: 'test.jpg',
    fileName: '1234567890-abcdef.jpg',
    mimeType: 'image/jpeg',
    size: 1024,
    url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
    cloudProvider: 'cloudinary',
    cloudProviderId: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFile = {
    originalname: 'test.jpg',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('test'),
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue(mockAttachment),
            deleteFile: jest.fn().mockResolvedValue(undefined),
            getFile: jest.fn().mockResolvedValue(mockAttachment),
          },
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file and return attachment details', async () => {
      const result = await controller.uploadFile(mockFile);
      
      expect(result).toEqual(mockAttachment);
      expect(service.uploadFile).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      await controller.deleteFile(mockAttachment.id);
      
      expect(service.deleteFile).toHaveBeenCalledWith(mockAttachment.id);
    });
  });

  describe('getFile', () => {
    it('should return file information', async () => {
      const result = await controller.getFile(mockAttachment.id);
      
      expect(result).toEqual(mockAttachment);
      expect(service.getFile).toHaveBeenCalledWith(mockAttachment.id);
    });
  });
}); 