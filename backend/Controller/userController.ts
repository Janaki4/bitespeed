import aux from '../Utility/auxiliary'
import userQueries from '../DB/queries/UserQueries'
import contactModel from '../Model/userModel'
import { NextFunction, Request, Response } from 'express';
import { FindOptions } from 'sequelize';

class UserController {
  async findDetails(email: string, phNo: number) {
    try {
      const emailWhereClause: FindOptions = {
        where: {
          email
        }
      }
      const findEmail = await contactModel.findAll(emailWhereClause)

      const phoneWhereClause: FindOptions = {
        where: {
          phoneNumber: phNo
        }
      }
      const findPhoneNumber = await contactModel.findAll(phoneWhereClause)

      console.log(findEmail.length, 11111, findPhoneNumber.length, 22222);
      return {
        emailDetails: findEmail,
        phNoDetails: findPhoneNumber
      }
    } catch (error) {
      throw error
    }
  }

  identity() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, phoneNumber } = req.body
        if (!email && !phoneNumber) return res.status(400).json("Either one should be present")
        const { emailDetails, phNoDetails } = await this.findDetails(email, phoneNumber)
        if (!emailDetails.length && !phNoDetails.length) {
          const result = (await userQueries.createData(contactModel, { email: email, phoneNumber: phoneNumber, linkPrecedence: 'primary', deletedAt: null }))?.dataValues
          console.log(result, 111);
          return res.status(200).json({
            "contact": {
              "primaryContatctId": result?.id,
              "emails": [result?.email],
              "phoneNumbers": [result?.phoneNumber],
              "secondaryContactIds": []
            }
          })
        }
        else if (!emailDetails.length && phNoDetails.length == 1) {
          const { id, email: secondEmail, phoneNumber: secondPhoneNumber } = phNoDetails?.[0]
          const result = (await userQueries.createData(contactModel, { email: email, phoneNumber: phoneNumber, linkedId: id, linkPrecedence: 'secondary', deletedAt: null }))?.dataValues
          console.log(result, email, secondEmail, 222);
          return res.status(200).json({
            "contact": {
              "primaryContatctId": id,
              "emails": [secondEmail, email],
              "phoneNumbers": [phoneNumber],
              "secondaryContactIds": [result?.id]
            }
          })
        }
        else if (!emailDetails.length && phNoDetails.length > 1) {
          if (email == null) {
            let primaryId: number = 0
            let secondaryIds: Array<number> = []
            let primaryEmail: Array<string> = []
            let secondaryEmails: Array<string> = []
            let primaryPho: Array<string> = []
            let secondaryPhone: Array<string> = []
            phNoDetails.forEach((el) => {
              if (el.linkPrecedence == "primary") {
                primaryId = el?.id
                primaryEmail.push(el?.email)
                primaryPho.push(el?.phoneNumber)
              }
              else {
                secondaryIds.push(el?.id)
                secondaryEmails.push(el?.email)
                secondaryPhone.push(el?.phoneNumber)
              }
            })
            return res.status(200).json({
              "contact": {
                "primaryContatctId": primaryId,
                "emails": [...new Set([...primaryEmail, ...secondaryEmails])],
                "phoneNumbers": [...new Set([...primaryPho, ...secondaryPhone])],
                "secondaryContactIds": secondaryIds
              }
            })
          }
          let primaryId: number = 0
          let secondaryIds: Array<number> = []
          let primaryEmail: Array<string> = []
          let secondaryEmails: Array<string> = []
          phNoDetails.forEach((el) => {
            if (el.linkPrecedence == "primary") {
              primaryId = el?.id
              primaryEmail.push(el?.email)
            }
            else {
              secondaryIds.push(el?.id)
              secondaryEmails.push(el?.email)
            }
          })
          const result = (await userQueries.createData(contactModel, { email: email, phoneNumber: phoneNumber, linkedId: primaryId, linkPrecedence: 'secondary', deletedAt: null }))?.dataValues
          return res.status(200).json({
            "contact": {
              "primaryContatctId": primaryId,
              "emails": [...primaryEmail, ...secondaryEmails, result?.email],
              "phoneNumbers": [result?.phoneNumber],
              "secondaryContactIds": [...secondaryIds, result?.id]
            }
          })
        }
        else if (emailDetails.length && !phNoDetails.length) {
          const phone = emailDetails?.[0]?.phoneNumber
          const whereClause: FindOptions = {
            where: {
              phoneNumber: phone
            }
          }
          const extraDetails = await contactModel.findAll(whereClause)
          let primaryId: number = 0
          let secondaryIds: Array<number> = []
          let primaryEmail: Array<string> = []
          let secondaryEmails: Array<string> = []
          let primaryPho: Array<string> = []
          let secondaryPhone: Array<string> = []
          extraDetails.forEach((el) => {
            if (el.linkPrecedence == "primary") {
              primaryId = el?.id
              primaryEmail.push(el?.email)
              primaryPho.push(el?.phoneNumber)
            }
            else {
              secondaryIds.push(el?.id)
              secondaryEmails.push(el?.email)
              secondaryPhone.push(el?.phoneNumber)
            }
          })
          return res.status(200).json({
            "contact": {
              "primaryContatctId": primaryId,
              "emails": [...new Set([...primaryEmail, ...secondaryEmails])],
              "phoneNumbers": [...new Set([...primaryPho, ...secondaryPhone])],
              "secondaryContactIds": secondaryIds
            }
          })
        }
        else if (emailDetails.length == 1 && phNoDetails.length == 1) {
          const firstId = emailDetails?.[0]?.id
          const secondId = phNoDetails?.[0]?.id
          if (firstId == secondId) {
            return res.status(200).json({
              "contact": {
                "primaryContatctId": firstId,
                "emails": [emailDetails?.[0]?.email],
                "phoneNumbers": [emailDetails?.[0]?.phoneNumber],
                "secondaryContactIds": []
              }
            })
          }
          else {
            const updatePrimary = await userQueries.update(contactModel, { email: phNoDetails?.[0]?.email }, { linkPrecedence: 'secondary', linkedId: firstId })
            return res.status(200).json({
              "contact": {
                "primaryContatctId": firstId,
                "emails": [emailDetails?.[0]?.email, phNoDetails?.[0]?.email],
                "phoneNumbers": [emailDetails?.[0]?.phoneNumber, phNoDetails?.[0]?.phoneNumber],
                "secondaryContactIds": [secondId]
              }
            })
          }
        }
        else {
          let primaryId: number = 0
          let primaryEmail: Array<string> = []
          let primaryPhone: Array<string> = []
          let secondaryEmail: Array<string> = []
          let secondaryPhone: Array<string> = []
          let secondaryIds: Array<number> = []
          emailDetails.forEach((el) => {
            if (el?.linkPrecedence == 'primary') {
              primaryId = el?.id
              primaryEmail.push(el?.email)
              primaryPhone.push(el?.phoneNumber)
            }
            else {
              secondaryEmail.push(el?.email)
              secondaryPhone.push(el?.phoneNumber)
              secondaryIds.push(el?.id)
            }
          })
          phNoDetails.forEach((el) => {
            if (el?.linkPrecedence == 'primary') {
              primaryId = el?.id
              primaryEmail.push(el?.email)
              primaryPhone.push(el?.phoneNumber)
            }
            else {
              secondaryEmail.push(el?.email)
              secondaryPhone.push(el?.phoneNumber)
              secondaryIds.push(el?.id)
            }
          })

          return res.status(200).json({
            "contact": {
              "primaryContatctId": primaryId,
              "emails": [...new Set([...primaryEmail, ...secondaryEmail])],
              "phoneNumbers": [...new Set([...primaryPhone, ...secondaryPhone])],
              "secondaryContactIds": [...new Set([...secondaryIds])]
            }
          })
        }
      } catch (error) {
        console.log(error);
        const { errorName } = aux.getSequelizeError(error)
        return aux.sendResponse(res, 400, errorName || 'Internal server error - 1', null)
      }
    }
  }

}


const controller = new UserController();
export default controller;
