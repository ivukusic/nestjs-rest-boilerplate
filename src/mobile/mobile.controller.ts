import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Patch,
  ForbiddenException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';

import { MobileService } from './mobile.service';
import { PaginationDto } from '../common/dto/pagination.dto.';
import { SaveNumberDto } from './dto/save-number.dto';
import { FileUploadDto } from './dto/file-upload.dto';

@Controller('mobile')
@UseGuards(AuthGuard('jwt'))
export class MobileController {
  constructor(private mobileService: MobileService) {}

  @Get()
  getNumbers(@Param() getNumbersDto: PaginationDto) {
    const page = getNumbersDto.page || 1;
    const limit = getNumbersDto.limit || 10;
    return this.mobileService.getNumbers({ page, limit, route: '/mobile' });
  }

  @Get('/:id')
  getNumberById(@Param('id', ParseIntPipe) id: number) {
    return this.mobileService.getNumberById(id);
  }

  @Patch('/:id')
  saveNumbers(@Param('id', ParseIntPipe) id: number, @Body() saveNumberDto: SaveNumberDto) {
    return this.mobileService.saveNumberById(id, saveNumberDto);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ description: 'List of cats', type: FileUploadDto })
  async uploadFile(@UploadedFile() file) {
    if (file.mimetype !== 'text/csv') {
      throw new ForbiddenException('Not supported file type');
    }
    return await this.mobileService.readCSV(file);
  }
}
