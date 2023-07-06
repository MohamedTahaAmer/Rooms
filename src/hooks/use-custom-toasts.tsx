import { buttonVariants } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

// >(2:50)
export const useCustomToasts = () => {
  const loginToast = () => {
    // >(2:52) he gets this dismiss as a return from this toast function, but some how, he cann pass this dismiss as a function to the onClick event
    // - ah here, we are passing dismiss to an event handler, whish can occure only after this toast function has returned, so when the time comes and the user clicks the Link component, the dismiss function will be available
    const { dismiss } = toast({
      title: 'Login required.',
      description: 'You need to be logged in to do that.',
      variant: 'destructive',
      action: (
        <Link
          onClick={() => dismiss()}
          href='/sign-in'
          className={buttonVariants({ variant: 'outline' })}>
          Login
        </Link>
      ),
    })
  }

  return { loginToast }
}
