import { Controller, Post, Delete, Get, Param, UseInterceptors, UploadedFile, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Attachment } from './entities/attachment.entity';
import { UserGuard } from '../../common/guards/user.guard';

@Controller('files')
@UseGuards(UserGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/:noteId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Attachment> {
    return this.fileService.uploadFile(file, noteId);
  }

  @Delete(':id')
  async deleteFile(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.fileService.deleteFile(id);
  }

  @Get(':id')
  async getFile(@Param('id', ParseUUIDPipe) id: string): Promise<Attachment> {
    return this.fileService.getFile(id);
  }
} 