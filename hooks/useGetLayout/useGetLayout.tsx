import { components } from './components/components';

const useGetLayout = ({ slug1, slug2 }: { slug1: string; slug2?: string }) => {
  const component = slug2 ? components[`${slug1}_${slug2}`] : components[slug1];

  return {
    headerOne: component?.().headerOne,
    headerTwo: component?.().headerTwo,
    headerThree: component?.().headerThree,
    contentOne: component?.().contentOne,
    contentTwo: component?.().contentTwo,
    contentThree: component?.().contentThree,
  };
};

export default useGetLayout;
