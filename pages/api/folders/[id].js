import {
  generateRandomString,
  responseWithRestData,
  responseWithRestError,
} from "../../../common/commonFunctions";
import { HTTP_STATUS } from "../../../common/statusCode";
import prisma from "../../../prisma/index";
import * as yup from "yup";

// import { authOptions } from "../auth/[...nextauth]";
// import { getServerSession } from "next-auth/next";

const updateFolder = async (req, res) => {
  try {
    const { folderId, name } = req.body;

    const validateFoldersSchema = yup.object().shape({
      name: yup.string().required("Name is required"),
    });
    validateFoldersSchema.validateSync(req.body);

    let session = {
      user: {
        userId: 1001,
      },
    };

    // check if the folderId exists
    const checkFolderExistance = await prisma.folders.findFirst({
      where: {
        id: folderId,
        // name: { equals: name.toLowerCase() },
      },
    });

    if (!checkFolderExistance) {
      return responseWithRestData(
        res,
        HTTP_STATUS.NOT_FOUND,
        "Folder does not exist",
        null
      );
    }

    // check on update time that name should only gets updated on the id which it found and not on any other id
    const checkFolderExistanceOnUpdate = await prisma.folders.findFirst({
      where: {
        name: { equals: name.toLowerCase() },
        NOT: {
          id: folderId,
        },
      },
    });

    console.log(
      "checkFolderExistanceOnUpdate :>> ",
      checkFolderExistanceOnUpdate
    );

    // const saveData = await prisma.folders.create({
    //   data: {
    //     name: name.toLowerCase(),
    //     user_id: session.user.userId,
    //     code: checkCode.code,
    //   },
    // });

    // if (!saveData) {
    //   throw new Error("Could not created folder");
    // }

    // return responseWithRestData(
    //   res,
    //   HTTP_STATUS.CREATED,
    //   "Folder created successfully",
    //   saveData
    // );
  } catch (error) {
    return responseWithRestError(res, error);
  }
};

const getFolderById = async (req, res) => {
  try {
    let session = {
      user: {
        userId: 1001,
      },
    };
    const getFolder = await prisma.folders.findFirst({
      where: {
        id: parseInt(req.query.id),
        user_id: session.user.userId,
      },
    });
    if (!getFolder) {
      return responseWithRestData(
        res,
        HTTP_STATUS.NOT_FOUND,
        "No folder found",
        null
      );
    }

    return responseWithRestData(
      res,
      HTTP_STATUS.SUCCESS,
      "Folder found successfully",
      getFolder
    );
  } catch (error) {
    return responseWithRestError(res, error);
  }
};
const deleteFolder = async (req, res) => {
  try {
    let session = {
      user: {
        userId: 1001,
      },
    };
    const getFolders = await prisma.folders.findFirst({
      where: {
        id: parseInt(req.query.id),
        // user_id: session.user.userId,
      },
    });
    if (!getFolders) {
      return responseWithRestData(
        res,
        HTTP_STATUS.NOT_FOUND,
        "No folder found",
        null
      );
    }

    const deleteData = await prisma.folders.delete({
      where: {
        id: parseInt(req.query.id),
        // user_id: session.user.userId,
      },
    });

    if (!deleteData) {
      throw new Error("Could not delete folder");
    }

    return responseWithRestData(
      res,
      HTTP_STATUS.SUCCESS,
      "Folder deleted successfully",
      deleteData
    );
  } catch (error) {
    return responseWithRestError(res, error);
  }
};
export default async function handler(req, res) {
  if (req.method === "GET") {
    return await getFolderById(req, res);
  }
  if (req.method === "POST") {
    return await updateFolder(req, res);
  }
  if (req.method === "DELETE") {
    return await deleteFolder(req, res);
  }
}
