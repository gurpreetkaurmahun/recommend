//when user logs the accountTab should change to user name and search for user name via id retrevied from login co;mponent
import React, { useEffect } from 'react';

function ClearLocalStorage() {
  useEffect(() => {
    // List of keys to remove
    const keysToRemove = [
'oidc.c250926da5f14c18be1b94d111b3763f',
'oidc.c30dbb23474a475fae167ec6528b21f7',
'oidc.b9526d148f644d49a2061c9ec376e446'
      ];

    // Remove each key from localStorage
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed ${key} from localStorage`);
    });

    // Optional: Log remaining items in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value}`);
    }
  }, []);

  return null; // This component doesn't render anything
}

export default ClearLocalStorage;
