import Container from '@/components/Container';

import Button from '../Button';

const GetInTourchCard = () => {
  return (
    <Container>
      <div className="rounded-2xl bg-base-400 p-8 text-center">
        <h3 className="text-base font-bold  text-primary-500 md:text-xl">
          Still have questions?
        </h3>
        <p className="mb-8 mt-2 text-sm font-normal leading-7 tracking-wide text-base-300 md:text-lg">
          Can’t find the answer you’re looking for? Please chat to our friendly
          team.
        </p>
        <div className="flex w-full items-center justify-center">
          <Button className="h-11 px-[18px] sm:py-2" buttonType="primary">
            Get in touch
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default GetInTourchCard;
