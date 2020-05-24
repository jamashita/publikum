import mysql from 'mysql';

import { JSObjectNotation, Nullable, Reject, Resolve } from '@publikum/type';

import { Connection } from './Connection';
import { MySQLError } from './Error/MySQLError';
import { IMySQL } from './Interface/IMySQL';
import { ITransaction } from './Interface/ITransaction';

export type MySQLConfig = mysql.PoolConfig;
type Value = Readonly<Record<string, unknown>>;

export class MySQL implements IMySQL {
  private readonly pool: mysql.Pool;

  public constructor(config: MySQLConfig) {
    const pool: mysql.Pool = mysql.createPool(config);

    pool.on('connection', (connection: mysql.Connection) => {
      connection.config.queryFormat = (query: string, value?: Value) => {
        if (value === undefined) {
          return query;
        }

        return query.replace(/:(?<placeholder>\w+)/gu, (txt: string, key: string) => {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            return connection.escape(value[key]);
          }

          return 'NULL';
        });
      };
    });

    this.pool = pool;
  }

  private getConnection(): Promise<Connection> {
    return new Promise<Connection>((resolve: Resolve<Connection>, reject: Reject) => {
      this.pool.getConnection((err1: mysql.MysqlError, connection: mysql.PoolConnection) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
        if (err1) {
          reject(new MySQLError('MySQL.getConnection()', err1));

          return;
        }

        connection.beginTransaction((err2: mysql.MysqlError) => {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
          if (err2) {
            reject(new MySQLError('MySQL.getConnection()', err2));

            return;
          }

          resolve(new Connection(connection));
        });
      });
    });
  }

  public async transact<R>(transaction: ITransaction<R>): Promise<R> {
    const connection: Connection = await this.getConnection();

    // prettier-ignore
    try {
      const ret: R = await transaction.with(connection);

      await connection.commit();
      connection.release();

      return ret;
    }
    catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  }

  public execute<R>(sql: string, value?: JSObjectNotation): Promise<R> {
    return new Promise<R>((resolve: Resolve<R>, reject: Reject) => {
      this.pool.query(sql, value, (err: Nullable<mysql.MysqlError>, result: R) => {
        if (err !== null) {
          reject(new MySQLError('MySQL.execute()', err));

          return;
        }

        resolve(result);
      });
    });
  }
}