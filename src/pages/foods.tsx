import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { FoodSwiper } from "../components/Payment/Foodswiper";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

interface FoodItem {
  title: string;
  img: string;
  price: string;
}

const breakfastItems: FoodItem[] = [
  {
    title: "Chips Omelet",
    img: "images/dinner/chip-omlette.png",
    price: "3,000",
  },
  {
    title: "Bread, Sadden",
    img: "images/dinner/bread-sadden.png",
    price: "2,000",
  },
  {
    title: "Plain Toast Bread",
    img: "images/dinner/platain-bread.png",
    price: "600",
  },
  {
    title: "Bread & Tea",
    img: "images/dinner/bread-tea.png",
    price: "1,200",
  },
  {
    title: "Only Tea",
    img: "images/dinner/tea.png",
    price: "600",
  },
  {
    title: "Custard / Milk",
    img: "images/dinner/custard.png",
    price: "1,500",
  },
];

const dinnerItems: FoodItem[] = [
  {
    title: "Only Fried Rice",
    img: "images/dinner/fried-rice.png",
    price: "1,000",
  },
  {
    title: "White Rice, Stew with Beans & Chicken",
    img: "images/dinner/rice-stew.png",
    price: "4,500",
  },
  {
    title: "Only Jollof Rice",
    img: "images/dinner/jallof.png",
    price: "1,500",
  },
  {
    title: "Beef Pepper Soup with Chips",
    img: "images/dinner/pepper-soup.png",
    price: "2,500",
  },
  {
    title: "Tuwo Rice Draw, Goat Meat or Beef",
    img: "images/dinner/tuwo.png",
    price: "3,500",
  },
  {
    title: "Jollof Spaghetti, Chicken or Fish",
    img: "images/dinner/spagetti.png",
    price: "3,500",
  },
];

function FoodCard({ items }: { items: FoodItem[] }) {
  return (
    <>
      {items.map((item, index: number) => (
        <Card key={index} className="py-1 mb-4 w-full">
          <CardBody className="overflow-visible py-2">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src={item.img}
              width={400}
            />
          </CardBody>
          <CardFooter className="pb-0 py-3 px-4 flex-row justify-between items-start">
            <div className="flex flex-col justify-start text-left">
              <div className="flex items-center">
                <span className="uppercase font-Acme text-[0.8rem] pr-1">
                  {item.title}
                </span>
              </div>
              <span className="font-rubik text-default-500 text-[1rem] font-semibold py-1">
                &#8358;{item.price}
                <span className="font-sharp text-[12px]">/Per Plate</span>
              </span>
            </div>
            <FoodSwiper room={item} />
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default function FoodsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center mt-5 justify-center">
          <h1 className={title()}>Foods</h1>
        </div>
        <section className="w-full">
          <h2 className="font-Acme text-xl mb-4">BreakFast</h2>
          <FoodCard items={breakfastItems} />
        </section>
        <div className="w-full border-b border-gray-300 my-8"></div>
        <section className="w-full">
          <h2 className="font-Acme text-xl mb-4">Dinner/Lunch</h2>
          <FoodCard items={dinnerItems} />
        </section>
      </section>
    </DefaultLayout>
  );
}