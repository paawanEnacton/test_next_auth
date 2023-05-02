import {
  responseWithRestData,
  responseWithRestError,
} from "../../../common/commonFunctions";
import { HTTP_STATUS } from "../../../common/statusCode";
import prisma from "../../../prisma/index";
import * as yup from "yup";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validateSignUpSchema = yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup.string().email().required("Email is required."),
      password: yup.string().required("Email is required."),
    });

    validateSignUpSchema.validateSync(req.body);

    const checkExistingUser = await prisma.users.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (checkExistingUser) {
      return responseWithRestData(
        res,
        HTTP_STATUS.ALREADY_EXISTS,
        "User already exists!",
        null
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Register user and save the user data in the database
    const saveData = await prisma.users.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
      },
    });

    if (saveData) {
      // Registered in successfully
      return responseWithRestData(
        res,
        HTTP_STATUS.CREATED,
        "You have been registered successfully! Please try to login.",
        null
      );
    } else {
      return responseWithRestData(
        res,
        HTTP_STATUS.NOT_SUCCESS,
        "Error while registering user! Please try again later.",
        null
      );
    }
  } catch (error) {
    return responseWithRestError(res, error);
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await registerUser(req, res);
  }
}
