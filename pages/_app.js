import '../styles/globals.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  let [theme,setTheme] = useState("light");

  useEffect(() => {
    // Load Theme mode from LocalStorage
    let th = localStorage.getItem("theme");
    console.log(th, { theme })
    if(th == null){
      localStorage.setItem("theme","light");
    }else{
      if(!document.documentElement.classList.contains(th)){
        updateTheme(th);
      }
    }
  },[]);

  function updateTheme(new_theme){
    if(new_theme === "dark"){
        document.documentElement.classList.add("dark");
    }else{
        document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", new_theme);
    setTheme(new_theme);
  }

  return (
    <PayPalScriptProvider  options={{ "client-id": "AXa9T1IwDDwKYKXiOWnk2JkftTWo025ISE4SmhSpug3cNcuShrvI16vrNqdh6gnP4AGK72YuLwvOGE7-" }} >
      <Component {...pageProps} theme={theme} setTheme={updateTheme} />
    </PayPalScriptProvider>
  )
}

export default MyApp
