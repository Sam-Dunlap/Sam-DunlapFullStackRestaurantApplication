import React from 'react';

export const SiteContext = React.createContext({'name' : 'Guest'});

export async function getAccounts() {
  const accounts = await fetch('localhost:5000/Accounts');
  return accounts;
}

