import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { BedIcon, BriefCaseIcon, CheckIcon, CoffeIcon, CrownIcon, LockIcon, WifiIcon } from "./icons";
import { PaymentSwiper } from "./Payment/paymentSwiper";


export default function RoomCard() {
  const roomItems = [
    {
      title: "Standard Room",
      icon: <BedIcon />,
      img: "../../public/images/Standard.png",
      price: "25,500",
      tags: [
        {
          tagTitle: "WIFI",
          icon: <WifiIcon />
        },
        {
          tagTitle: "Security",
          icon: <LockIcon />
        }
      ]
    },
    {
      title: "Presidential Suite",
      icon: <CrownIcon />,
      img: "../../public/images/Presidential.png",
      price: "85,300",
      tags: [
        {
          tagTitle: "WIFI",
          icon: <WifiIcon />
        },
        {
          tagTitle: "BreakFast",
          icon: <CoffeIcon />
        },
        {
          tagTitle: "Security",
          icon: <LockIcon />
        }
      ]
    },
    {
      title: "VIP Suite",
      icon: <CheckIcon />,
      img: "../../public/images/Vip.png",
      price: "55,550",
      tags: [
        {
          tagTitle: "WIFI",
          icon: <WifiIcon />
        },
        {
          tagTitle: "BreakFast",
          icon: <CoffeIcon />
        },
        {
          tagTitle: "Security",
          icon: <LockIcon />
        }
      ]
    },
    {
      title: "Business Suite",
      icon: <BriefCaseIcon />,
      img: "../../public/images/business.png",
      price: "45,250",
      tags: [
        {
          tagTitle: "WIFI",
          icon: <WifiIcon />
        },
        {
          tagTitle: "Security",
          icon: <LockIcon />
        }
      ]
    }
  ];

  return (
    <>
    
    {roomItems.map((item, index) => (
       <Card key={index} className="py-1 mb-4 w-full ">
       <CardBody className="overflow-visible py-2">
         <Image
           alt="Card background"
           className="object-cover rounded-xl"
           src={item.img}
           width={400}
         />
       </CardBody>
       <CardHeader>
        {/* {item.tags.map((tag, tagIndex) => (
          <Button key={tagIndex} className="text-[10px] mr-2" size="sm" radius="full" startContent={tag.icon}>{tag.tagTitle}</Button>
        ))} */}
       </CardHeader>
       <CardFooter className="pb-0 py-3 px-4 flex-row justify-between items-start">
         <div className="flex flex-col justify-start text-left">
          <div className="flex items-center">
          <span className="uppercase font-Acme text-[0.8rem] pr-1">{item.title}</span>
          {item.icon}
          </div>   
          <span className="font-rubik text-default-500 text-[1rem] font-semibold py-1">&#8358;{item.price}<span className="font-sharp text-[12px]">/Per Night</span></span>
         </div>
         <PaymentSwiper room={item} />
       </CardFooter>
       </Card>
    ))}
    </>
  );
}