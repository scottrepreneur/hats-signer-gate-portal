import { VStack } from '@chakra-ui/react';
import { AbiTypeToPrimitiveType } from 'abitype';
import { useEffect, useRef, useState } from 'react';
import { BsPen } from 'react-icons/bs';
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { useDeployMultiHatSGwSafe } from '../../../../utils/hooks/HatsSignerGateFactory';
import Button from '../../../UI/CustomButton/CustomButton';
import Input from '../../../UI/CustomInput/CustomInput';
import MultiInput from '../../../UI/MultiInput/MultiInput';
import { decodeEventLog } from 'viem';
import { HatsSignerGateFactoryAbi } from '../../../../utils/abi/HatsSignerGateFactory/HatsSignerGateFactory';
import { useDeployContext } from '../../../../context/DeployContext';

const decode = (hex = '') => {
  const result = [];
  for (let i = 0; i < hex.length; i += 2) {
    result.push(String.fromCharCode(parseInt(hex.substr(i, 2), 16)));
  }
  return result.join('');
};

interface useDeployMultiHatSGwSafeArgs {
  _ownerHatId: AbiTypeToPrimitiveType<'uint256'>;
  _signersHatIds: AbiTypeToPrimitiveType<'uint256'>[];
  _minThreshold: AbiTypeToPrimitiveType<'uint256'>;
  _targetThreshold: AbiTypeToPrimitiveType<'uint256'>;
  _maxSigners: AbiTypeToPrimitiveType<'uint256'>;
}

export default function MultiHatsSignerGateAndSafeForm() {
  const { selectedDeployAction, isPending, setTransationResult, setIsPending } =
    useDeployContext();
  const [hash, setHash] = useState<`0x${string}` | ''>('');

  const [formData, setFormData] = useState({
    _ownerHatId: '',
    _signersHatIds: ['', ''],
    _minThreshold: '',
    _targetThreshold: '',
    _maxSigners: '',
  });

  const args = useRef({
    _ownerHatId: BigInt(0),
    _signersHatIds: [BigInt(0)],
    _minThreshold: BigInt(0),
    _targetThreshold: BigInt(0),
    _maxSigners: BigInt(0),
  });

  const { config } = useDeployMultiHatSGwSafe(args.current);

  const { data, isLoading, write } = useContractWrite({
    ...config,
  });

  const { data: transactionData, isLoading: transationPending } =
    useWaitForTransaction({
      hash,
      onSuccess(data) {
        const response = decodeEventLog({
          abi: HatsSignerGateFactoryAbi,
          data: data.logs[8].data,
          topics: data.logs[8].topics,
        });

        setTransationResult(response.args);
      },
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    args.current = {
      _ownerHatId: BigInt(formData._ownerHatId),
      _signersHatIds: formData._signersHatIds.map((v) => BigInt(v)),
      _minThreshold: BigInt(formData._minThreshold),
      _targetThreshold: BigInt(formData._targetThreshold),
      _maxSigners: BigInt(formData._maxSigners),
    };

    write?.();
  };

  useEffect(() => {
    if (data) {
      setHash(data.hash);
    }
  }, [data]);

  useEffect(() => {
    setIsPending((isLoading || transationPending) && hash !== '');
  }, [isLoading, transationPending, setIsPending, hash]);

  return (
    <form onSubmit={onSubmit} noValidate>
      <VStack width='100%' alignItems={'flex-start'} fontSize={14} gap={5}>
        <Input
          label='Owner Hat ID (integer)'
          placeholder='26950000000000000000000000004196...'
          name='_ownerHatId'
          value={formData._ownerHatId}
          width='340px'
          onChange={(e) =>
            setFormData({ ...formData, _ownerHatId: e.target.value })
          }
          isDisabled={isLoading}
        />
        <MultiInput
          values={formData._signersHatIds}
          width='372px'
          label='Signer Hat IDs'
          name='_signersHatIds'
          countLabel='Id'
          placeholder='26960000000000000000000000003152...'
          onChange={(_value, index, e) => {
            setFormData({
              ...formData,
              _signersHatIds: formData._signersHatIds.map((v, i) => {
                return i === index ? e.target.value : v;
              }),
            });
          }}
          onClickAdd={(value, _index) => {
            setFormData({
              ...formData,
              _signersHatIds: [...formData._signersHatIds, ''],
            });
          }}
          onClickRemove={(_value, index) => {
            setFormData({
              ...formData,
              _signersHatIds: formData._signersHatIds.filter(
                (v, i) => i !== index
              ),
            });
          }}
        />
        <Input
          label='Min Threshold (integer)'
          width='340px'
          placeholder='3'
          name='_minThreshold'
          value={formData._minThreshold}
          onChange={(e) =>
            setFormData({ ...formData, _minThreshold: e.target.value })
          }
          isDisabled={isLoading}
        />
        <Input
          label='Max Threshold (integer)'
          width='340px'
          placeholder='5'
          name='_targetThreshold'
          value={formData._targetThreshold}
          onChange={(e) =>
            setFormData({ ...formData, _targetThreshold: e.target.value })
          }
          isDisabled={isLoading}
        />
        <Input
          label='Max Signers (integer)'
          width='340px'
          placeholder='9'
          name='_maxSigners'
          value={formData._maxSigners}
          onChange={(e) =>
            setFormData({ ...formData, _maxSigners: e.target.value })
          }
          isDisabled={isLoading}
        />
        <Button isDisabled={isLoading} type='submit' leftIcon={<BsPen />}>
          Write
        </Button>
      </VStack>
    </form>
  );
}
