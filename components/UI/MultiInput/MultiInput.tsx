import { HStack, IconButton, VStack } from '@chakra-ui/react';
import Input from '../CustomInput/CustomInput';
import { HiMinus } from 'react-icons/hi';
import { BsPlusLg } from 'react-icons/bs';
import * as S from './MultiInput.styled';

interface P {
  values: any[];
  label: string;
  countLabel: string;
  placeholder: string;
  name: string;
  type?: string;
  width?: string;
  onChange: (
    value: string,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onClickAdd: (value: string, index: number) => void;
  onClickRemove: (value: string, index: number) => void;
}

const MultiInput: React.FC<P> = (p) => {
  const values = (p.values || []).length === 0 ? [''] : p.values;
  return (
    <VStack gap={'13px'} alignItems='flex-start' width={p.width}>
      {values.map((v, i) => {
        return (
          <Input
            key={i}
            label={`${p.label} [${p.countLabel} ${i + 1}]`}
            type={p.type || 'text'}
            name={`${p.name}[${i}]`}
            value={v.toString()}
            placeholder={p.placeholder}
            width={'100%'}
            onChange={(e) => p.onChange(v, i, e)}
            extra={
              <>
                <HStack gap='8px'>
                  {i > 0 && (
                    <S.IconButtonStyled
                      aria-label='remove value'
                      icon={<HiMinus />}
                      size='xs'
                      onClick={() => {
                        p.onClickRemove(v, i);
                      }}
                    />
                  )}
                  <S.IconButtonStyled
                    aria-label='Add value'
                    icon={<BsPlusLg />}
                    size='xs'
                    isDisabled={!values[i]}
                    onClick={() => p.onClickAdd(v, i)}
                  />
                </HStack>
              </>
            }
          />
        );
      })}
    </VStack>
  );
};

export default MultiInput;