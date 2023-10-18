import Image from 'next/image'

type QAStatsCardProps = {
  questions: number;
  answers: number;
}
type BadgeStatsCardProps = {
  type: "gold" | "silver" | "bronze";
  count: number;
}

const QAStatsCard = ({ questions, answers }: QAStatsCardProps) => {
  return (
    <article className="background-light900_dark200 shadow-light100_dark100 flex flex-wrap justify-evenly gap-[44px] rounded-[10px] border border-light-700 px-[20px] py-[25px] dark:border-dark-300">
      <div className="flex flex-col items-start justify-center">
        <p className="body-semibold">{questions}</p>
        <p className="body-medium">Questions</p>
      </div>
      <div className="flex flex-col items-start justify-center">
        <p className="body-semibold">{answers}</p>
        <p className="body-medium">Answers</p>
      </div>
    </article>
  )
}

const BadgeStatsCard = ({ type, count }: BadgeStatsCardProps) => {
  const icon = type === "gold" ? "/assets/icons/gold-medal.svg" : type === "silver" ? "/assets/icons/silver-medal.svg" : "/assets/icons/bronze-medal.svg";
  const title = `${type.charAt(0).toUpperCase() + type.slice(1)} Badges`
  return (
    <article className="background-light900_dark200 shadow-light100_dark100 flex flex-wrap justify-start gap-4 rounded-[10px] border border-light-700 py-5 pl-6 dark:border-dark-300">
      <Image src={icon} alt="medal" width={35} height={46} />
      <div className="flex flex-col items-start justify-center">
        <p className="body-semibold">{count}</p>
        <p className="body-medium">{title}</p>
      </div>
    </article>
  )
}

export {
  QAStatsCard,
  BadgeStatsCard
}
