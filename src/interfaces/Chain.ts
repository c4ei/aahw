export type Chain = {
    chainId: string;
    name: string;
    blockExplorerUrl: string;
    rpcUrl: string;
  };

export const c4ei: Chain = {
    chainId: '21004',
    name: 'C4EI',
    blockExplorerUrl: 'https://exp.c4ei.net',
    rpcUrl: 'https://rpc.c4ei.net',
};

export const aah: Chain = {
    chainId: '21133',
    name: 'All About Healthy',
    blockExplorerUrl: 'https://exp.c4ex.net',
    rpcUrl: 'https://rpc.c4ex.net',
};

export const mumbai: Chain = {
    chainId: '80001',
    name: 'Polygon Testnet Mumbai',
    blockExplorerUrl: 'https://mumbai.polygonscan.com ',
    rpcUrl: '<YOUR-RPC-URL>',
};

export const mainnet: Chain = {
    chainId: '1',
    name: 'Ethereum',
    blockExplorerUrl: 'https://etherscan.io',
    rpcUrl: '<YOUR-RPC-URL>',
};

export const CHAINS_CONFIG = {
    [c4ei.chainId]: c4ei,
    [aah.chainId]: aah,
    [mumbai.chainId]: mumbai,
    [mainnet.chainId]: mainnet,
};