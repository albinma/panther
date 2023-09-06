'use client';

import ClientOnly from '@/components/ClientOnly/ClientOnly';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

export default function ConnectButton(): JSX.Element | null {
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connect, connectors } = useConnect({
    async onSettled(data, error) {
      if (error) {
        return;
      }

      if (data) {
        try {
          // Send the public address to generate a nonce associates with our account
          const authRes = await fetch('api/auth/authorize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              publicAddress: data.account,
            }),
          });

          if (!authRes.ok) {
            throw new Error('Error connecting to server');
          }

          const { unsignedMessage } = await authRes.json();

          const signature = await signMessageAsync({
            message: unsignedMessage,
          });

          // Once we have the signed message, send it back to the server to verify and get a token
          const verifyRes = await fetch('api/auth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              publicAddress: data.account,
              signature,
            }),
          });

          if (!verifyRes.ok) {
            throw new Error('Error retrieving access token from server');
          }

          // const accessTokenResponse = await verifyRes.json();
        } catch (err) {
          disconnect();
        }
      }
    },
  });

  const { disconnect } = useDisconnect();

  return (
    <ClientOnly>
      {isConnected ? (
        <>
          <div>Connected to {address}</div>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <button onClick={() => connect({ connector: connectors[0] })}>
          Connect with {connectors[0].name}
        </button>
      )}
    </ClientOnly>
  );
}
