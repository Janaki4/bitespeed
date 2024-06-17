import aux from '../../Utility/auxiliary'
import { CountOptions, FindOptions, Model, Op, Order, Sequelize, WhereOptions } from 'sequelize'

class BaseQueryModel {
  constructor() { }

  async createData(tableName: any, data: any) {
    try {
      const result = await tableName.create({ ...data })
      return result
    } catch (error) {
      throw error
    }
  }

  async bulkCreateData(tableName: any, data: any) {
    try {
      const result = await tableName.bulkCreate(data)
      return result
    } catch (error) {
      throw error
    }
  }

  async getSingleDataByCondition(tableName: any, condition: any, excludeColumns: any[] = []) {
    try {
      const result = await tableName.findOne({
        where: { ...condition },
        returning: true,
        attributes: {
          exclude: excludeColumns
        }
      })
      return result
    } catch (error) {
      throw error
    }
  }

  async findOrCreate(tableName: any, condition: any, newData: any) {
    try {
      const result = await tableName.findOrCreate({
        where: condition,
        defaults: newData
      })
      return result
    } catch (error) {
      throw error
    }
  }

  async update(tableName: any, condition: any, updateData: any) {
    try {
      const result = await tableName.update(updateData, {
        where: condition,
        returning: true
      })
      return result
    } catch (error) {
      throw error
    }
  }

}

export default BaseQueryModel;
