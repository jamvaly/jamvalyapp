import { Drawer } from "vaul";
import PaymentForm from "./PaymentForm";
import { Button } from "@nextui-org/button";

interface Room {
  title: string;
  price: string;
  // Add other properties as needed
}

interface FoodSwiperProps {
  room: Room;
}

export function FoodSwiper({ room }: FoodSwiperProps) {
  return (
    <div className="text-black">
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <Button color="warning"  className="px-4 shadow-md text-[15px] py-2 rounded-sm">
            Order
          </Button>
        </Drawer.Trigger>
        <Drawer.Portal>
        <div className="fixed inset-0" style={{ zIndex: 1000 }}>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-y-auto">
              <div className="max-w-md mx-auto">
                <PaymentForm room={room} />
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
          </div >
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}