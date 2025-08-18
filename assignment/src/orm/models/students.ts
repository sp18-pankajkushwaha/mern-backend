import * as Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';
import { DataTypes, Model, Optional } from 'sequelize';
/**
 * students Model
 * Auto-generated from table: students
 * Generated: 2025-08-17T17:02:53.422Z
 */
export interface studentsAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  addressId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export type studentsPk = "id";
export type studentsId = students[studentsPk];
export type studentsOptionalAttributes = "id" | "profileImage" | "addressId" | "createdAt" | "updatedAt";
export type studentsCreationAttributes = Optional<studentsAttributes, studentsOptionalAttributes>;
export class students extends Model<studentsAttributes, studentsCreationAttributes> implements studentsAttributes {
  id?: number;
  name!: string;
  email!: string;
  password!: string;
  profileImage?: string;
  addressId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  // Association methods will be added here
  // Example:
  // user!: User;
  // getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  // setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  // createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;
  static initModel(sequelize: Sequelize.Sequelize): typeof students {
    return students.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      profileImage: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      addressId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
        references: {
          model: 'address',
          key: 'id'
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    }, {
      sequelize,
      tableName: 'students',
      timestamps: false,
      hooks: {
      beforeCreate: async (user, options) => {
      if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
     }
   },
     beforeUpdate: async (user, options) => {
     if (user.changed('password')) {
     user.password = await bcrypt.hash(user.password, 10);
    }
  }
},
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" }
          ]
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "email" }
          ]
        },
        {
          name: "address_id",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "address_id" }
          ]
        }
      ]
    });
  }
     static associate(models: any) {
     const Students: typeof students = models.students;
     
     // Define associations here
     // Example:
     // Students.belongsTo(models.User, { foreignKey: "userId" });
     // models.User.hasMany(students, { foreignKey: "userId" });

     Students.belongsTo(models.address, { 
      foreignKey: 'address_id', as: 'address' 
    });

   }
 }
 
 export default students;