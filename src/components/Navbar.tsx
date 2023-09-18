import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';
import { Icons } from './Icons';
import SearchBar from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { UserAccountNav } from './UserAccountNav';
import { buttonVariants } from './ui/Button';

const Navbar = async () => {
	const session = await getAuthSession();

	return (
		<div className='shadoww fixed inset-x-0 top-0 z-[10] h-fit border-b border-background bg-background py-2'>
			<div className='container mx-auto flex h-full max-w-7xl items-center justify-between gap-2'>
				{/* logo */}
				<Link href='/' className='flex items-center gap-2'>
					<Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' />
					<p className='hidden text-sm font-medium text-foreground md:block'>
						Rooms
					</p>
				</Link>

				{/* search bar */}
				<SearchBar />

				<div className='flex items-center justify-center gap-x-4'>
					<ThemeToggle />

					{/* actions */}
					{session?.user ? (
						<UserAccountNav user={session.user} />
					) : (
						<Link href='/sign-in' className={buttonVariants()}>
							Sign In
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
