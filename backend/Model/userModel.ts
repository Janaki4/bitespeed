import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../DB/config';

// Define an interface representing a contact's attributes
interface ContactAttributes {
  id: number;
  phoneNumber: string;
  email: string;
  linkedId?: number;
  linkPrecedence: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContactCreationAttributes extends Optional<ContactAttributes, 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'> { }

class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
  public id!: number;
  public phoneNumber!: string;
  public email!: string;
  public linkedId?: number;
  public linkPrecedence!: string;
  public deletedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Contact.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  linkedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  linkPrecedence: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'contacts',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

export default Contact;
