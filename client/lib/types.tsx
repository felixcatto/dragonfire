declare global {
  interface Window {
    INITIAL_STATE: {
      routes: any;
      currentUser: any;
      ssrData: any;
      getApiUrl: any;
    };
  }
}

export interface IEmptyObject {
  [key: string]: undefined;
}

export interface IUser {
  id: any;
  name: any;
  role: any;
  email: any;
  password_digest: any;
}

export interface IArticle {
  id: any;
  title: any;
  text: any;
  created_at: any;
  updated_at: any;
  author_id: any;
  author?: IUser;
  comments?: IComment[];
  tags?: ITag[];
}

export interface ITag {
  id: any;
  name: any;
  articles?: IArticle[];
}

export interface IComment {
  id: any;
  guest_name: any;
  text: any;
  created_at: any;
  updated_at: any;
  author_id: any;
  article_id: any;
  author?: IUser;
  article?: IArticle;
}
