import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User, sendPasswordResetEmail } from "firebase/auth";
import { Drawer } from "vaul";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { Tabs, Tab } from "@nextui-org/tabs";
import { MailIcon } from "../icons";
import { EyeIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons"
import { app } from "../../config/firebaseConfig";
import { Toaster, toast } from "sonner";

const auth = getAuth(app);

export default function AuthDrawer() {
  const [selected, setSelected] = useState("login");
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = '/';
    } catch (error: any) {
      console.error("Error signing up:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("This email is already registered. Please use a different email or try logging in.");
          break;
        case "auth/invalid-email":
          toast.error("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          toast.error("Your password is too weak. Please use a stronger password.");
          break;
        default:
          toast.error("An error occurred during sign up. Please try again later.");
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/';
    } catch (error: any) {
      console.error("Error logging in:", error);
      switch (error.code) {
        case "auth/invalid-credential":
          toast.error("Invalid email or password. Please check your credentials and try again.");
          break;
        case "auth/user-disabled":
          toast.error("This account has been disabled. Please contact support for assistance.");
          break;
        case "auth/user-not-found":
          toast.error("No account found with this email. Please check your email or sign up for a new account.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many failed login attempts. Please try again later or reset your password.");
          break;
        default:
          toast.error("An error occurred during login. Please try again later.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("You have been successfully logged out.");
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast.error("An error occurred while logging out. Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address in the email field.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("A password reset email has been sent to your inbox. Please check your email and follow the instructions.");
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      switch (error.code) {
        case "auth/invalid-email":
          toast.error("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          toast.error("No account found with this email. Please check your email or sign up for a new account.");
          break;
        default:
          toast.error("An error occurred while sending the reset email. Please try again later.");
      }
    }
  };
  return (
    <div className="text-black">
      
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <Button
            color="primary"
            variant="shadow"
            radius="full"
            startContent={<MailIcon color="#ffff" />}
            className="text-[15px] h-9 font-OpenSans"
          >
            {user ? "Logout" : "Get In"}
          </Button>
        </Drawer.Trigger>
        <Drawer.Portal>
        <Toaster 
        richColors 
        position="top-center"
        toastOptions={{
          style: {
            zIndex: 100 // Extremely high z-index
          }
        }}
      />
          <div className="fixed inset-0" style={{ zIndex: 99 }}> {/* High z-index, but lower than toast */}
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 overflow-y-auto border-t-0">
              <Drawer.Handle style={{ borderTop: 'none' }} />
              <div className="p-4 bg-white flex-1">
                <div className="max-w-md mx-auto">
                  {user ? (
                    <Button
                      color="primary"
                      variant="shadow"
                      className="w-full"
                      onPress={handleLogout}
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Tabs
                        fullWidth
                        size="md"
                        aria-label="Tabs form"
                        selectedKey={selected}
                        onSelectionChange={setSelected as any}
                        className="mt-4"
                      >
                        <Tab key="login" title="Login">
                          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                            <Input
                              isRequired
                              label="Email"
                              placeholder="Enter your email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              variant="bordered"
                            />
                            <Input
                              isRequired
                              label="Password"
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              variant="bordered"
                              endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                  {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                  ) : (
                                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                                  )}
                                </button>
                              }
                              type={isVisible ? "text" : "password"}
                            />
                            <p className="text-center text-small">
                              Need to create an account?{" "}
                              <Link size="sm" onPress={() => setSelected("sign-up")}>
                                Sign up
                              </Link>
                            </p>
                            <Button fullWidth color="primary" type="submit">
                              Login
                            </Button>
                          </form>
                        </Tab>
                        <Tab key="sign-up" title="Sign up">
                          <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
                            <Input
                              isRequired
                              label="Name"
                              placeholder="Enter your name"
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              variant="bordered"
                            />
                            <Input
                              isRequired
                              label="Email"
                              placeholder="Enter your email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              variant="bordered"
                            />
                            <Input
                              isRequired
                              label="Password"
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              variant="bordered"
                              endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                  {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                  ) : (
                                    <EyeIcon className="text-2xl text-default-400 pointer-events-none" />
                                  )}
                                </button>
                              }
                              type={isVisible ? "text" : "password"}
                            />
                            <p className="text-center text-small">
                              Already have an account?{" "}
                              <Link size="sm" onPress={() => setSelected("login")}>
                                Login
                              </Link>
                            </p>
                            <Button fullWidth color="primary" type="submit">
                              Sign up
                            </Button>
                          </form>
                        </Tab>
                      </Tabs>
                      <div className="mt-4 text-center">
                        <Link size="sm" onPress={handleForgotPassword}>
                          Forgot Password?
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 bg-zinc-100 border-t border-zinc-200">
                <div className="flex gap-6 justify-end max-w-md mx-auto">
                  <a
                    className="text-xs text-zinc-600 flex items-center gap-0.25"
                    href="/"
                  >
                    Jamvaly
                    <svg
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="16"
                      aria-hidden="true"
                      className="w-3 h-3 ml-1"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14L21 3"></path>
                    </svg>
                  </a>
                  <a
                    className="text-xs text-zinc-600 flex items-center gap-0.25"
                    href="https://twitter.com/emilkowalski_"
                  >
                    Contact us
                    <svg
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="16"
                      aria-hidden="true"
                      className="w-3 h-3 ml-1"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                      <path d="M15 3h6v6"></path>
                      <path d="M10 14L21 3"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </Drawer.Content>
          </div>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}