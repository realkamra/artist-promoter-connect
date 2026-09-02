import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowRight, Loader2, Mail, Radio, UserX } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  return returnTo?.startsWith("/") && !returnTo.startsWith("//")
    ? returnTo
    : fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const [step, setStep] = useState<"email" | { email: string }>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const sendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter your email address.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", normalizedEmail);
      await signIn("email-otp", formData);
      setEmail(normalizedEmail);
      setStep({ email: normalizedEmail });
      setOtp("");
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "Failed to send verification code.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === "email") return;
    const code = otp.replace(/\D/g, "");
    if (code.length !== 6) {
      setError("Enter the complete six-digit verification code.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", step.email);
      formData.set("code", code);
      await signIn("email-otp", formData);
      navigate(redirect, { replace: true });
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : "That code could not be verified. Request a new code.",
      );
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const guestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect, { replace: true });
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to continue as guest.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070e] px-6 py-12 text-[#ecebf3]">
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute left-1/2 top-[-18rem] size-[38rem] -translate-x-1/2 rounded-full bg-[#6d4dff]/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-[#a58bff]/10 blur-[100px]" />

      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mx-auto mb-9 flex items-center gap-3"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#a58bff] to-[#6d4dff] text-white shadow-[0_0_24px_rgba(139,92,246,.5)]">
            <Radio className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            sonar<span className="text-[#a58bff]">/match</span>
          </span>
        </button>

        <div className="mb-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[.28em] text-[#a58bff]">
            Private artist network
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-white">
            Enter the signal.
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/45">
            Your next meaningful introduction starts here.
          </p>
        </div>

        <Card className="relative overflow-hidden border-white/[.12] bg-white/[.05] shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a58bff] to-transparent" />

          {step === "email" ? (
            <>
              <CardHeader>
                <CardTitle className="text-white">Find your people.</CardTitle>
                <CardDescription className="text-white/45">
                  Sign in to discover promoters matched to your music.
                </CardDescription>
              </CardHeader>

              <form onSubmit={sendCode}>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 size-4 text-white/30" />
                      <Input
                        name="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@artist.com"
                        type="email"
                        className="border-white/[.12] bg-black/20 pl-9 text-white placeholder:text-white/25"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button type="submit" size="icon" disabled={isLoading} className="bg-gradient-to-r from-[#a58bff] to-[#6d4dff] text-white">
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowRight className="size-4" />
                      )}
                    </Button>
                  </div>

                  {error && <p className="mt-3 text-sm text-[#fb7185]">{error}</p>}

                  <div className="my-6 flex items-center gap-3 text-[10px] font-mono tracking-widest text-white/25">
                    <span className="h-px flex-1 bg-white/10" />
                    OR
                    <span className="h-px flex-1 bg-white/10" />
                  </div>                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-white/[.12] bg-white/[.03] text-white/55 hover:bg-white/10 hover:text-white"
                      onClick={guestLogin}
                      disabled={isLoading}
                    >
                    <UserX className="size-4" />
                    Explore as guest
                  </Button>
                </CardContent>
              </form>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-white">Check your email.</CardTitle>
                <CardDescription className="text-white/45">
                  We&apos;ve sent a six-digit code to{" "}
                  <span className="text-white/75">{step.email}</span>
                </CardDescription>
              </CardHeader>

              <form onSubmit={verifyCode}>
                <CardContent>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                      maxLength={6}
                      disabled={isLoading}
                      autoFocus
                      inputMode="numeric"
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {error && (
                    <p className="mt-4 text-center text-sm text-[#fb7185]">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="mt-7 w-full bg-gradient-to-r from-[#a58bff] to-[#6d4dff] text-white"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading && <Loader2 className="size-4 animate-spin" />}
                    Verify code
                    <ArrowRight className="size-4" />
                  </Button>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-white/45 hover:text-white"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError(null);
                    }}
                    disabled={isLoading}
                  >
                    Use a different email
                  </Button>
                </CardFooter>
              </form>
            </>
          )}
        </Card>

        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-wider text-white/25">
          Your music stays yours. Always.
        </p>
      </div>
    </main>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
