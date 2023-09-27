'use client';

import ClientOnly from '@/components/ClientOnly/ClientOnly';
import { Button } from '@nextui-org/react';
import { useEffect } from 'react';
import {
  ConnectorData,
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi';

export default function ConnectWallet(): JSX.Element {
  const {
    address,
    isConnected,
    isConnecting,
    isReconnecting,
    connector: activeConnector,
  } = useAccount();
  const {
    connect,
    connectors: [metamask],
  } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (activeConnector) {
      const handleConnectorUpdate = async (
        data: ConnectorData,
      ): Promise<void> => {
        await activeConnector.connect({
          chainId: data?.chain?.id,
        });
      };

      activeConnector.on('change', handleConnectorUpdate);

      return () => {
        activeConnector.off('change', handleConnectorUpdate);
      };
    }
  });

  const buttonType = (): 'switch' | 'install' | 'connect' | 'disconnect' => {
    if (switchNetwork && chain?.unsupported) {
      return 'switch';
    }

    if (!metamask || !metamask.ready) {
      return 'install';
    }

    return isConnected ? 'disconnect' : 'connect';
  };

  const handleSwitchNetwork = (): void => {
    if (switchNetwork) {
      switchNetwork(chains[0].id);
    }
  };

  return (
    <ClientOnly>
      {buttonType() === 'switch' && (
        <Button color="primary" onClick={handleSwitchNetwork}>
          Switch Network
        </Button>
      )}

      {buttonType() === 'install' && (
        <Button color="primary">Install Metamask</Button>
      )}

      {buttonType() === 'connect' && (
        <Button
          isLoading={isConnecting || isReconnecting}
          color="primary"
          onClick={() => connect({ connector: metamask })}
        >
          Connect Wallet
        </Button>
      )}

      {buttonType() === 'disconnect' && (
        <Button
          color="primary"
          isLoading={isReconnecting}
          onClick={() => disconnect()}
        >
          Disconnect Wallet {address}
        </Button>
      )}
    </ClientOnly>
  );
}
