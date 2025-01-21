"use client"

import { SignIn, SignUp, UserButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"

export default function Auth() {
  const { isSignedIn, user } = useUser()

  if (isSignedIn) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>Welcome, {user.firstName || user.username}!</p>
        <UserButton afterSignOutUrl="/" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <SignIn />
      <SignUp />
    </div>
  )
}

