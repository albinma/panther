'use client';

import ClientOnly from '@/components/ClientOnly/ClientOnly';
import { Button } from '@nextui-org/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  ConnectorData,
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
} from 'wagmi';

type AuthenticationStatus =
  | 'unauthenticated'
  | 'authenticating'
  | 'authenticated';

export default function ConnectMetamask(): JSX.Element | null {
  const { status } = useSession();
  const {
    isConnected,
    isConnecting,
    isReconnecting,
    connector: activeConnector,
  } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connectAsync, connectors } = useConnect({
    async onSettled(data, error) {
      if (error) {
        return;
      }

      if (data) {
        await verifyAndSignIn(data.account);
      }
    },
  });

  const [authenticationStatus, setAuthenticationStatus] =
    useState<AuthenticationStatus>(
      isConnected && status === 'authenticated'
        ? 'authenticated'
        : 'unauthenticated',
    );

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
        await disconnectAsync();
      }
    }
  };

  const { disconnectAsync } = useDisconnect({
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

  useEffect(() => {
    if (isConnected && status === 'authenticated') {
      setAuthenticationStatus('authenticated');
    } else if (isConnected && status !== 'authenticated') {
      setAuthenticationStatus('authenticating');
    } else {
      setAuthenticationStatus(
        isConnecting || isReconnecting ? 'authenticating' : 'unauthenticated',
      );
    }
  }, [isConnected, isConnecting, isReconnecting, status]);

  const handleConnect = async (): Promise<void> => {
    if (authenticationStatus === 'unauthenticated') {
      await connectAsync({ connector: connectors[0] });
    } else {
      await disconnectAsync();
    }
  };

  return (
    <ClientOnly>
      <Button
        isLoading={authenticationStatus === 'authenticating'}
        color="primary"
        onClick={handleConnect}
      >
        {authenticationStatus === 'authenticated' ? 'Disconnect' : 'Connect'}
      </Button>
    </ClientOnly>
  );
}
