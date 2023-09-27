'use client';

import ClientOnly from '@/components/ClientOnly/ClientOnly';
import { Button } from '@nextui-org/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function ConnectWallet(): JSX.Element {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const {
    connect,
    connectors: [metamask],
  } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <ClientOnly>
      {!metamask ||
        (!metamask.ready && <Button color="primary">Install Metamask</Button>)}

      {metamask &&
        metamask.ready &&
        (isConnected ? (
          <Button color="primary" onClick={() => disconnect()}>
            Disconnect Wallet {address}
          </Button>
        ) : (
          <Button
            isLoading={isConnecting || isReconnecting}
            color="primary"
            onClick={() => connect({ connector: metamask })}
          >
            Connect Wallet
          </Button>
        ))}
    </ClientOnly>
  );
}
