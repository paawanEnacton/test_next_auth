const HTTP_STATUS = {
  CREATED: {
    status: true,
    statusCode: 201,
  },
  UPDATED: {
    status: true,
    statusCode: 202,
  },
  DELETED: {
    status: true,
    statusCode: 202,
  },
  NOT_FOUND: {
    status: false,
    statusCode: 409,
  },
  ALREADY_EXISTS: {
    status: false,
    statusCode: 409,
  },
  SUCCESS: {
    status: true,
    statusCode: 200,
  },
  INTERNAL_SERVER_ERROR: {
    status: false,
    statusCode: 500,
  },
  NOT_SUCCESS: {
    status: false,
    statusCode: 400,
  },
  UNAUTHORIZED: {
    status: false,
    statusCode: 401,
  },
};

module.exports = {
  HTTP_STATUS,
};
