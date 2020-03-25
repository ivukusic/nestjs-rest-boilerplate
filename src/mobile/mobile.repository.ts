import { Repository, EntityRepository } from 'typeorm';
import { Mobile } from './mobile.entity';

@EntityRepository(Mobile)
export class MobileRepository extends Repository<Mobile> {
  async saveNumbers(numbers: Mobile[]) {
    try {
      await this.createQueryBuilder('mobile')
        .insert()
        .values(numbers)
        .execute();
    } catch (e) {
      const result = await this.find({ select: ['id'] });
      const ids = result.map(item => item.id);
      const newNumbers = numbers.filter(item => !ids.includes(item.id));
      console.log(newNumbers);
      if (newNumbers.length) {
        await this.createQueryBuilder('mobile')
          .insert()
          .values(newNumbers)
          .execute();
      }
    }
    return numbers;
  }
}
