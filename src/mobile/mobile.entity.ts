import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Mobile extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'bigint', nullable: true })
  number: number;

  @Column()
  originalNumber: string;

  @Column({ nullable: true })
  changed: string;

  @Column()
  isValid: boolean;

  @Column()
  deleted: boolean;

  @Column('simple-json', { nullable: true })
  suggestions: { number: number; changed: string };
}
