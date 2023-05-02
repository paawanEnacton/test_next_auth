import prisma from "../prisma/index";

const { HTTP_STATUS } = require("./statusCode");

export const dbStatus = {
  ACTIVE: "active",
};

const add_minutes = function (dt, minutes) {
  return new Date(dt.getTime() + minutes * 60000);
};

const subtractTimeFromDate = (objDate, intHours) => {
  const numberOfMlSeconds = objDate.getTime();
  const addMlSeconds = intHours * 60 * 60 * 1000;
  const newDateObj = new Date(numberOfMlSeconds - addMlSeconds);

  return newDateObj;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addHours = (numOfHours, date = new Date()) => {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  return date;
};

const responseWithRestData = (
  res,
  httpResponse,
  message,
  data,
  rowsCount = null
) => {
  return res.status(httpResponse.statusCode).json({
    status: httpResponse.status,
    message: message,
    data: data,
    rowsCount,
  });
};

const responseWithRestError = (res, error) => {
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.statusCode).json({
    status: false,
    message: error.message,
  });
};

const generateRandomString = async (text, tableName, columnName) => {
  try {
    const checkClickCodeInDB = await prisma?.[tableName].findFirst({
      where: {
        [columnName]: {
          equals: text,
        },
      },
    });

    let generateCode;
    if (checkClickCodeInDB) {
      generateCode = Math.random().toString(36).substring(2, 12);
      generateRandomString(generateCode, tableName, columnName);
    } else {
      return { status: true, code: text };
    }
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
};

module.exports = {
  // dbStatus,
  responseWithRestData,
  responseWithRestError,
  addHours,
  subtractTimeFromDate,
  addDays,
  add_minutes,
  generateRandomString,
};
