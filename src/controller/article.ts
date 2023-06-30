import { Response } from "express";
import { RequestWithUserId } from "../middleware/tokenVerifier";
import { dbClient } from "../config/db";
import { ArticleCreateDto, ArticleUpdateDto } from "../dto/ArtcileDto";

export const createArticle = async (req: RequestWithUserId, res: Response) => {
  const { title, content, tags }: ArticleCreateDto = req.body;
  try {
    const transaction = await dbClient.$transaction(async (prismaTrx) => {
      try {
        // Create new Article
        const newArticle = await prismaTrx.article.create({
          data: {
            title: title,
            content: content,
            creatorId: Number(req.userId),
          },
          include: { creator: { select: { username: true } } },
        });
        // Check tags and create new tags if not exists
        const createdTags = await Promise.all(
          tags.map(async (tag) => {
            let tagData = await prismaTrx.tag.findFirst({
              where: {
                name: tag,
              },
            });
            if (!tagData) {
              tagData = await prismaTrx.tag.create({
                data: {
                  name: tag,
                },
              });
            }
            // Create new ArticleTag relation
            await prismaTrx.articleTag.create({
              data: {
                articleId: newArticle.id,
                tagId: tagData.id,
              },
            });
            return tagData;
          })
        );

        return { ...newArticle };
      } catch (error) {
        return res.status(500).send(error);
      }
    });
    return res.status(201).send({
      message: "Article Created Succesfully",
      article: { ...transaction, tags: tags },
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const getArticle = async (req: RequestWithUserId, res: Response) => {
  const { creatorId } = req.query;
  try {
    const articles = await dbClient.article.findMany({
      where: { creatorId: creatorId ? Number(creatorId) : undefined },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            username: true,
          },
        },
        tag: { select: { tag: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    // Format query result
    const result = articles.map((article) => {
      const { tag, ...rest } = article;
      const newTags = article.tag.map((tag) => tag.tag.name);

      return { ...rest, tag: newTags };
    });
    return res.status(200).send(result);
  } catch (error) {}
};

export const deleteArticle = async (req: RequestWithUserId, res: Response) => {
  const { articleId } = req.params;
  try {
    const article = await dbClient.article.findUnique({
      where: { id: Number(articleId) },
    });
    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }
    if (article.creatorId !== Number(req.userId)) {
      return res.status(401).send({ message: "You can't delete this article" });
    }
    await dbClient.article.delete({ where: { id: Number(articleId) } });
    return res.status(200).send({ message: "Article deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

export const updateArticle = async (req: RequestWithUserId, res: Response) => {
  const { articleId } = req.params;
  const { title, content }: ArticleUpdateDto = req.body;
  try {
    const article = await dbClient.article.findUnique({
      where: { id: Number(articleId) },
    });
    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }
    if (article.creatorId !== Number(req.userId)) {
      return res.status(401).send({ message: "You can't update this article" });
    }
    await dbClient.article.update({
      where: { id: Number(articleId) },
      data: { title: title, content: content },
    });
    return res.status(200).send({ message: "Article updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
