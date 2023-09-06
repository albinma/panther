'use client';

import ClientOnly from '@/components/ClientOnly/ClientOnly';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import {
  ConnectorData,
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
} from 'wagmi';

export default function ConnectButton(): JSX.Element | null {
  const { status, data } = useSession();
  const {
    isConnected,
    address,
    status: accountStatus,
    connector: activeConnector,
  } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connect, connectors } = useConnect({
    async onSettled(data, error) {
      if (error) {
        return;
      }

      if (data) {
        await verifyAndSignIn(data.account);
      }
    },
  });

  const verifyAndSignIn = async (publicAddress: string): Promise<void> => {
    if (isConnected) {
      try {
        // Send the public address to generate a nonce associates with our account
        const authRes = await fetch('api/auth/begin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicAddress,
          }),
        });

        if (!authRes.ok) {
          throw new Error('Error connecting to server');
        }

        const { unsignedMessage } = await authRes.json();

        const signature = await signMessageAsync({
          message: unsignedMessage,
        });

        // Use NextAuth to sign in with our address and the nonce
        await signIn('crypto', {
          publicAddress,
          signature,
          redirect: false,
        });

        // const accessTokenResponse = await verifyRes.json();
      } catch (err) {
        disconnect();
      }
    }
  };

  const { disconnect } = useDisconnect({
    async onSettled() {
      await signOut({ redirect: false });
    },
  });

  useEffect(() => {
    if (activeConnector) {
      const handleConnectorUpdate = async ({
        account,
      }: ConnectorData): Promise<void> => {
        await signOut({ redirect: false });

        if (account) {
          await verifyAndSignIn(account);
        }
      };

      if (activeConnector) {
        activeConnector.on('change', handleConnectorUpdate);
      }

      return () => {
        activeConnector.off('change', handleConnectorUpdate);
      };
    }
  }, [activeConnector]);

  return (
    <ClientOnly>
      <div>Authentication status: {status}</div>
      <div>Account status: {accountStatus}</div>
      {isConnected ? (
        <>
          <div>Connected to {address}</div>
          <div>Logged in as {data?.user?.publicAddress}</div>
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
