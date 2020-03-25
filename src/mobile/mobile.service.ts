import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import * as csv from 'csvtojson';
import { isValidMobileNumber, getSuggestions } from '../common/utils/number.util';
import { SaveNumberDto } from './dto/save-number.dto';
import { MobileRepository } from './mobile.repository';
import { Mobile } from './mobile.entity';

@Injectable()
export class MobileService {
  constructor(@InjectRepository(MobileRepository) private mobileRepository: MobileRepository) {}

  async getNumbers(options: IPaginationOptions): Promise<Pagination<Mobile>> {
    const data = await paginate<Mobile>(this.mobileRepository, options);
    return data;
  }

  async getNumberById(id: number): Promise<Mobile> {
    const found = await this.mobileRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Mobile number with id "${id}" not found`);
    }
    return found;
  }

  async saveNumberById(id: number, saveNumberDto: SaveNumberDto): Promise<Mobile> {
    const number = await this.getNumberById(id);
    number.number = saveNumberDto.number;
    number.changed = saveNumberDto.changed;
    number.isValid = true;
    number.suggestions = null;
    await number.save();
    return number;
  }

  readCSV = async (file: any): Promise<any> => {
    const numbers = await this.parseCSV(file);
    await this.mobileRepository.saveNumbers(numbers);
    return await paginate<Mobile>(this.mobileRepository, { page: 1, limit: 10 });
  };

  parseCSV = (file: any): Promise<Mobile[]> => {
    return new Promise(async resolve => {
      const numbers = [];
      try {
        await csv({ output: 'csv' })
          .fromString(file.buffer.toString('utf8'))
          .then(csvRow => {
            csvRow.forEach(row => {
              let changed = null;
              let number = row[1];
              const deleted = number.includes('_DELETED_');
              let suggestions = getSuggestions(number);
              if (suggestions.length === 1) {
                number = suggestions[0].number;
                changed = suggestions[0].changed;
                suggestions = null;
              } else if (suggestions.length === 0) {
                suggestions = null;
              }
              const isValid = isValidMobileNumber(number);
              numbers.push({
                id: parseInt(row[0], 10),
                changed,
                originalNumber: number,
                number: isValid ? parseInt(number, 10) : null,
                isValid,
                deleted,
                suggestions,
              });
            });
          });
        resolve(numbers);
      } catch (e) {
        resolve(numbers);
      }
    });
  };
}
