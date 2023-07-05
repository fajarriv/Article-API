import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getArticle,
  updateArticle,
} from "../controller/article";
import { tokenVerifier } from "../middleware/tokenVerifier";
import validate from "../middleware/validator";
import { body, param, query } from "express-validator";

const articleRouter: Router = Router();
articleRouter.post(
  "/",
  tokenVerifier,
  validate([
    body("title").exists().isString(),
    body("content").exists().isString(),
    body("tags").exists().isArray(),
    body("tags.*").exists().isString(),
  ]),
  createArticle
);

articleRouter.get(
  "/",
  tokenVerifier,
  validate([query("creatorId").isString().optional()]),
  getArticle
);

articleRouter.delete(
  "/:articleId",
  tokenVerifier,
  validate([param("articleId").isInt()]),
  deleteArticle
);
articleRouter.put(
  "/:articleId",
  tokenVerifier,
  validate([
    param("articleId").isInt(),
    body("title").isString(),
    body("content").isString()
  ]),
  updateArticle
);
export default articleRouter;
