"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import { Icons } from "@/components";

const SignInPage = () => {

    const router = useRouter();

    const { isLoaded, signIn, setActive } = useSignIn();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        if (!isLoaded) return;

        if ( !email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const signInAttempt = await signIn.create({
                identifier: email,
                password,
                redirectUrl: "/auth/auth-callback?type=signin",
            });

            if (signInAttempt.status === "complete") {
                await setActive({ session: signInAttempt.createdSessionId });
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
                toast.error("Invalid email or password. Please try again.");
            }
        } catch (error: any) {
            console.error(JSON.stringify(error, null, 2));
            switch (error.errors[0]?.code) {
                case 'form_identifier_not_found':
                    toast.error("This email is not registered. Please sign up first.");
                    break;
                case 'form_password_incorrect':
                    toast.error("Incorrect password. Please try again.");
                    break;
                case 'too_many_attempts':
                    toast.error("Too many attempts. Please try again later.");
                    break;
                default:
                    toast.error("An error occurred. Please try again");
                    break;
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-y-6">

            <Link href="/" className={buttonVariants({ size: "sm", variant: "outline", className: "absolute top-4 left-4" })}>
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back
            </Link>

            <div className="flex flex-col text-center gap-1">
                <h1 className="text-2xl font-bold font-heading pt-2">
                    Sign In
                </h1>
                <p className="text-muted-foreground">
                    Welcome back! Sign in to your account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <div className="mt-4 space-y-1">
                    <Label htmlFor="email">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mt-4 space-y-1">
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <div className="relative w-full">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute top-1 right-1"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ?
                                <EyeOffIcon className="w-4 h-4" /> :
                                <EyeIcon className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                </div>
                <div className="mt-6">
                    <Button
                        size="default"
                        type="submit"
                        className="w-full"
                    >
                        {isLoading ? (
                            <LoaderIcon className="w-4 h-4 animate-spin" />
                        ) : "Sign In"}
                    </Button>
                </div>
            </form>

            <div className="flex mt-2">
                <p className="text-sm text-muted-foreground text-center w-full">
                    Dont&apos;t have an account? <Link href="/auth/signup" className="text-foreground font-medium">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default SignInPage