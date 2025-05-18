import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt, getOneUser } from './userRequests'
import { redirect } from 'next/navigation'
import { cache } from 'react'
 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    redirect('/login')
  }
 
  return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async () => {
	const session = await verifySession()
	if (!session) return null
   
	try {
		const userdata = getOneUser(session.userId)
   
	  return userdata
	} catch (error) {
	  console.log('Failed to fetch user')
	  return null
	}
  })