import passport from "passport";
import strategy from "../../config/passport";
import secret from "@secret";
import jwt from "jsonwebtoken";
import User from "@models/User";
import { Router, Request, Response, NextFunction } from "express";
const {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

const router = Router();

passport.use(strategy);

export default router;
