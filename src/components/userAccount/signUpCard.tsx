// src/components/SignUpCard.tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { MailIcon, LockFilledIcon } from "../icons"; // Assuming you have custom icons defined
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { Link } from "@nextui-org/link";
import { useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth"

interface SignUpCardProps {
  onSignInSuccess: () => void;
}

interface SignInCredentials {
  email: string;
  password: string;
}

const SignUpCard: React.FC<SignUpCardProps> = ({ onSignInSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [credentials, setCredentials] = useState<SignInCredentials>({
    email: '',
    password: ''
  });
  const [user, setUser] = useState<any | null>(null); // Adjust the type as per your user object structure

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = userCredential.user;
      setUser(user);
      onSignInSuccess();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button
        color="primary"
        variant="shadow"
        radius="full"
        startContent={<MailIcon color="#ffff" />}
        className="text-[15px] h-9 font-mukta"
        onPress={user ? handleSignOut : onOpen} // Toggle between sign in and open modal
      >
        {user ? "Logout" : "Get In"}
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        placement="center"
        backdrop="blur"
        className="w-full mx-3"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              label="Email"
              placeholder="Enter your email"
              variant="bordered"
            />
            <Input
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              endContent={<LockFilledIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="bordered"
            />
            <div className="flex py-2 px-1 justify-between">
              <Checkbox
                classNames={{
                  label: "text-small",
                }}
              >
                Remember me
              </Checkbox>
              <Link color="primary" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={handleSignIn}>
              Sign in
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignUpCard;
