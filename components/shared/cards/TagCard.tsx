import Link from "next/link";

type TagCardProps = {
  _id: string;
  name: string;
  description: string;
  followers: number;
}

const TagCard = ({
  _id,
  name,
  description,
  followers,
}: TagCardProps) => {
  return (
    <Link href={`/tag/${_id}`} className="light-border background-light900_dark300 shadow-light100_darknone flex flex-col justify-start gap-[14px] rounded-[10px] border px-[30px] py-10">
      <p className="background-light800_dark400 text-dark300_light900 paragraph-semibold w-fit rounded-[4px] px-5 py-[6px]">{name}</p>
      <p className="small-regular text-dark500_light700 mt-1">{description}</p>
      <div className="flex items-center justify-start gap-2">
        <p className="body-semibold primary-text-gradient">{followers}+</p>
        <p className="small-medium text-dark400_light500">Questions</p>
      </div>
    </Link>
  )
}

export default TagCard
