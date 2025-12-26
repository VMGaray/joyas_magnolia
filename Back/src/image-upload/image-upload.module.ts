import { Module } from '@nestjs/common';
import { FileUploadService } from './image-upload.service';
import { FileUploadRepository } from './image-upload.repository';
import { CloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  controllers: [],
  providers: [FileUploadService, FileUploadRepository, CloudinaryConfig],
  exports: [FileUploadService, FileUploadRepository],
})
export class UploadImageModule {}
