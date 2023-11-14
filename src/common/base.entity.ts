import { Expose } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Expose()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Expose()
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
