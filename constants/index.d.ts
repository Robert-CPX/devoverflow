export type SidebarLink = {
  imgURL: string;
  route: string;
  label: string;
}

export type Tag = {
  _id: number;
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
  tags:Tag[];
  author: User;
  createdAt: string
  voteNum:number;
  answerNum: number;
  viewNum: number;
}