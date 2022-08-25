import '../styles/globals.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function MyApp({ Component, pageProps }) {
  return (
    <PayPalScriptProvider  options={{ "client-id": "AXa9T1IwDDwKYKXiOWnk2JkftTWo025ISE4SmhSpug3cNcuShrvI16vrNqdh6gnP4AGK72YuLwvOGE7-" }} >
      <Component {...pageProps} />
    </PayPalScriptProvider>
  )
}

export default MyApp
