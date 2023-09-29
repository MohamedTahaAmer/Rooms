import UserAuthForm from '@/components/UserAuthForm';
import Image from 'next/image';
import Link from 'next/link';

const SignUp = () => {
	return (
		<div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
			<div className='flex flex-col space-y-2 text-center'>
				<div className='relative aspect-square  w-10  '>
					<Image src='/favIcon.svg' fill sizes='100px' alt='Logo' />
				</div>
				<h1 className='text-2xl font-semibold tracking-tight'>Sign Up</h1>
				<p className='mx-auto max-w-xs text-sm'>
					By continuing, you are setting up a Rooms account and agree to our
					User Agreement and Privacy Policy.
				</p>
			</div>
			<UserAuthForm />
			<p className='px-8 text-center text-sm text-muted-foreground'>
				Already a Roomsor?{' '}
				<Link href='/sign-in' className='text-sm underline underline-offset-4'>
					Sign in
				</Link>
			</p>
		</div>
	);
};

export default SignUp;
