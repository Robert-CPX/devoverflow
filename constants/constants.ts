import { SidebarLink } from "."

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
]

export const sidebarLinks: SidebarLink[] = [
  { imgURL: "/assets/icons/home.svg", route: "/", label: "Home" },
  { imgURL: "/assets/icons/users.svg", route: "/community", label: "Community" },
  { imgURL: "/assets/icons/star.svg", route: "/collection", label: "Collection" },
  { imgURL: "/assets/icons/suitcase.svg", route: "/jobs", label: "Find Jobs" },
  { imgURL: "/assets/icons/tag.svg", route: "/tags", label: "Tags" },
  { imgURL: "/assets/icons/user.svg", route: "/profile", label: "Profile" },
  { imgURL: "/assets/icons/question.svg", route: "/ask-question", label: "Ask a question" },
]

export const questionTypes = [
  { _id: 0, title: "Newest" },
  { _id: 1, title: "Recommended" },
  { _id: 2, title: "Frequent" },
  { _id: 3, title: "Unanswered" },
]

export const userFilterTypes = [
  { _id: 1, title: "New Users" },
  { _id: 2, title: "Old Users" },
  { _id: 3, title: "Top Contributors" },
]

export const mockTopQuestions = [
  { _id: "1", title: "Would it be appropriate to point out an error in another paper during a referee report paper during a referee report paper during a referee report paper during a referee report paper during a referee report paper during a referee report paper during a referee report ?", url: "https://bing.com" },
  { _id: "2", title: "How can an airconditioning machine exis?", url: "https://bing.com" },
  { _id: "3", title: "Interrogated every time crossing UK Border as citizen", url: "https://bing.com" },
  { _id: "4", title: "Low digit addition generator?", url: "https://bing.com" },
]

export const mockPopularTags = [
  { _id: "1", title: "Javascript", ranking: 5 },
  { _id: "2", title: "NEXJS", ranking: 23 },
  { _id: "3", title: "Tailwindcss", ranking: 2 },
  { _id: "4", title: "Machine learning", ranking: 35 },
]