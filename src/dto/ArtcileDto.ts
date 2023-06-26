export interface ArticleUpdateDto {
    title: string;
    content : string;
}
export interface ArticleCreateDto {
    title: string;
    content : string;
    tags : string[];
}