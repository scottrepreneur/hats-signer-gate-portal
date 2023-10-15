import { VStack, Text } from '@chakra-ui/react';
import MainContent from '../../components/MainContent/MainContent';
import CheckHatsContract from '../claim/components/CheckHatsContract/CheckHatsContract';
import { useState } from 'react';
import Button from '../../components/UI/CustomButton/CustomButton';
import { useNetwork } from 'wagmi';
import { getBlockExplorerUrl } from '../../utils/utils';
import { FiCopy } from 'react-icons/fi';
import { BsCardList } from 'react-icons/bs';
import HSGRemoveForm from './components/HSGRemoveForm/HSGRemoveForm';
import MHSGRemoveForm from './components/MHSGRemoveForm/MHSGRemoveForm';
import SafeButton from '../claim/components/SafeButton/SafeButton';
import MHSGMaxSigners from '../view/components/MHSGView/components/MaxSigners/MaxSigners';
import MHSGMaxThreshold from '../view/components/MHSGView/components/MaxThreshold/MaxThreshold';
import MHSGMinThreshold from '../view/components/MHSGView/components/MinThreshold/MinThreshold';
import HSGMaxSigners from '../view/components/HSGView/components/MaxSigners/MaxSigners';
import HSGMaxThreshold from '../view/components/HSGView/components/MaxThreshold/MaxThreshold';
import HSGMinThreshold from '../view/components/HSGView/components/MinThreshold/MinThreshold';
import { EthereumAddress } from '../../components/Deployers/forms/utils/ReadForm';
import { SafeAttachMessage } from '../../components/Deployers/forms/utils/SafeAttachMessage';
// Check the view transaction button - is the ethers address correct?
// Apply all logic to MHSG version
// Check out the other patern for the submit from claim or view to see if the form submit can change
// Should we be using writeAsync for all?
// Adust teh initial state of formik so that the field is empty (Check the other instance of this first)

// Add standardised "isNotConnected" to all button logics. WHOLE APP
// -- WRONG NETWORK MESSAGE / NOT CONNECTED MESSAGE

const Remove = () => {
  const [result, setResult] = useState<
    undefined | { isHsg: boolean; isMhsg: boolean }
  >(undefined);
  const [address, setAddress] = useState<undefined | EthereumAddress>(
    undefined
  );
  const [isPending, setIsPending] = useState(false);
  const [transaction, setTransaction] = useState(undefined);
  const { chain } = useNetwork();
  const [isErrorOne, setIsErrorOne] = useState(false);
  const [isErrorTwo, setIsErrorTwo] = useState(false);

  let definedContractAddress: EthereumAddress = '0x';
  if (address !== undefined) definedContractAddress = address;

  const headerOne = () => (
    <VStack justifyContent="flex-end" height="100%" alignItems="flex-start">
      <Text as="b">Remove Signing Authority</Text>
      <Text>Connect wallet with relevant hat, click ‘Fetch’</Text>
    </VStack>
  );

  const contentOne = () => {
    return (
      <CheckHatsContract
        onResult={(result, address) => {
          setResult(result);
          setAddress(address);
        }}
      />
    );
  };

  const headerTwo = () => {
    if (result?.isMhsg || result?.isHsg) {
      return (
        <VStack justifyContent="flex-end" height="100%" alignItems="flex-start">
          <Text as="b">Remove Signer from Safe App</Text>
          <Text>Enter wallet address, Click &rsquo;Remove&rsquo;</Text>
        </VStack>
      );
    }
    return <></>;
  };

  const contentTwo = () => {
    if (result?.isMhsg) {
      return (
        <MHSGRemoveForm
          address={address}
          onLoading={(value) => setIsPending(value)}
          onTransationComplete={(transation) => {
            setTransaction(transation);
          }}
        />
      );
    }

    if (result?.isHsg) {
      return (
        <HSGRemoveForm
          hsgAddress={definedContractAddress}
          onTransationComplete={(transation) => {
            setTransaction(transation);
          }}
          setIsErrorOne={setIsErrorOne}
          setIsErrorTwo={setIsErrorTwo}
          setIsPending={setIsPending}
        />
      );
    }
    return <></>;
  };

  const headerThree = () => {
    if (isPending) {
      return (
        <SafeAttachMessage
          text="Transaction Pending..."
          color="black"
          safeData=""
        />
      );
    }

    if (!isPending && transaction) {
      return (
        <SafeAttachMessage
          text="Transaction Complete"
          color="black"
          safeData=""
        />
      );
    }

    return <></>;
  };

  const contentThree = () => {
    if (!isPending && transaction) {
      return (
        <VStack height="100%" alignItems="flex-start" gap={'24px'}>
          <Button
            leftIcon={<FiCopy />}
            onClick={() => {
              window.open(
                `${getBlockExplorerUrl(chain?.id || 1)}/address/${transaction}`
              );
            }}
          >
            View Transaction
          </Button>
          <Button
            leftIcon={<BsCardList />}
            onClick={() => {
              window.open(
                `${getBlockExplorerUrl(chain?.id || 1)}/address/${address}`
              );
            }}
          >
            View {result?.isMhsg ? `MHSG` : `HSG`} Contract
          </Button>

          <SafeButton
            address={address}
            type={result?.isMhsg ? 'MHSG' : 'HSG'}
          ></SafeButton>
          {result?.isMhsg && (
            <>
              <MHSGMaxSigners address={address} />
              <MHSGMaxThreshold address={address} />
              <MHSGMinThreshold address={address} />
            </>
          )}
          {result?.isHsg && (
            <>
              <HSGMaxSigners address={address} />
              <HSGMaxThreshold address={address} />
              <HSGMinThreshold address={address} />
            </>
          )}
        </VStack>
      );
    }

    if (!isPending && isErrorOne) {
      return (
        <SafeAttachMessage
          text="Transaction Failed: 'StillWearsSignerHat'"
          color="red"
          safeData="The Signer address must first renounce the associated hat in the app."
          justifyStart={true}
        />
      );
    }
    // if (isErrorTwo) {
    //   return (
    //     <SafeAttachMessage
    //       text="Transaction Failed: 'NotSignerHatWearer'"
    //       color="red"
    //       safeData="The Signer address is not wearing the relevant hat"
    //     />
    //   );
    // }
    if (!isPending && isErrorTwo) {
      return (
        <>
          <SafeAttachMessage
            text="Transaction Failed: 'FailedExecRemoveSigner'"
            color="red"
            safeData="The address is invalid, below are potential reasons why:"
            justifyStart={true}
          >
            <ul>
              <li>
                <Text>The address you&apos;ve entered is incorrect.</Text>
              </li>
              <li>
                <Text>
                  The address you&apos;ve entered is not wearing the relevant
                  hat.
                </Text>
              </li>
              <li>
                <Text>
                  The signer address has not claimed singing authority.
                </Text>
              </li>
              <li>
                <Text>Singing authority has already been removed.</Text>
              </li>
            </ul>
          </SafeAttachMessage>
        </>
      );
    }

    return <></>;
  };

  return (
    <MainContent
      headerOne={headerOne()}
      headerTwo={headerTwo()}
      headerThree={headerThree()}
      contentOne={contentOne()}
      contentTwo={contentTwo()}
      contentThree={contentThree()}
    />
  );
};

export default Remove;
