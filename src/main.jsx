import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { PrivyProvider } from "@privy-io/react-auth";
import { createOrUpdateSupabaseUser } from './lib/auth';
import { PrivyAuthHandler } from './components/PrivyAuthHandler';
import './style.css'
import Faq from './views/faq'
import Juice from './views/juice'
import About from './views/about'
import Marfa from './views/marfa'
import Drop from './views/drop'
import Privacypolicy from './views/privacypolicy'
import Alex from './views/alex'
import Affinity from './views/affinity'
import Account from './views/account'
import SpotlightTemplate from './views/spotlight-template'
import Home from './views/home'
import Profile from './views/profile'
import Termsofservice from './views/termsofservice'
import Contact from './views/contact'
import Collab from './views/collab'
import Collabs from './views/collabs'
import NotFound from './views/not-found'
import IYKPage from './views/iyk-page'
import DK from './views/dk'
import Liv from './views/liv'
import PW from './views/pw'
import Marfa2025 from './views/marfa2025'
import NY25 from './views/ny25'
import MM23 from './views/mm25'
import Arc from './views/arc'
import BlueSkies from './views/blueskies'
import TheGarden from './views/thegarden'
import ISpy from './views/ispy'
import PostWook from './views/postwook'
import Goppie from './views/goppie'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  return (
    <Router>
      <PrivyAuthHandler />
      <ScrollToTop />
      <Switch>
        <Route component={Faq} exact path="/faq" />
        <Route component={Juice} exact path="/juice" />
        <Route component={About} exact path="/about" />
        <Route component={Marfa} exact path="/marfa" />
        <Route component={Drop} exact path="/drop" />
        <Route component={Privacypolicy} exact path="/privacypolicy" />
        <Route component={Alex} exact path="/alex" />
        <Route component={Affinity} exact path="/affinity" />
        <Route component={Account} exact path="/account" />
        <Route component={SpotlightTemplate} exact path="/spotlight-template" />
        <Route component={Home} exact path="/" />
        <Route component={Profile} exact path="/profile" />
        <Route component={Termsofservice} exact path="/termsofservice" />
        <Route component={Contact} exact path="/contact" />
        <Route exact path="/collabs" component={Collabs} />
        <Route exact path="/collab" component={Collab} />
        <Route component={IYKPage} exact path="/cc25" />
        <Route component={DK} exact path="/dk" />
        <Route component={Liv} exact path="/liv" />
        <Route component={PW} exact path="/pw" />
        <Route component={Marfa2025} exact path="/marfa2025" />
        <Route component={NY25} exact path="/ny25" />
        <Route component={MM23} exact path="/mm25" />
        <Route component={Arc} exact path="/arc" />
        <Route component={BlueSkies} exact path="/blueskies" />
        <Route component={TheGarden} exact path="/thegarden" />
        <Route component={ISpy} exact path="/ispy" />
        <Route component={PostWook} exact path="/postwook" />
        <Route component={Goppie} exact path="/goppie" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  )
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="cm6137sks006c1073ggbm2tv9"
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        }
      }}
      onSuccess={async (user) => {
        try {
          // Log the entire user object
          console.log('Full Privy user object:', JSON.stringify(user, null, 2));
          
          // Log specific fields we're interested in
          console.log('Privy user details:', {
            id: user.id,
            hasWallet: !!user.wallet,
            walletAddress: user.wallet?.address,
            email: user.email?.address,
            name: user.name,
            linkedAccounts: user.linkedAccounts
          });
          
          const result = await createOrUpdateSupabaseUser({
            id: user.id,
            wallet: user.wallet,
            email: user.email?.address,
            name: user.name
          });
          console.log('Supabase response:', result);
        } catch (error) {
          console.error('Detailed error syncing user with Supabase:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            stack: error.stack
          });
        }
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
