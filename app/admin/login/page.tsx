"use client";

import {
  FormEvent,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  LockKeyhole,
  ShieldCheck,
  Loader2,
  Mail,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Toast from "@/components/Toast";

type ResetStep =
  | "request"
  | "verify"
  | "reset";

type ToastState = {
  message: string;
  type:
    | "success"
    | "error"
    | "info";
} | null;

/* =====================================================
   LOGIN PAGE CONTENT
   useSearchParams() is inside this component.
   The exported page below wraps it with Suspense.
===================================================== */

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =====================================================
     LOGIN STATE
  ===================================================== */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  /* =====================================================
     PASSWORD RESET STATE
  ===================================================== */

  const [resetMode, setResetMode] =
    useState(false);

  const [resetStep, setResetStep] =
    useState<ResetStep>("request");

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  /* =====================================================
     UI STATE
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  /* =====================================================
     TOAST STATE
  ===================================================== */

  const [toast, setToast] =
    useState<ToastState>(null);

  /* =====================================================
     SHOW TOAST
  ===================================================== */

  const showToast = useCallback(
    (
      toastMessage: string,
      type:
        | "success"
        | "error"
        | "info"
    ) => {
      setToast({
        message: toastMessage,
        type,
      });
    },
    []
  );

  /* =====================================================
     CLEAR TOAST
  ===================================================== */

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  /* =====================================================
     LOGOUT SUCCESS NOTIFICATION

     /admin/logout can redirect to:

     /admin/login?logout=success

     Then this page shows:

     "Logout successful."
  ===================================================== */

  useEffect(() => {
    const logoutStatus =
      searchParams.get("logout");

    if (logoutStatus === "success") {
      showToast(
        "Logout successful.",
        "success"
      );

      window.history.replaceState(
        null,
        "",
        "/admin/login"
      );
    }
  }, [
    searchParams,
    showToast,
  ]);

  /* =====================================================
     LOGIN
  ===================================================== */

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    clearToast();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      const errorMessage =
        "Enter your owner email.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      return;
    }

    if (!password) {
      const errorMessage =
        "Enter your password.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/admin/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email:
                normalizedEmail,
              password,
            }),
          }
        );

      let data: {
        error?: string;
        message?: string;
      } = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        const apiError =
          data?.error ||
          "Invalid admin credentials.";

        const isPasswordError =
          apiError
            .toLowerCase()
            .includes("password") ||
          apiError
            .toLowerCase()
            .includes("credential");

        const errorMessage =
          isPasswordError
            ? "Your password is incorrect."
            : apiError;

        throw new Error(
          errorMessage
        );
      }

      /* LOGIN SUCCESS */

      setError("");
      setPassword("");

      showToast(
        "Login successful. Welcome back.",
        "success"
      );

      window.setTimeout(() => {
        router.replace("/admin");
        router.refresh();
      }, 900);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Login failed.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     OPEN FORGOT PASSWORD
  ===================================================== */

  function openForgotPassword() {
    setResetMode(true);
    setResetStep("request");

    setError("");
    setMessage("");

    setOtp("");
    setNewPassword("");
    setConfirmPassword("");

    clearToast();
  }

  /* =====================================================
     BACK TO LOGIN
  ===================================================== */

  function backToLogin() {
    setResetMode(false);
    setResetStep("request");

    setError("");
    setMessage("");

    setOtp("");
    setNewPassword("");
    setConfirmPassword("");

    clearToast();
  }

  /* =====================================================
     SEND OTP
  ===================================================== */

  async function handleSendOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    clearToast();

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      const errorMessage =
        "Enter your admin email.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/admin/forgot-password",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email:
                normalizedEmail,
            }),
          }
        );

      let data: {
        error?: string;
        message?: string;
      } = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to send password reset OTP."
        );
      }

      setEmail(
        normalizedEmail
      );

      setOtp("");

      setResetStep(
        "verify"
      );

      showToast(
        "OTP sent successfully. Check your email.",
        "success"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to send OTP.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     VERIFY OTP
  ===================================================== */

  async function handleVerifyOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    clearToast();

    const normalizedOtp =
      otp.trim().toUpperCase();

    if (!normalizedOtp) {
      const errorMessage =
        "Enter the OTP.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      return;
    }

    if (normalizedOtp.length !== 6) {
      const errorMessage =
        "OTP must contain 6 characters.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/admin/verify-otp",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email:
                email
                  .trim()
                  .toLowerCase(),
              otp:
                normalizedOtp,
            }),
          }
        );

      let data: {
        error?: string;
        message?: string;
      } = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "OTP verification failed."
        );
      }

      setOtp(
        normalizedOtp
      );

      setResetStep(
        "reset"
      );

      showToast(
        "OTP verified successfully.",
        "success"
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Invalid OTP.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     RESET PASSWORD
  ===================================================== */

  async function handleResetPassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    clearToast();

    if (!newPassword) {
      const errorMessage =
        "Enter a new password.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      return;
    }

    if (newPassword.length < 8) {
      const errorMessage =
        "Password must be at least 8 characters.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      const errorMessage =
        "Passwords do not match.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/admin/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email:
                email
                  .trim()
                  .toLowerCase(),
              newPassword,
            }),
          }
        );

      let data: {
        error?: string;
        message?: string;
      } = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to reset password."
        );
      }

      showToast(
        "Password reset successfully.",
        "success"
      );

      window.setTimeout(() => {
        setResetMode(false);

        setResetStep(
          "request"
        );

        setPassword("");

        setOtp("");

        setNewPassword("");

        setConfirmPassword("");

        setMessage("");

        setError("");

        clearToast();
      }, 2200);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to reset password.";

      setError(errorMessage);

      showToast(
        errorMessage,
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#05070d]
        px-6
        py-10
        text-white
      "
    >
      {/* BACKGROUND GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/[0.035]
          blur-[120px]
        "
      />

      {/* TOAST */}

      {toast && (
        <Toast
          message={
            toast.message
          }
          type={toast.type}
          onClose={
            clearToast
          }
        />
      )}

      {/* MAIN CONTAINER */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >
        {/* HEADER */}

        <div
          className="
            mb-8
            text-center
          "
        >
          <div
            className="
              mx-auto
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-400/20
              bg-cyan-400/10
              shadow-[0_0_30px_rgba(34,211,238,0.08)]
            "
          >
            {resetMode ? (
              <KeyRound
                size={30}
                className="text-cyan-300"
              />
            ) : (
              <ShieldCheck
                size={30}
                className="text-cyan-300"
              />
            )}
          </div>

          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
            "
          >
            {resetMode
              ? resetStep ===
                "request"
                ? "Forgot Password"
                : resetStep ===
                  "verify"
                  ? "Verify OTP"
                  : "Reset Password"
              : "Admin Access"}
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-white/45
            "
          >
            {resetMode
              ? resetStep ===
                "request"
                ? "Request a secure password reset OTP"
                : resetStep ===
                  "verify"
                  ? "Enter the OTP sent to your email"
                  : "Create a new administrator password"
              : "Owner-only portfolio administration"}
          </p>
        </div>

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        {!resetMode && (
          <form
            onSubmit={
              handleLogin
            }
            className="
              rounded-3xl
              border
              border-white/[0.08]
              bg-white/[0.035]
              p-7
              shadow-2xl
              backdrop-blur-xl
            "
          >
            {/* EMAIL */}

            <div className="mb-5">
              <label
                htmlFor="email"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-white/70
                "
              >
                Owner Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(
                  event
                ) => {
                  setEmail(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Enter owner email"
                required
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-black/20
                  px-4
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/25
                  focus:border-cyan-400/40
                  focus:ring-2
                  focus:ring-cyan-400/10
                "
              />
            </div>

            {/* PASSWORD */}

            <div className="mb-3">
              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-white/70
                "
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-white/25
                  "
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(
                    event
                  ) => {
                    setPassword(
                      event.target.value
                    );

                    setError("");
                  }}
                  placeholder="Enter admin password"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    pl-11
                    pr-4
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-white/25
                    focus:border-cyan-400/40
                    focus:ring-2
                    focus:ring-cyan-400/10
                  "
                />
              </div>
            </div>

            {/* FORGOT PASSWORD */}

            <button
              type="button"
              onClick={
                openForgotPassword
              }
              className="
                mb-5
                w-full
                text-right
                text-sm
                text-cyan-300/80
                transition
                hover:text-cyan-200
              "
            >
              Forgot password?
            </button>

            {/* ERROR */}

            {error && (
              <div
                className="
                  mb-5
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-red-400/20
                  bg-red-400/10
                  px-4
                  py-3
                  text-sm
                  text-red-300
                "
              >
                <AlertCircle
                  size={17}
                  className="
                    mt-0.5
                    shrink-0
                  "
                />

                <span>
                  {error}
                </span>
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-cyan-400
                px-4
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-cyan-300
                hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck
                    size={17}
                  />
                  Sign in as Owner
                </>
              )}
            </button>

            <p
              className="
                mt-5
                text-center
                text-xs
                text-white/25
              "
            >
              Restricted access •
              Owner only
            </p>
          </form>
        )}

        {/* =================================================
            SEND OTP
        ================================================= */}

        {resetMode &&
          resetStep ===
            "request" && (
            <form
              onSubmit={
                handleSendOtp
              }
              className="
                rounded-3xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                p-7
                shadow-2xl
                backdrop-blur-xl
              "
            >
              <div className="mb-5">
                <label
                  htmlFor="reset-email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-white/70
                  "
                >
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/25
                    "
                  />

                  <input
                    id="reset-email"
                    name="reset-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(
                      event
                    ) => {
                      setEmail(
                        event.target.value
                      );

                      setError("");
                    }}
                    placeholder="Enter admin email"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-black/20
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-cyan-400/40
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />
                </div>
              </div>

              {error && (
                <div
                  className="
                    mb-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-400/10
                    px-4
                    py-3
                    text-sm
                    text-red-300
                  "
                >
                  <AlertCircle
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                    "
                  />

                  <span>
                    {error}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-cyan-400
                  px-4
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-cyan-300
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail size={17} />
                    Send OTP
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={
                  backToLogin
                }
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  text-white/40
                  transition
                  hover:text-white/70
                "
              >
                <ArrowLeft size={15} />
                Back to Login
              </button>
            </form>
          )}

        {/* =================================================
            VERIFY OTP
        ================================================= */}

        {resetMode &&
          resetStep ===
            "verify" && (
            <form
              onSubmit={
                handleVerifyOtp
              }
              className="
                rounded-3xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                p-7
                shadow-2xl
                backdrop-blur-xl
              "
            >
              <div
                className="
                  mb-6
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    mb-3
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-cyan-400/20
                    bg-cyan-400/10
                  "
                >
                  <Mail
                    size={21}
                    className="text-cyan-300"
                  />
                </div>

                <p
                  className="
                    text-sm
                    text-white/50
                  "
                >
                  Verification code
                  sent to
                </p>

                <p
                  className="
                    mt-1
                    break-all
                    text-sm
                    font-medium
                    text-cyan-300
                  "
                >
                  {email}
                </p>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="otp"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-white/70
                  "
                >
                  Enter OTP
                </label>

                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="text"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={6}
                  value={otp}
                  onChange={(
                    event
                  ) => {
                    const value =
                      event.target.value
                        .toUpperCase()
                        .replace(
                          /[^A-Z0-9]/g,
                          ""
                        );

                    setOtp(value);
                    setError("");
                  }}
                  placeholder="ABC123"
                  required
                  className="
                    h-14
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    text-center
                    text-xl
                    font-bold
                    tracking-[0.35em]
                    text-cyan-300
                    outline-none
                    transition
                    placeholder:text-sm
                    placeholder:font-normal
                    placeholder:tracking-normal
                    placeholder:text-white/20
                    focus:border-cyan-400/40
                    focus:bg-cyan-400/[0.02]
                    focus:ring-2
                    focus:ring-cyan-400/10
                  "
                />

                <p
                  className="
                    mt-2
                    text-center
                    text-xs
                    text-white/30
                  "
                >
                  Enter the 6-character
                  OTP sent to your email
                </p>
              </div>

              {error && (
                <div
                  className="
                    mb-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-400/10
                    px-4
                    py-3
                    text-sm
                    text-red-300
                  "
                >
                  <AlertCircle
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                    "
                  />

                  <span>
                    {error}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  otp.length !== 6
                }
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-cyan-400
                  px-4
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-cyan-300
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Verifying OTP...
                  </>
                ) : (
                  <>
                    <ShieldCheck
                      size={17}
                    />
                    Verify OTP
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setResetStep(
                    "request"
                  );

                  setOtp("");
                  setError("");
                  setMessage("");

                  clearToast();
                }}
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  text-white/40
                  transition
                  hover:text-white/70
                "
              >
                <ArrowLeft size={15} />
                Request New OTP
              </button>

              <button
                type="button"
                onClick={
                  backToLogin
                }
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  text-white/25
                  transition
                  hover:text-white/50
                "
              >
                Cancel
              </button>
            </form>
          )}

        {/* =================================================
            RESET PASSWORD
        ================================================= */}

        {resetMode &&
          resetStep ===
            "reset" && (
            <form
              onSubmit={
                handleResetPassword
              }
              className="
                rounded-3xl
                border
                border-white/[0.08]
                bg-white/[0.035]
                p-7
                shadow-2xl
                backdrop-blur-xl
              "
            >
              <div
                className="
                  mb-6
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-emerald-400/20
                  bg-emerald-400/10
                  p-4
                "
              >
                <CheckCircle2
                  size={20}
                  className="
                    shrink-0
                    text-emerald-300
                  "
                />

                <div>
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-emerald-300
                    "
                  >
                    OTP Verified
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/40
                    "
                  >
                    Create your new
                    admin password.
                  </p>
                </div>
              </div>

              {/* NEW PASSWORD */}

              <div className="mb-5">
                <label
                  htmlFor="new-password"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-white/70
                  "
                >
                  New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/25
                    "
                  />

                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(
                      event
                    ) => {
                      setNewPassword(
                        event.target.value
                      );

                      setError("");
                    }}
                    placeholder="Minimum 8 characters"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-black/20
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-cyan-400/40
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mb-5">
                <label
                  htmlFor="confirm-password"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-white/70
                  "
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-white/25
                    "
                  />

                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(
                      event
                    ) => {
                      setConfirmPassword(
                        event.target.value
                      );

                      setError("");
                    }}
                    placeholder="Re-enter new password"
                    required
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-black/20
                      pl-11
                      pr-4
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-white/25
                      focus:border-cyan-400/40
                      focus:ring-2
                      focus:ring-cyan-400/10
                    "
                  />
                </div>
              </div>

              {error && (
                <div
                  className="
                    mb-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-400/10
                    px-4
                    py-3
                    text-sm
                    text-red-300
                  "
                >
                  <AlertCircle
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                    "
                  />

                  <span>
                    {error}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-cyan-400
                  px-4
                  text-sm
                  font-semibold
                  text-black
                  transition
                  hover:bg-cyan-300
                  hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <KeyRound size={17} />
                    Reset Password
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={
                  backToLogin
                }
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  text-white/40
                  transition
                  hover:text-white/70
                "
              >
                <ArrowLeft size={15} />
                Cancel
              </button>
            </form>
          )}
      </div>
    </main>
  );
}

/* =====================================================
   SUSPENSE WRAPPER

   This fixes:

   useSearchParams() should be wrapped
   in a suspense boundary
===================================================== */

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main
          className="
            flex
            min-h-screen
            items-center
            justify-center
            bg-[#05070d]
            text-white
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              text-sm
              text-white/50
            "
          >
            <Loader2
              size={18}
              className="animate-spin"
            />

            Loading admin login...
          </div>
        </main>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}