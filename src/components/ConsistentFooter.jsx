import React, { Fragment } from 'react';
import Footer from './footer';

// This component ensures a consistent footer across all pages
const ConsistentFooter = () => {
  return (
    <Footer rootClassName="footer-root-class-name" />
  );
};

export default ConsistentFooter; 