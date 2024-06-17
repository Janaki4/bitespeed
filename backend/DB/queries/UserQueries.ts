import BaseQueries from './BaseQueries';
import sequelize from '../config'
import { QueryTypes, BindOrReplacements } from 'sequelize';
import Sequelize from "sequelize";

class UserQueries extends BaseQueries {
  constructor() {
    super()
  }
}

const queries = new UserQueries();
export default queries;
