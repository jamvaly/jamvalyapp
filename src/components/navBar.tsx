import "../styles/globals.css";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";  
import { ThemeSwitch } from "./theme-switch";
import AuthDrawer from "./userAccount/AuthModal";

export default function NavBar() {
  const menuItems = [
    "Orders",
    "Map",
    "Help & Feedback",
    "How The App Works",
    "Log Out",
  ];
 10
  return (
    <Navbar disableAnimation isBordered className="flex justify-between fixed z-50">
      <NavbarContent className="pr-3" justify="center">
        <NavbarBrand>
          <img
            src="../../public/jamvaly-logo.svg"
            alt="Jamvaly"
            width={"40px"}
            height={"40px"}
          />
          <p className="font-playwrite font-bold text-inherit mx-2">
            <span className="font-rubik">J</span>amvaly
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarMenu>
      <ThemeSwitch />
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === 4 ? "success"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      <NavbarContent justify="end">
        <AuthDrawer />
        <NavbarMenuToggle />
      </NavbarContent>
    </Navbar>
  );
}
