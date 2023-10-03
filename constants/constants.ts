import { SidebarLink, Question, User } from "."

export const themes = [
  {value: "light", label: "Light", icon: "/assets/icons/sun.svg"},
  {value: "dark", label: "Dark", icon: "/assets/icons/moon.svg"},
  {value: "system", label: "System", icon: "/assets/icons/computer.svg"},
]

export const sidebarLinks: SidebarLink[] = [
  {imgURL: "/assets/icons/home.svg", route: "/", label: "Home"},
  {imgURL: "/assets/icons/users.svg", route: "/community", label: "Community"},
  {imgURL: "/assets/icons/star.svg", route: "/collection", label: "Collection"},
  {imgURL: "/assets/icons/suitcase.svg", route: "/jobs", label: "Find Jobs"},
  {imgURL: "/assets/icons/tag.svg", route: "/tags", label: "Tags"},
  {imgURL: "/assets/icons/user.svg", route: "/profile", label: "Profile"},
  {imgURL: "/assets/icons/question.svg", route: "/ask-question", label: "Ask a question"},
]

export const questionTypes = [
  {_id: 0, title: "Newest"},
  {_id: 1, title: "Recommended"},
  {_id: 2, title: "Frequent"},
  {_id: 3, title: "Unanswered"},
]

export const userFilterTypes = [
  {_id: 1, title: "New Users"},
  {_id: 2, title: "Old Users"},
  {_id: 3, title: "Top Contributors"},
]

export const mockTopQuestions = [
  {_id: 1, title:"Would it be appropriate to point out an error in another paper during a referee report paper during a referee report paper during a referee report paper during a referee report paper during a referee report paper during a referee report paper during a referee report ?", url: "https://bing.com"},
  {_id: 2, title:"How can an airconditioning machine exis?", url: "https://bing.com"},
  {_id: 3, title:"Interrogated every time crossing UK Border as citizen", url: "https://bing.com"},
  {_id: 4, title:"Low digit addition generator?", url: "https://bing.com"},
]

export const mockPopularTags = [
  {_id: 1, title:"Javascript", ranking: 5},
  {_id: 2, title:"NEXJS", ranking: 23},
  {_id: 3, title:"Tailwindcss", ranking: 2},
  {_id: 4, title:"Machine learning", ranking: 35},
]

export const mockQuestionData: Question[] = [
  {_id: 1, title:"The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve thisC_PizzaTracker generated invalid output for field status. Error How to solve this", tags:[{_id: 0, title: "Newest"}], author: {_id: 0, profilePic:"", name:"Sujata | JS Mastery", nickname:"", tags:[]}, createdAt:new Date("2023-10-03T00:00:00.000Z"), voteNum:12, answerNum: 3, viewNum: 100},
  {_id: 2, title:"The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this", tags:[{_id: 2, title: "ReactJs"}, {_id: 4, title: "Redux"}], author: {_id: 0, profilePic:"", name:"Sujata | JS Mastery", nickname:"", tags:[]}, createdAt:new Date("2023-10-01T00:00:00.000Z"), voteNum:12, answerNum: 3, viewNum: 100},
  {_id: 3, title:"The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this", tags:[{_id: 4, title: "Redux"},{_id: 9, title: "Vite"},{_id: 4, title: "Mongoose"}], author: {_id: 0, profilePic:"", name:"Sujata | JS Mastery", nickname:"", tags:[]}, createdAt:new Date("2023-09-01T00:00:00.000Z"), voteNum:12, answerNum: 3, viewNum: 100},
  {_id: 4, title:"The Lightning Component c:LWC_PizzaTracker generated invalid output for field status. Error How to solve this", tags:[{_id: 9, title: "JS"}], author: {_id: 0, profilePic:"", name:"Sujata | JS Mastery", nickname:"", tags:[]}, createdAt:new Date("2021-08-01T00:00:00.000Z"), voteNum:12, answerNum: 3, viewNum: 100},
]

export const mockUsers: User[] =[
  {_id:1, name: "Sujata | JS Mastery", nickname: "Sujata", profilePic: "", tags:[{_id: 2, title: "Reactjs"},{_id: 3, title: "Nextjs"}]},
  {_id:2, name: "Sujata | JS Mastery", nickname: "Sujata", profilePic: "", tags:[{_id: 2, title: "Vite"}]},
  {_id:3, name: "Sujata | JS Mastery", nickname: "Sujata", profilePic: "", tags:[]},
  {_id:4, name: "Sujata | JS Mastery", nickname: "Sujata", profilePic: "", tags:[{_id: 2, title: "Vue"}]},
]