import { db } from 'src/database/sequelize';
import { Table, Column, Model, PrimaryKey } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: "user",
})
class UserModel extends Model {
  @Column({primaryKey: true,autoIncrement:true})
  id!: number;

  @Column
  name!: string;
  
  @Column
  email!: string;
  
  @Column
  password!: string;

  @Column
  createdAt!: Date;

}

export default UserModel;