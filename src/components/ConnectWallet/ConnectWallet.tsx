'use client';

import ClientOnly from '@/components/ClientOnly/ClientOnly';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function ConnectWallet(): JSX.Element | null {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isConnected,
    isConnecting,
    isReconnecting,
    connector: activeConnector,
    status,
    address,
  } = useAccount();
  // const { signMessageAsync } = useSignMessage();
  const {
    connectAsync,
    connect,
    connectors,
    status: connectStatus,
  } = useConnect({
    // async onSuccess(data) {
    //   await verifyAndSignIn(data.account, data.chain?.id);
    // },
  });

  const [defaultConnector] = connectors;

  useEffect(() => {
    if (status === 'connected') {
      connect({ connector: activeConnector });
    }
  }, [status, connect, activeConnector]);

  // const verifyAndSignIn = async (
  //   publicAddress: string,
  //   chainId?: number,
  // ): Promise<void> => {
  //   if (isConnected) {
  //     try {
  //       // Send the public address to generate a nonce associates with our account
  //       const authRes = await fetch('api/auth/begin', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           publicAddress,
  //         }),
  //       });

  //       if (!authRes.ok) {
  //         throw new Error('Error connecting to server');
  //       }

  //       const { nonce } = await authRes.json();
  //       const domain = window.location.host;
  //       const origin = window.location.origin;
  //       const statement = 'Connect to Panther App';
  //       const siweMessage = new SiweMessage({
  //         domain,
  //         address: publicAddress,
  //         statement,
  //         uri: origin,
  //         version: '1',
  //         chainId,
  //         nonce,
  //       });

  //       const message = siweMessage.prepareMessage();

  //       const signature = await signMessageAsync({
  //         message,
  //       });

  //       // Use NextAuth to sign in with our address and the nonce
  //       await signIn('crypto', {
  //         publicAddress,
  //         message,
  //         signature,
  //         redirect: false,
  //       });

  //       // const accessTokenResponse = await verifyRes.json();
  //     } catch (err) {
  //       await disconnectAsync();
  //     }
  //   }
  // };

  const { disconnectAsync } = useDisconnect({
    // async onSettled() {
    //   await signOut({ redirect: false });
    // },
  });

  return (
    <>
      <ClientOnly>
        <p>{status}</p>
        <p>{connectStatus}</p>
        {!defaultConnector.ready && (
          <Button color="primary">Install {defaultConnector.name}</Button>
        )}
        {!isConnected ? (
          <Button
            isLoading={isConnecting || isReconnecting}
            color="primary"
            onClick={onOpen}
          >
            Connect {address}
          </Button>
        ) : (
          <Button color="primary" onClick={() => disconnectAsync()}>
            Disconnect {address}
          </Button>
        )}
      </ClientOnly>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Connect your wallet
          </ModalHeader>
          <ModalBody>
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                isLoading={isConnecting}
                onClick={() => connectAsync({ connector })}
              >
                {connector.name}
              </Button>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
