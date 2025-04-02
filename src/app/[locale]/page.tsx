

import TokenInteraction from "./components/TokenInteraction";
import Footer from "./components/footer";
import Header from "./components/header";
import Introduction from "./components/home/GridSection";
import TokenStats from "./components/home/TokenStats";
import Template from "./components/Template";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
    <Header />
    <Template>
    <main className=" items-center justify-center bg-[#131313]">
      <TokenInteraction />
      <Introduction />
      <TokenStats />
    </main>
    <Footer />
    </Template>
  </div>
  );
}
