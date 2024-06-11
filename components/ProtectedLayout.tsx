import LayoutContentsContext from "../contexts/LayoutContentsContext";
import StripeContext from "../contexts/StripeContext";
import useLayoutContents from "../hooks/useLayoutContents";
import useStripe from "../hooks/useStripe";
import Loading from "./Loading";

export default function ProtectedLayout({ children }) {
    const useLayoutContentsValue = useLayoutContents();
    const useStripeValue = useStripe();

    return (
        <StripeContext.Provider value={useStripeValue}>
            <LayoutContentsContext.Provider value={useLayoutContentsValue}>
                {
                    !useStripeValue.isStripeReady ? (
                        <div className="absolute top-0 left-0 w-full h-screen bg-black/40 flex flex-col items-center justify-center z-[99]">
                            <Loading />
                        </div>
                    ) : (
                        children
                    )
                }

            </LayoutContentsContext.Provider>
        </StripeContext.Provider>
    )

}