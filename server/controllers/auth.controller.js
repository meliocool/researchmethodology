import * as Yup from "yup";
import { encrypt } from "../utils/encryption.js";
import { generateToken } from "../utils/jwt.js";
import response from "../utils/response.js";
import UserModel from "../models/user.model.js";

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test(
      "at-least-one-uppercase-letter",
      "Contains at least one uppercase character",
      (value) => /[A-Z]/.test(value)
    )
    .test("at-least-one-number", "Contains at least one number", (value) =>
      /\d/.test(value)
    ),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password not Matched!"),
});

export default {
  async register(req, res) {
    const { fullName, username, email, password, confirmPassword } = req.body;
    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });

      response.success(res, result, "Registration Success!");
    } catch (error) {
      response.error(res, error, "Registration Failed!");
    }
  },

  async login(req, res) {
    const { identifier, password } = req.body;
    try {
      const user = await UserModel.findOne({ identifier });

      if (!user || !user.is_active) {
        return response.unauthorized(res, "User Not Found or Inactive!");
      }

      const isPasswordValid = encrypt(password) === user.password_hash;
      if (!isPasswordValid) {
        return response.unauthorized(res, "Incorrect Credentials!");
      }

      const token = generateToken({
        id: user.id,
        role: user.role,
      });

      response.success(res, token, `Login Success! for user: ${identifier}!`);
    } catch (error) {
      response.error(res, error, "Login Failed!");
    }
  },

  async me(req, res) {
    try {
      const user = await UserModel.findById(req.user?.id);
      if (!user) return response.notFound(res, "User not found");

      delete user.password_hash;
      response.success(res, user, "Authorized to get User Profile");
    } catch (error) {
      response.error(res, error, "Failed to get User Profile!");
    }
  },

  async activation(req, res) {
    try {
      const { code } = req.body;
      const user = await UserModel.activateUser(code);

      if (!user) {
        return response.notFound(res, "Invalid or expired activation code.");
      }

      response.success(res, user, "User Successfully Activated!");
    } catch (error) {
      response.error(res, error, "Activation failed!");
    }
  },
};
