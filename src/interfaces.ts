export type User = {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
};

export type UserResponse = {
  id: number;
  email: string;
};

export type Article = {
  id: number;
  title: string;
  body?: string;
  category: string;
  submitted_by: number;
  created_at: Date;
};

export type ArticlesWithAuthor = Article & {
  author_email: string;
};
