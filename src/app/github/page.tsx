'use client'

import React from 'react'
import { authClient } from '@/lib/auth.client'
import Link from 'next/link'

export default function Home() {
    const { data: session } = authClient.useSession()

    const handleSignIn = async () => {
        const data = await authClient.signIn.social({ provider: 'github' })
        console.log(data)
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="bg-[#111] border border-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-[#1C69D4] mb-4">Welcome</h1>
                <Link
                    href="/dashboard"
                    className="text-[#1C69D4] hover:underline text-sm mb-6 block"
                >
                    Go to Dashboard
                </Link>

                {session?.user && (
                    <div className="mb-6">
                        <img
                            src={session.user.image || ''}
                            alt="profile"
                            className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-[#1C69D4]"
                        />
                        <h2 className="text-xl font-semibold">{session.user.name}</h2>
                        <p className="text-gray-400">{session.user.email}</p>
                    </div>
                )}

                <button
                    onClick={handleSignIn}
                    className="mt-4 bg-[#1C69D4] hover:bg-[#155bb0] text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                >
                    Sign in with GitHub
                </button>
            </div>
        </div>
    )
}
