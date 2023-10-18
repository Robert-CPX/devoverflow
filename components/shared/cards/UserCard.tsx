import { formatDateToMonthYear } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link';

type UserCardProps = {
  picture: string;
  name: string;
  username: string;
  profileLink?: string;
  location?: string;
  joinedAt: Date;
  bio?: string;
}
const UserCard = ({
  picture,
  name,
  username,
  profileLink,
  location,
  joinedAt,
  bio,
}: UserCardProps) => {
  return (
    <article className="flex flex-col gap-4 lg:flex-row">
      <Image
        src={picture}
        alt='user profile picture'
        className='h-[140px] w-[140px] rounded-full border-[3px] border-primary-500 object-cover'
        width={140}
        height={140}
      />
      <div className='flex flex-col justify-start gap-3'>
        <div className='flex flex-col gap-2'>
          <h1 className='h1-bold text-dark100_light900'>{name}</h1>
          <p className='paragraph-regular text-dark200_light800'>{`@${username}`}</p>
        </div>
        <div className='mt-2 flex items-center justify-start gap-5'>
          <Link href={profileLink ?? ""} target='_blank' className={`flex gap-1 ${profileLink ?? "hidden"}`}>
            <Image src={"/assets/icons/link.svg"} alt='profile link' width={20} height={20} />
            <p className='paragraph-medium text-accent-blue'>{profileLink}</p>
          </Link>
          <div className={`flex gap-1 ${location ?? "hidden"}`}>
            <Image src={"/assets/icons/location.svg"} alt='location' width={20} height={20} />
            <p className='paragraph-medium text-dark400_light700'>{location}</p>
          </div>
          <div className='flex gap-1'>
            <Image src={"/assets/icons/calendar.svg"} alt='calendar' width={20} height={20} />
            <p className='paragraph-medium text-dark400_light700'>{`Joined ${formatDateToMonthYear(joinedAt)}`}</p>
          </div>
        </div>
        <p className={`paragraph-regular text-dark200_light800 mt-3 ${bio ?? "hidden"}`}>{bio}</p>
      </div>
    </article>
  )
}

export default UserCard
