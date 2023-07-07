import HatsSignerGateFactoryAbi from './abi/HatsSignerGateFactory/HatsSignerGateFactory.json';
import HatsSignerGateAbi from './abi/HatsSignerGate/HatsSignerGate.json';
import MultiHatsSignerGateAbi from './abi/MultiHatsSignerGate/MultiHatsSignerGate.json';

export const CONTRACTS = {
  hatsSignerGateFactory: {
    contractAddress: '0x50dbb35b81c94b8d1a0ff0cb4aa218ff30166187',
    contractABI: HatsSignerGateFactoryAbi,
  },
  hatsSignerGate: {
    contractAddress: '0x844b3c7781338d3308eb8d64727033893fce1432',
    contractABI: HatsSignerGateAbi,
  },
  multiHatsSignerGate: {
    contractAddress: '0xca9d698adb4052ac7751019d69582950b1e42b43',
    contractABI: MultiHatsSignerGateAbi,
  },
};