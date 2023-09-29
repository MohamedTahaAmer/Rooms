import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { UserAccountNav } from './UserAccountNav';
import { buttonVariants } from './ui/Button';
import ThemeToggleInLine from './ThemeToggleInLine';
import Image from 'next/image';
import { LogIn } from 'lucide-react';

const Navbar = async () => {
	const session = await getAuthSession();

	return (
		<div className='shadoww fixed inset-x-0 top-0 z-[10] h-fit border-b border-background bg-background py-2'>
			<div className='container mx-auto flex h-full max-w-7xl items-center justify-between gap-2'>
				{/* logo */}
				<Link href='/' className='flex items-center gap-2'>
					<div className='relative aspect-square  w-10  '>
						<Image src='/favIcon.svg' fill sizes='100px' alt='Logo' />
					</div>
					<p className='hidden text-2xl font-bold text-foreground md:block'>
						Rooms
					</p>
				</Link>

				{/* search bar */}
				<SearchBar />

				<div className='flex items-center justify-center gap-x-4'>
					<ThemeToggleInLine />

					{/* actions */}
					{session?.user ? (
						<UserAccountNav user={session.user} />
					) : (
						<>
							<Link
								href='/sign-in'
								className={buttonVariants({ className: 'hidden md:block' })}
							>
								Sign In
							</Link>
							<Link href='/sign-in' className='md:hidden'>
								<span className='sr-only'>Sign In</span>
								<LogIn />
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
