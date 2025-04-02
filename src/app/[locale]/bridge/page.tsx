import BridgeHero from "../components/bridge/Hero";
import TokenFeatures from "../components/bridge/TokenFeatures";
import Footer from "../components/footer";
import Header from "../components/header";




export default function UtoposBridge(){

    return(
        <>
        <Header />
        <main className=" items-center justify-center bg-[#131313]">
        <BridgeHero />
        <TokenFeatures />
        <Footer />
        </main>
        </>
    )
}