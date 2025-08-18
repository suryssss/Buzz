'use client'
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DotGrid from "@/components/animations/dots";
import SplitText from "@/components/animations/logotext";
import LoadingScreen from "@/components/animations/LoadingScreen"



export default function SignUpForm() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [redirecting, setRedirecting] = useState(false)



  // Memoize the Buzz title to prevent re-rendering
  const buzzTitle = useMemo(() => (
    <SplitText
      text="Buzz"
      className="text-6xl font-bold text-white"
      delay={150}
      duration={0.8}
      ease="power3.out"
      splitType="chars"
      from={{ opacity: 0, y: 60, scale: 0.8 }}
      to={{ opacity: 1, y: 0, scale: 1 }}
      threshold={0.1}
      rootMargin="-50px"
      textAlign="center"
    />
  ), []);

  if (redirecting) {
    return <LoadingScreen />
  }
  if (!isLoaded) {
    console.log("Clerk signUp object not loaded yet");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("Form submitted:", { username, email, password });

    try {
      const result = await signUp.create({
        username,
        emailAddress: email,
        password,
      });

      console.log("Sign-up result:", result);

      if (result.status === "complete") {
        console.log("Sign-up complete, redirecting...");
        router.push("/");
      } else if (result.status === "missing_requirements") {
        console.log("Missing requirements, probably needs email verification");
        await signUp.prepareVerification({ strategy: "email_code" });
        setShowVerification(true);
        setError("Please check your email and enter the verification code.");
      } else {
        console.log("Unhandled status:", result.status);
        setError("Something went wrong. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Sign-up error:", err);

      if (err && typeof err === "object" && "errors" in err && Array.isArray((err as { errors: Array<{ message: string }> }).errors)) {
        console.log("Clerk errors array:", (err as { errors: Array<{ message: string }> }).errors);
        setError((err as { errors: Array<{ message: string }> }).errors[0]?.message || "Something went wrong. Please try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
      console.log("Sign-up process finished, isLoading set to false");
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signUp.attemptVerification({
        strategy: "email_code",
        code: verificationCode,
      });

      if (result.status === "complete") {
        console.log("Verification complete, showing loading screen...")
        await setActive({ session: result.createdSessionId })
        setRedirecting(true)
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }
      else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Verification error:", err);
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerification) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Dots Animation Background */}
        <div className="absolute inset-0 w-full h-full">
          <DotGrid
            dotSize={7}
            gap={20}
            baseColor="#271E37"
            activeColor="#5227FF"
            proximity={170}
            shockRadius={300}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
        
        {/* Buzz Title */}
        <motion.div 
          className="text-center mb-8 relative z-10"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {buzzTitle}
          <motion.p 
            className="text-gray-400 text-lg mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Your Chat Application
          </motion.p>
        </motion.div>
        
        {/* Verification Form Card */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="w-[400px] bg-black/20 backdrop-blur-md text-white border-white/20 shadow-2xl relative z-10">
            <CardHeader>
              <CardTitle>Verify your email</CardTitle>
              <CardDescription className="text-gray-300">
                Enter the verification code sent to {email}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleVerification} className="space-y-4">
                <div>
                  <label className="text-sm">Verification Code</label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mt-1 bg-black/30 border-white/20 text-white focus:border-blue-400 focus:bg-black/40 backdrop-blur-sm"
                    required
                    maxLength={6}
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-blue-600/80 text-white hover:bg-blue-600 backdrop-blur-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowVerification(false)}
                  className="w-full border-white/20 bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
                >
                  Back to Sign Up
                </Button>
              </form>
            </CardContent>

            <CardFooter>
              <p className="text-xs text-gray-400">
                © 2025 MyChatApp. All rights reserved.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-screen bg-black relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dots Animation Background */}
      <div className="absolute inset-0 w-full h-full">
        <DotGrid
          dotSize={7}
          gap={20}
          baseColor="#271E37"
          activeColor="#5227FF"
          proximity={170}
          shockRadius={300}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      
      {/* Buzz Title */}
      <motion.div 
        className="text-center mb-8 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {buzzTitle}
        <motion.p 
          className="text-gray-400 text-lg mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          Your Chat Application
        </motion.p>
      </motion.div>
      
      {/* Sign-up Form Card */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="w-[400px] bg-black/20 backdrop-blur-md text-white border-white/20 shadow-2xl relative z-10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Create your account</CardTitle>
              <CardDescription className="text-gray-300">
                Enter your details below to create your account
              </CardDescription>
            </div>
            <Link
              href="/sign-in"
              className="text-sm text-blue-400 hover:underline"
            >
              Sign In
            </Link>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label className="text-sm">Username</label>
                <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 bg-black/30 border-white/20 text-white focus:border-blue-400 focus:bg-black/40 backdrop-blur-sm"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label className="text-sm">Email</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 bg-black/30 border-white/20 text-white focus:border-blue-400 focus:bg-black/40 backdrop-blur-sm"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label className="text-sm">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 bg-black/30 border-white/20 text-white focus:border-blue-400 focus:bg-black/40 backdrop-blur-sm"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-blue-600/80 text-white hover:bg-blue-600 backdrop-blur-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter>
            <motion.p 
              className="text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              © 2025 Buzz. All rights reserved.
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}