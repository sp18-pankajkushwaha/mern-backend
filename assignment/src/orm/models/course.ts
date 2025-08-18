import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
/**
 * course Model
 * Auto-generated from table: course
 * Generated: 2025-08-17T17:03:32.171Z
 */
export interface courseAttributes {
  id?: number;
  title: string;
  description?: string;
  duration: number;
  fee?: number;
  teacherId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export type coursePk = "id";
export type courseId = course[coursePk];
export type courseOptionalAttributes = "id" | "description" | "fee" | "teacherId" | "createdAt" | "updatedAt";
export type courseCreationAttributes = Optional<courseAttributes, courseOptionalAttributes>;
export class course extends Model<courseAttributes, courseCreationAttributes> implements courseAttributes {
  id?: number;
  title!: string;
  description?: string;
  duration!: number;
  fee?: number;
  teacherId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  // Association methods will be added here
  // Example:
  // user!: User;
  // getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  // setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  // createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;
  static initModel(sequelize: Sequelize.Sequelize): typeof course {
    return course.init({
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fee: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'teacher',
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
      tableName: 'course',
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "id" }
          ]
        }
      ]
    });
  }
     static associate(models: any) {
     const Course: typeof course = models.course;
     
     // Define associations here
     // Example:
     // Course.belongsTo(models.User, { foreignKey: "userId" });
     // models.User.hasMany(course, { foreignKey: "userId" });
    Course.belongsToMany(models.teacher, { 
    through: 'courseTeacher',
    foreignKey: 'course_id', as: 'teachers'
    });
   }
 }
 
 export default course;