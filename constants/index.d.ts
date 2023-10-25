export type SidebarLink = {
  imgURL: string;
  route: string;
  label: string;
}

export type Tag = {
  _id: string;
  title: string;
}

export type User = {
  _id: number;
  name: string;
  nickname: string;
  profilePic: string;
  tags: Tag[];
}

export type Question = {
  _id: number;
  title: string;
  tags: Tag[];
  author: User;
  createdAt: Date;
  voteNum: number;
  answerNum: number;
  viewNum: number;
}

export type Badges = {
  bronze: number
  silver: number
  gold: number
}