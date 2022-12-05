import secret from "@secret";
import jwt from "jsonwebtoken";
import User from "@models/User";
import Web3 from "web3";
import { Router, Request, Response, NextFunction } from "express";
const {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

const router = Router();

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

router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  const { publicAddress, signature, nonce } = req.body;
  console.log(publicAddress);
  User.findOne(
    { publicAddress },
    (
      err: any,
      user: { nonce: Number; publicAddress: string; username: string }
    ) => {
      if (err) {
        return next(new BadRequestResponse("Something went wrong!"));
      } else if (user) {
        return next(new UnauthorizedResponse("User has already registered!"));
      }
      const web3: any = new Web3(
        "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
      );
      const address = web3.eth.accounts.recover(
        `I am signing up with my one-time nonce: ${nonce}`,
        signature
      );
      if (address !== publicAddress) {
        return next(new UnauthorizedResponse("Unauthortized user"));
      }
      const newUser: any = new User();
      newUser.publicAddress = publicAddress;
      newUser.save((err: any, cUser: any) => {
        if (err || !cUser) {
          console.log(err);
          return next(new BadRequestResponse("User creation failed!"));
        }
        console.log(cUser);
        next(new OkResponse(cUser));
      });
    }
  );
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  const { publicAddress } = req.body;
  console.log(publicAddress);
  User.findOne(
    { publicAddress },
    (
      err: any,
      user: { nonce: Number; publicAddress: string; username: string }
    ) => {
      if (err) {
        return next(new BadRequestResponse("Something went wrong!"));
      } else if (!user) {
        return next(new UnauthorizedResponse("User is not registered!"));
      }
      next(new OkResponse(user));
    }
  );
});

router.post(
  "/auth",
  async (req: Request, res: Response, next: NextFunction) => {
    const { publicAddress, signature } = req.body;
    User.findOne({ publicAddress }, (err: any, user: any) => {
      if (err || !user) {
        console.log(err);
        return next(new BadRequestResponse("Something went wrong!"));
      }
      const { nonce } = user;
      const web3: any = new Web3(
        "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
      );
      const address = web3.eth.accounts.recover(
        `I am signing my one-time nonce: ${nonce}`,
        signature
      );
      console.log(
        address.toLowerCase(),
        user.publicAddress,
        typeof user.publicAddress,
        typeof address
      );
      if (address.toLowerCase() !== user.publicAddress) {
        return next(new UnauthorizedResponse("Unauthortized user"));
      }
      user.nonce = Math.floor(Math.random() * 1000000);
      user.save((error: any, vUser: any) => {
        if (error || !vUser) {
          console.log(error);
          return next(new BadRequestResponse("Something went wrong!"));
        }
        console.log("logged in success", vUser);
        next(new OkResponse(vUser));
      });
    });
  }
);

export default router;
