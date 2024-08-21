import DefaultLayout from "@/layouts/default";
import WelcomeText from "@/components/wecomeText";
import RoomCard from "@/components/roomCards";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 md:py-8">
        <div className="inline-block max-w-screen-sm text-center justify-center z-0">
          <WelcomeText />
          <RoomCard />
         
        </div>
      </section>
    </DefaultLayout>
  );
}
