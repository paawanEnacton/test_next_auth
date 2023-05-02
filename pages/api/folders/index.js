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

const createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    const validateFoldersSchema = yup.object().shape({
      name: yup.string().required("Name is required"),
    });
    validateFoldersSchema.validateSync(req.body);

    let session = {
      user: {
        userId: 1001,
      },
    };

    const checkDuplicateFolder = await prisma.folders.findFirst({
      where: {
        name: { equals: name.toLowerCase() },
      },
    });

    if (checkDuplicateFolder) {
      return responseWithRestData(
        res,
        HTTP_STATUS.ALREADY_EXISTS,
        "Folder already exists",
        null
      );
    }

    let randomString = Math.random().toString(36).substring(2, 12);
    const checkCode = await generateRandomString(
      randomString,
      "folders",
      "code"
    );

    const saveData = await prisma.folders.create({
      data: {
        name: name.toLowerCase(),
        user_id: session.user.userId,
        code: checkCode.code,
      },
    });

    if (!saveData) {
      throw new Error("Could not created folder");
    }

    return responseWithRestData(
      res,
      HTTP_STATUS.CREATED,
      "Folder created successfully",
      saveData
    );
  } catch (error) {
    return responseWithRestError(res, error);
  }
};

const getAllFolders = async (req, res) => {
  try {
    let session = {
      user: {
        userId: 1001,
      },
    };
    const getFolders = await prisma.folders.findMany({
      where: {
        user_id: session.user.userId,
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

    return responseWithRestData(
      res,
      HTTP_STATUS.SUCCESS,
      "Folders found successfully",
      getFolders
    );
  } catch (error) {
    return responseWithRestError(res, error);
  }
};
export default async function handler(req, res) {
  if (req.method === "GET") {
    return await getAllFolders(req, res);
  }
  if (req.method === "POST") {
    return await createFolder(req, res);
  }
}
