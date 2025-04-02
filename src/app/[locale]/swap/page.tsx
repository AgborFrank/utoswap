import SwapHero from "../components/Swap/Hero";
import MigrationReasons from "../components/Swap/MigrationReasons";
import TradeOnUniswap from "../components/Swap/TradeOnUniswap";
import Footer from "../components/footer";
import Header from "../components/header";


export default function SwapPage(){
    return (
        <>
        <Header />
        <SwapHero />
        <MigrationReasons />
        <TradeOnUniswap />
        <Footer />
        </>
    )
}