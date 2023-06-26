import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserLoginDto, UserRegisterDto } from "../dto/userDto";
import { dbClient } from "../config/db";

export const register = async (req: Request, res: Response) => {
  const { email, password, username, firstName, lastName }: UserRegisterDto =
    req.body;
  try {
    // Create new User & Profile
    const newUser = await dbClient.user.create({
      data: {
        email: email,
        password: password,
        username: username,
      },
    });

    await dbClient.profile.create({
      data: { firstname: firstName, lastname: lastName, userId: newUser.id },
    });

    // Generate JWT
    const token = jwt.sign({ id: newUser.id }, String(process.env.JWT_SECRET), {
      expiresIn: 60 * 60 * 12,
    });

    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password }: UserLoginDto = req.body;

  try {
    // Check if user exists
    const user = await dbClient.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    if (password !== user.password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, String(process.env.JWT_SECRET), {
      expiresIn: 60 * 60 * 12,
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
  }
};
