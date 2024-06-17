import { Response } from 'express';
declare type successCallback = () => void;

class Auxiliary {
  constructor() { }

  getSequelizeError(error: any) {
    // let errorArr = []
    let errorName = error?.errors?.[0]?.message || error?.name || "SequelizeError"
    // error?.errors?.forEach(el => {
    //     errorArr?.push(el?.message)
    // });
    // if (errorArr.length === 0) errorArr.push(error?.original?.error || error?.parent)
    return {
      errorName,
      // errorArr
    }
  }

  sendResponse(res: Response, status: number, message: string, data?: any, successCallback?: successCallback) {
    res?.status(status)?.json({
      status,
      message,
      data: data?.meta ? data.data : data,
      meta: data?.meta || {},
      filter: data?.filter || {},
    });
    if (successCallback) {
      try {
        successCallback();
      } catch (error) {
        console.log(error, "callback function caused error");
      }
    }
  }
}

const aux = new Auxiliary()

export default aux;
