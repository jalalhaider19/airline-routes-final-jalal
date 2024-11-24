//import '@/styles/globals.css';
import { ThemeProvider } from 'react-bootstrap';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
