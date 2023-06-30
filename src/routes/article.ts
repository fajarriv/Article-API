import { Router } from "express";
import { createArticle, deleteArticle, getArticle, updateArticle } from "../controller/article";
import { tokenVerifier } from "../middleware/tokenVerifier";

const articleRouter: Router = Router();
articleRouter.post("/", tokenVerifier, createArticle);
articleRouter.get("/", tokenVerifier, getArticle)
articleRouter.delete("/:articleId", tokenVerifier, deleteArticle)
articleRouter.patch("/:articleId", tokenVerifier, updateArticle)
export default articleRouter;
