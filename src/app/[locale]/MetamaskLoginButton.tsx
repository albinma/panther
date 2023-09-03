'use client';

import { ethers } from 'ethers';
import { signIn } from 'next-auth/react';

// Fix typescript errors for window.ethereum
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

export default function MetamaskLoginButton(): JSX.Element {
  // This function requests a nonce then signs it, proving that
  //  the user owns the public address they are using
  const onSignInWithCrypto = async (): Promise<void> => {
    try {
      if (!window.ethereum) {
        window.alert('Please install MetaMask first.');
        return;
      }

      // Get the wallet provider, the signer and address
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const publicAddress = await signer.getAddress();

      // Send the public address to generate a nonce associates with our account
      const response = await fetch('api/auth/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicAddress,
        }),
      });

      const responseData = await response.json();

      // Sign the received nonce
      const signature = await signer.signMessage(responseData.unsignedMessage);

      // Use NextAuth to sign in with our address and the nonce
      await signIn('crypto', {
        publicAddress,
        signature,
      });
    } catch {
      window.alert('Error with signing, please try again.');
    }
  };

  return <button onClick={onSignInWithCrypto}>Sign in with Metamask</button>;
}
