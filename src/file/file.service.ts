import { FileDataReq, FileDataRes } from './dto/create-file.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  async getUrls(uploadData: FileDataReq): Promise<FileDataRes> {
    const { prospectId } = uploadData;
    const response = { urls: [], prospectId };
    const { files } = uploadData;

    for (const file of files) {
      const { originalname } = file;
      const url = `/${prospectId}/${new Date().getTime()}_${originalname
        .trim()
        .split(' ')
        .join('_')}`;
      response.urls.push(url);
    }
    return response;
  }
}
