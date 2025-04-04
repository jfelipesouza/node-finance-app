import { Router } from "express";
import { createAccount } from "./create-account";
import { login } from "./login";

const signinRouters = Router();

signinRouters.post("/register", createAccount);
signinRouters.post("/login", login);

export { signinRouters };
