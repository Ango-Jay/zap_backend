import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
    private configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary.cloud_name'),
      api_key: this.configService.get('cloudinary.api_key'),
      api_secret: this.configService.get('cloudinary.api_secret'),
    });
  }

  private generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = randomBytes(8).toString('hex');
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  }

  private getFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('application/pdf')) return 'document';
    return 'other';
  }

  async uploadFile(file: Express.Multer.File, noteId: string): Promise<Attachment> {
    const fileName = this.generateUniqueFileName(file.originalname);
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id: fileName,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      upload.end(file.buffer);
    });

    const cloudinaryResult = result as any;
    
    const attachment = this.attachmentRepository.create({
      originalName: file.originalname,
      fileName: fileName,
      mimeType: file.mimetype,
      fileSize: file.size,
      url: cloudinaryResult.secure_url,
      cloudProvider: 'cloudinary',
      cloudProviderId: cloudinaryResult.public_id,
      noteId: noteId,
      type: this.getFileType(file.mimetype)
    });

    return this.attachmentRepository.save(attachment);
  }

  async deleteFile(id: string): Promise<void> {
    const attachment = await this.attachmentRepository.findOne({ where: { id } });
    if (!attachment) {
      throw new Error('File not found');
    }

    // Delete from Cloudinary
    if (attachment.cloudProvider === 'cloudinary' && attachment.cloudProviderId) {
      await new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(attachment.cloudProviderId, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
    }

    await this.attachmentRepository.remove(attachment);
  }

  async getFile(id: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({ where: { id } });
    if (!attachment) {
      throw new Error('File not found');
    }
    return attachment;
  }
} 