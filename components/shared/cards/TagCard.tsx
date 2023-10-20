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
    <Link href={`/tags/${_id}`} className="light-border background-light900_dark200 shadow-light100_darknone flex flex-col justify-start gap-[14px] rounded-[10px] border px-[30px] py-10 max-sm:w-full sm:w-[260px]">
      <p className="background-light800_dark400 text-dark300_light900 paragraph-semibold block w-fit rounded-[4px] px-5 py-[6px]">{name}</p>
      <p className="small-regular text-dark500_light700 mt-1 h-[80px]">{description}</p>
      <div className="flex items-center justify-start gap-2">
        <p className="body-semibold primary-text-gradient">{followers}+</p>
        <p className="small-medium text-dark400_light500">Questions</p>
      </div>
    </Link>
  )
}

export default TagCard
