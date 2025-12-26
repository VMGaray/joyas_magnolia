/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FileUploadRepository } from './image-upload.repository';

@Injectable()
export class FileUploadService {
  constructor(private readonly fileUploadRepository: FileUploadRepository) {}

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<string> {
    try {
      const uploadResponse = await this.fileUploadRepository.uploadImage(
        file,
        folder,
      );
      return uploadResponse.secure_url;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error uploading image to Cloudinary: ${error.message}`,
      );
    }
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await this.fileUploadRepository.deleteImage(publicId);
      return result.result === 'ok';
    } catch (error) {
      return false;
    }
  }

  async deleteImageByUrl(imageUrl: string): Promise<boolean> {
    try {
      const result = await this.fileUploadRepository.deleteImageByUrl(imageUrl);

      // Si el resultado indica "not_found" pero no es un error, considerarlo éxito
      if (result && result.result === 'not_found') {
        console.warn(`Imagen no encontrada en Cloudinary: ${imageUrl}`);
        return true; // Considerar como éxito para continuar
      }

      return result.result === 'ok';
    } catch (error) {
      throw error; // Propagar el error para que el caller lo maneje
    }
  }

  extractPublicIdFromUrl(imageUrl: string): string | null {
    return this.fileUploadRepository.extractPublicIdFromUrl(imageUrl);
  }
}
