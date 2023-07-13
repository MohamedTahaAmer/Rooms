import { getAuthSession } from "@/lib/auth"

async function page() {
  const session =  await getAuthSession()
  return (
    <div>page</div>
  )
}

export default page