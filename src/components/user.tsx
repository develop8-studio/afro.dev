import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { FaRegUser } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { useEffect } from "react";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function User() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // ユーザーの状態が変更されたときに呼び出されるコールバックを設定
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user); // ユーザー情報を更新
        });
        return () => unsubscribe(); // クリーンアップ関数
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                    >
                        {user && user.providerData && user.providerData[0]?.providerId === "google.com" ? (
                            <FcGoogle className="w-[20px] h-[20px]" />
                        ) : (
                            <FaRegUser className="w-[15px] h-[15px]" />
                        )}
                    </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/settings/account"><DropdownMenuItem>Settings</DropdownMenuItem></Link>
            <Link href="/settings/support"><DropdownMenuItem>Support</DropdownMenuItem></Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        {error && (
            <AlertDialog open>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Error</AlertDialogTitle>
                <AlertDialogDescription>
                    {error}
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setError(null)}>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        )}
        </div>
    )
}