'use client';

import ClientOnly from '@/components/ClientOnly/ClientOnly';
import { Button } from '@nextui-org/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';
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
        await verifyAndSignIn(data.account, data.chain?.id);
      }
    },
  });

  const [authenticationStatus, setAuthenticationStatus] =
    useState<AuthenticationStatus>(
      isConnected && status === 'authenticated'
        ? 'authenticated'
        : 'unauthenticated',
    );

  const verifyAndSignIn = async (
    publicAddress: string,
    chainId?: number,
  ): Promise<void> => {
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

        const { nonce } = await authRes.json();
        const domain = window.location.host;
        const origin = window.location.origin;
        const statement = 'Connect to Panther App';
        const siweMessage = new SiweMessage({
          domain,
          address: publicAddress,
          statement,
          uri: origin,
          version: '1',
          chainId,
          nonce,
        });

        const message = siweMessage.prepareMessage();

        const signature = await signMessageAsync({
          message,
        });

        // Use NextAuth to sign in with our address and the nonce
        await signIn('crypto', {
          publicAddress,
          message,
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
        chain,
      }: ConnectorData): Promise<void> => {
        await signOut({ redirect: false });

        if (account) {
          await verifyAndSignIn(account, chain?.id);
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
      setAuthenticationStatus('unauthenticated');
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
