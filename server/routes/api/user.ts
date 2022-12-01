// import passport from "passport";
// import strategy from "../../config/passport";
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

// passport.use(strategy);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  const { publicAddress } = req.query as { publicAddress: string };
  if (!publicAddress) {
    return next(
      new BadRequestResponse("Please provide public address of wallet!")
    );
  }
  User.findOne(
    { publicAddress },
    (
      err: any,
      user: { nonce: Number; publicAddress: string; username: string }
    ) => {
      if (err) {
        return next(new BadRequestResponse("Something went wrong!"));
      } else if (!user) {
        return next(new OkResponse({ status: false }));
      }
      next(new OkResponse({ status: true }));
    }
  );
});

router.post("/signin");

export default router;
