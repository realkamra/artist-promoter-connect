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
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }

  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );

  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email") ?? "").trim();

      await signIn("email-otp", formData);
      setStep({ email });
      setOtp("");
    } catch (errorValue) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : "Failed to send verification code.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Enter the complete six-digit verification code.");
      return;
    }

    if (step === "signIn") {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("email", step.email);
      formData.set("code", otp);

      await signIn("email-otp", formData);
      navigate(redirect);
    } catch {
      setError(
        "That code could not be verified. Request a new code and use the newest email.",
      );
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (errorValue) {
      setError(
        `Failed to sign in: ${
          errorValue instanceof Error ? errorValue.message : "Unknown error"
        }`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#11111b] px-6 py-12 text-[#cdd6f4]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 size-[32rem] rounded-full bg-[#cba6f7]/10 blur-[120px]"
      />

      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mx-auto mb-8 flex items-center gap-3"
        >
          <span className="flex size-10 items-center justify-center rounded-xl border border-[#cba6f7]/40 bg-[#cba6f7]/10 text-[#cba6f7]">
            <Radio className="size-5" />
          </span>

          <span className="font-mono text-lg font-bold text-[#f5e0dc]">
            SONAR<span className="text-[#cba6f7]">/MATCH</span>
          </span>
        </button>

        <p className="mx-auto mb-6 text-center font-mono text-[10px] uppercase tracking-[.2em] text-[#6c7086]">
          Private artist network · secure entry
        </p>

        <Card className="border-[#313244] bg-[#1e1e2e] shadow-2xl shadow-black/30">
          {step === "signIn" ? (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-[#f5e0dc]">
                  Find your people.
                </CardTitle>

                <CardDescription className="text-[#a6adc8]">
                  Sign in to discover promoters matched to your music.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleEmailSubmit}>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 size-4 text-[#6c7086]" />

                      <Input
                        name="email"
                        placeholder="you@artist.com"
                        type="email"
                        className="border-[#313244] bg-[#181825] pl-9 text-[#f5e0dc] placeholder:text-[#6c7086]"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <Button type="submit" size="icon" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowRight className="size-4" />
                      )}
                    </Button>
                  </div>

                  {error && (
                    <p className="mt-3 text-sm text-[#f38ba8]">{error}</p>
                  )}

                  <div className="my-6 flex items-center gap-3 text-xs text-[#6c7086]">
                    <span className="h-px flex-1 bg-[#313244]" />
                    OR
                    <span className="h-px flex-1 bg-[#313244]" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#313244] bg-[#181825] text-[#a6adc8] hover:bg-[#292c3c] hover:text-[#f5e0dc]"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                  >
                    <UserX className="mr-2 size-4" />
                    Explore as guest
                  </Button>
                </CardContent>
              </form>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-[#f5e0dc]">
                  Check your email
                </CardTitle>

                <CardDescription className="text-[#a6adc8]">
                  We've sent a six-digit code to {step.email}
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleOtpSubmit}>
                <CardContent>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      autoFocus
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {error && (
                    <p className="mt-3 text-center text-sm text-[#f38ba8]">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="mt-6 w-full"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Verify code
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </CardContent>

                <CardFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-[#a6adc8] hover:text-[#f5e0dc]"
                    onClick={() => {
                      setStep("signIn");
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

        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-wider text-[#6c7086]">
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