import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from './file.service';
import { Attachment } from './entities/attachment.entity';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary');

describe('FileService', () => {
  let service: FileService;
  let repository: Repository<Attachment>;
  let configService: ConfigService;

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
      providers: [
        FileService,
        {
          provide: getRepositoryToken(Attachment),
          useValue: {
            create: jest.fn().mockReturnValue(mockAttachment),
            save: jest.fn().mockResolvedValue(mockAttachment),
            findOne: jest.fn().mockResolvedValue(mockAttachment),
            remove: jest.fn().mockResolvedValue(mockAttachment),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config = {
                CLOUDINARY_CLOUD_NAME: 'test-cloud',
                CLOUDINARY_API_KEY: 'test-key',
                CLOUDINARY_API_SECRET: 'test-secret',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    repository = module.get<Repository<Attachment>>(getRepositoryToken(Attachment));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file to Cloudinary and save attachment details', async () => {
      const mockCloudinaryResponse = {
        secure_url: 'https://res.cloudinary.com/test/image/upload/test.jpg',
        public_id: 'test',
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
        callback(null, mockCloudinaryResponse);
        return {
          end: jest.fn(),
        };
      });

      const result = await service.uploadFile(mockFile);

      expect(result).toEqual(mockAttachment);
      expect(repository.create).toHaveBeenCalledWith({
        originalName: mockFile.originalname,
        fileName: expect.any(String),
        mimeType: mockFile.mimetype,
        size: mockFile.size,
        url: mockCloudinaryResponse.secure_url,
        cloudProvider: 'cloudinary',
        cloudProviderId: mockCloudinaryResponse.public_id,
      });
      expect(repository.save).toHaveBeenCalled();
    });

    it('should handle Cloudinary upload errors', async () => {
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation((options, callback) => {
        callback(new Error('Upload failed'), null);
        return {
          end: jest.fn(),
        };
      });

      await expect(service.uploadFile(mockFile)).rejects.toThrow('Upload failed');
    });
  });

  describe('deleteFile', () => {
    it('should delete a file from Cloudinary and database', async () => {
      (cloudinary.uploader.destroy as jest.Mock).mockImplementation((publicId, callback) => {
        callback(null, { result: 'ok' });
      });

      await service.deleteFile(mockAttachment.id);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(mockAttachment.cloudProviderId, expect.any(Function));
      expect(repository.remove).toHaveBeenCalledWith(mockAttachment);
    });

    it('should handle non-existent files', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteFile('non-existent-id')).rejects.toThrow('File not found');
    });

    it('should handle Cloudinary deletion errors', async () => {
      (cloudinary.uploader.destroy as jest.Mock).mockImplementation((publicId, callback) => {
        callback(new Error('Deletion failed'), null);
      });

      await expect(service.deleteFile(mockAttachment.id)).rejects.toThrow('Deletion failed');
    });
  });

  describe('getFile', () => {
    it('should return file information', async () => {
      const result = await service.getFile(mockAttachment.id);
      expect(result).toEqual(mockAttachment);
    });

    it('should handle non-existent files', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getFile('non-existent-id')).rejects.toThrow('File not found');
    });
  });
}); 