"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
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


export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [redirecting, setRedirecting] = useState(false)
  const { isSignedIn } = useAuth();


  const handleAnimationComplete = () => {
    console.log('Buzz text animation completed!');
  };

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
      onLetterAnimationComplete={handleAnimationComplete}
    />
  ), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirect after mount to avoid updating Router during render
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || (isLoaded && isSignedIn)) {
    return <LoadingScreen />;
  }
  

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-xl">Initializing...</div>
      </div>
    );
  }

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      setStep(2);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setRedirecting(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
      else {
        setError("Invalid credentials.");
      }
    } catch (err: unknown) {
      console.error("Sign-in error:", err);
      if (err && typeof err === 'object' && 'errors' in err && Array.isArray(err.errors)) {
        setError(err.errors[0]?.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  if (redirecting) {
    return <LoadingScreen />
  }
  

  const goBack = () => {
    setStep(1);
    setPassword("");
    setError("");
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-black relative overflow-hidden"
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
      
      {/* Form Card */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="w-[400px] bg-black/20 backdrop-blur-md text-white border-white/20 shadow-2xl relative z-10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription className="text-gray-300">
                {step === 1 ? "Enter your username or email" : "Enter your password"}
              </CardDescription>
            </div>
            <Link
              href="/sign-up"
              className="text-sm text-blue-400 hover:underline"
            >
              Sign Up
            </Link>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="identifier-form"
                  onSubmit={handleIdentifierSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <label className="text-sm">Username or Email</label>
                    <Input
                      type="text"
                      placeholder="username or email@example.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="mt-1 bg-black/30 border-white/20 text-white focus:border-blue-400 focus:bg-black/40 backdrop-blur-sm"
                      required
                      autoFocus
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-blue-600/80 text-white hover:bg-blue-600 backdrop-blur-sm"
                      disabled={!identifier.trim()}
                    >
                      Continue
                    </Button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.form
                  key="password-form"
                  onSubmit={handlePasswordSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="flex justify-between items-center">
                      <label className="text-sm">Password</label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 bg-black/30 border-white/20 text-white focus:border-blue-400 focus:bg-black/40 backdrop-blur-sm"
                      required
                      autoFocus
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-blue-600/80 text-white hover:bg-blue-600 backdrop-blur-sm"
                      disabled={isLoading || !password.trim()}
                    >
                      {isLoading ? "Signing in..." : "Login"}
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goBack}
                      className="w-full border-white/20 bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
                    >
                      Back
                    </Button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter>
            <motion.p 
              className="text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              © 2025 MyChatApp. All rights reserved.
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}