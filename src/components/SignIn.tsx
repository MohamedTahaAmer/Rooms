import UserAuthForm from '@/components/UserAuthForm';
import Image from 'next/image';

const SignIn = () => {
	return (
		<div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
			<div className='flex flex-col items-center space-y-2 text-center'>
				<div className='relative aspect-square  w-10  '>
					<Image src='/favIcon.svg' fill sizes='100px' alt='Logo' />
				</div>
				<h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
				<p className='mx-auto max-w-xs text-sm'>
					Welcome to Rooms, where you can share, discuss, and explore your
					interests with like-minded individuals.
				</p>
			</div>
			<UserAuthForm />
		</div>
	);
};

export default SignIn;
