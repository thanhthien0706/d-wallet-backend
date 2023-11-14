import { Injectable } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';

@Injectable()
export class TransactionManager {
  constructor(private readonly connection: Connection) {}

  async transaction<T>(callback: (entityManager: EntityManager) => Promise<T>) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release;
    }
  }
}
