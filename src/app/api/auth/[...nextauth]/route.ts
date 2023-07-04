// >(0:59) he decieded to put the auth login in the lib folder then import it here
import { authOptions } from "@/lib/auth"
import NextAuth from "next-auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }