import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { PrivyProvider } from "@privy-io/react-auth";
import './style.css'
import Faq from './views/faq'
import Juice from './views/juice'
import About from './views/about'
import Marfa from './views/marfa'
import Privacypolicy from './views/privacypolicy'
import Alex from './views/alex'
import Affinity from './views/affinity'
import Account from './views/account'
import SpotlightTemplate from './views/spotlight-template'
import Home from './views/home'
import Profile from './views/profile'
import Termsofservice from './views/termsofservice'
import Contact from './views/contact'
import Collabs from './views/collabs'
import NotFound from './views/not-found'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <Route component={Faq} exact path="/faq" />
        <Route component={Juice} exact path="/juice" />
        <Route component={About} exact path="/about" />
        <Route component={Marfa} exact path="/marfa" />
        <Route component={Privacypolicy} exact path="/privacypolicy" />
        <Route component={Alex} exact path="/alex" />
        <Route component={Affinity} exact path="/affinity" />
        <Route component={Account} exact path="/account" />
        <Route component={SpotlightTemplate} exact path="/spotlight-template" />
        <Route component={Home} exact path="/" />
        <Route component={Profile} exact path="/profile" />
        <Route component={Termsofservice} exact path="/termsofservice" />
        <Route component={Contact} exact path="/contact" />
        <Route component={Collabs} exact path="/collabs" />
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
      appId="cm6137sks006c1073ggbm2tv9" // Replace with your actual Privy App ID
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
