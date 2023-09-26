import {
  Controller,
  Post,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/portal/file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: '.(jpg|jpeg|png|pdf|docx|doc|xlsx|xls)',
          }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const req = {
      files,
      prospectId: 1234,
    };
    return await this.fileService.getUrls(req);
  }

  @Post('/single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: '.(jpg|jpeg|png|pdf|docx|doc|xlsx|xls)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const req = {
      files: [file],
      prospectId: 1234,
    };
    return await this.fileService.getUrls(req);
  }

  @Post('/local-upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    console.log('file', file);

    return 'File upload API';
  }
}
