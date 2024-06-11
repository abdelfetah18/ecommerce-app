import '../styles/globals.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect } from 'react';
import { Roboto } from 'next/font/google';
import Toast from '../components/Toast';
import ToastContext from '../contexts/ToastContext';
import useToast from '../hooks/useToast';
import useUserSession from '../hooks/useUserSession';
import UserSessionContext from '../contexts/UserSessionContext';
import Loading from '../components/Loading';
import ShoppingCartContext from '../contexts/ShoppingCartContext';
import useLocalStorage from '../hooks/useLocalStorage';
import ProductsFavContext from '../contexts/ProductsFavContext';
import ProtectedLayout from '../components/ProtectedLayout';
import useStripe from '../hooks/useStripe';
import StripeContext from '../contexts/StripeContext';

const fontFamily = Roboto({ subsets: ['latin'], weight: ['100', '300', '400', '500', '700', '900'] });

export default function MyApp({ Component, pageProps }) {
  const productsFavValue = useLocalStorage<string[]>("products-fav", []);
  const shoppingCartValue = useLocalStorage<Product[]>('shopping-cart', []);
  const useToastValue = useToast();
  const useUserSessionValue = useUserSession();

  useEffect(() => {
    if (document) {
      document.body.classList.add(fontFamily.className);
    }
  }, []);

  return (
    <UserSessionContext.Provider value={useUserSessionValue}>
      <ShoppingCartContext.Provider value={shoppingCartValue}>
        <ProductsFavContext.Provider value={productsFavValue}>
          <ToastContext.Provider value={useToastValue}>
            {
              (useUserSessionValue.isLoading) ? (
                <div className="absolute top-0 left-0 w-full h-screen bg-black/40 flex flex-col items-center justify-center z-[99]">
                  <Loading />
                </div>
              ) : (
                <ProtectedLayout>
                  <Component {...pageProps} />
                </ProtectedLayout>
              )
            }
            <Toast />
          </ToastContext.Provider>
        </ProductsFavContext.Provider>
      </ShoppingCartContext.Provider>
    </UserSessionContext.Provider>
  )
}
