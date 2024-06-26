import Head from "next/head";
import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
} from "@/components/ui/alert-dialog"
import { RocketIcon } from "@radix-ui/react-icons"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut, updateProfile, GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup, deleteUser, EmailAuthProvider, updatePassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

import Header from "@/components/header"
import SearchMenu from "@/components/search"
import UserMenu from "@/components/user"
import SettingsMenu from "@/components/settings"
import MobileSheet from "@/components/mobile-sheet"

import { db, storage, auth } from '@/firebase/firebaseConfig'
export default function Dashboard() {
    const auth = getAuth();
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (auth.currentUser) {
            setUsername(auth.currentUser.displayName || "");
        }
    }, []);

    const handlePasswordChange = async (event: FormEvent) => {
        event.preventDefault();
        setChangingPassword(true);
        try {
            const user = auth.currentUser;
            if (user && currentPassword && newPassword) {
                const credential = EmailAuthProvider.credential(
                    user.email!,
                    currentPassword
                );
                await reauthenticateWithPopup(user, new GoogleAuthProvider());
                await updatePassword(user, newPassword);
                setSuccess(true);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>Security -Afro.dev</title>
        </Head>
        <Header current="settings" />
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Settings</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <SettingsMenu current="security" />
            <div className="grid gap-6">
            <Alert>
                <RocketIcon className="h-5 w-5" />
                <AlertTitle>Sorry about that!</AlertTitle>
                <AlertDescription>
                    For now, you&apos;ll need to use Google to set or change your password, but we&apos;re on it and will fix it soon!
                </AlertDescription>
            </Alert>
            <Card x-chunk="dashboard-04-chunk-1">
                <CardHeader>
                    <h3 className="text-xl font-semibold">Change Password</h3>
                    <CardDescription>
                        Update your account password.
                    </CardDescription>
                </CardHeader>
                    <form onSubmit={handlePasswordChange}>
                    <CardContent>
                        <Input
                            placeholder="Current Password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            disabled={changingPassword}
                            className="mb-3"
                        />
                        <Input
                            placeholder="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={changingPassword}
                        />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" className="h-[20]" disabled={changingPassword || !currentPassword || !newPassword}>
                            {changingPassword ? "Changing..." : "Save"}
                        </Button>
                    </CardFooter>
                    </form>
                </Card>
            </div>
            </div>
        </main>
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
                        <AlertDialogCancel onClick={() => setError(null)} className="rounded-full">Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        {success && (
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Success</AlertDialogTitle>
                        <AlertDialogDescription>
                            Updated successfully!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSuccess(false)} className="rounded-full">Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        </div>
    )
}