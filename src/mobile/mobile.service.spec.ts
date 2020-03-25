import { Test } from '@nestjs/testing';
import * as paginate from 'nestjs-typeorm-paginate';
import { MobileService } from './mobile.service';
import { MobileRepository } from './mobile.repository';
import { NotFoundException } from '@nestjs/common';

const mockNumber = {
  id: '103220561',
  isValid: true,
  deleted: false,
  number: 824469836,
  originalNumber: 824469836,
  changed: null,
  suggestions: [{ number: 27824469836, changed: 'first-two' }],
};
const mockExpectedNumber = {
  ...mockNumber,
  changed: 'first-two',
  number: 27824469836,
  suggestions: null,
};
const mockNumbers = {
  itemCount: 1,
  totalItems: 1,
  pageCount: 1,
  next: '',
  previous: '',
  data: {
    '103220561': mockNumber,
  },
};
const buffer = `id,sms_phone
103220561,824469836`;

const mockMobileRepository = () => ({
  findOne: jest.fn(),
  saveNumbers: jest.fn(),
});

describe('MobileService', () => {
  let mobileService;
  let mobileRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MobileService, { provide: MobileRepository, useFactory: mockMobileRepository }],
    }).compile();

    mobileService = await module.get<MobileService>(MobileService);
    mobileRepository = await module.get<MobileRepository>(MobileRepository);
  });

  describe('getNumbers ', () => {
    it('get number with pagination', async () => {
      Object.defineProperty(paginate, 'paginate', { value: jest.fn().mockResolvedValue(mockNumbers) });
      expect(await mobileService.getNumbers({ page: 1, limit: 10 })).toEqual(mockNumbers);
    });
  });

  describe('getNumberById ', () => {
    it('get number by id', async () => {
      mobileRepository.findOne.mockResolvedValue(mockNumber);
      const result = await mobileService.getNumberById(1);
      expect(mobileRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockNumber);
    });

    it('throws and error because mobile number could not be found', async () => {
      mobileRepository.findOne.mockResolvedValue(null);
      expect(mobileService.getNumberById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('saveNumberById ', () => {
    it('saves number successfully', async () => {
      const save = jest.fn().mockResolvedValue(true);
      mobileService.getNumberById = jest.fn().mockResolvedValue({
        ...mockNumber,
        save,
      });
      const result = await mobileService.saveNumberById(1, {
        number: mockExpectedNumber.number,
        changed: mockExpectedNumber.changed,
      });
      expect(result).toEqual({ ...mockExpectedNumber, save });
    });
  });

  describe('readCSV ', () => {
    it('saves number successfully', async () => {
      const result = await mobileService.readCSV({ buffer });
      expect(result).toEqual(mockNumbers);
    });
  });
});
