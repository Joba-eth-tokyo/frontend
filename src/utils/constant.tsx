export const membersList = [
  { id: 1, name: 'avatar-1', image: '/assets/images/avatar-1.png' },
  { id: 2, name: 'avatar-2', image: '/assets/images/avatar-2.png' },
  { id: 3, name: 'avatar-3', image: '/assets/images/avatar-3.png' },
  { id: 4, name: 'avatar-4', image: '/assets/images/avatar-4.png' },
  { id: 5, name: 'avatar-5', image: '/assets/images/avatar-5.png' },
  { id: 6, name: 'avatar-6', image: '/assets/images/avatar-6.png' },
];

export const faqsList = [
  {
    id: 1,
    question: 'What is Joba?',
    answer:
      'Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.',
  },
  {
    id: 2,
    question: 'How is Joba different?',
    answer:
      'Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.',
  },
  {
    id: 3,
    question: 'What types of projects can I do on Joba?',
    answer:
      'Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.',
  },
  {
    id: 4,
    question: 'How do I apply for jobs?',
    answer:
      'Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.',
  },
  {
    id: 5,
    question: 'How do I hire talents?',
    answer:
      'Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.',
  },
  {
    id: 6,
    question: 'How do I change my account email?',
    answer:
      'Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.',
  },
];

export const toastVariants = {
  topLeft: {
    style: 'top-0 left-0',
  },
  topRight: {
    style: 'top-0 right-0',
  },
  bottomRight: {
    style: 'bottom-0 right-0',
  },
  bottomLeft: {
    style: 'bottom-0 left-0',
  },
  topMiddle: {
    style: 'top-0 left-1/2 -translate-x-1/2 transform',
  },
  bottomMiddle: {
    style: 'bottom-0 left-1/2 -translate-x-1/2 transform',
  },
};

export const toastMessageVariants = {
  Info: {
    base: 'bg-brandPurple-300 border-brandPurple-200 text-brandPurple-200',
    iconstyle: 'text-blue-500 ',
    icon: '',
    name: 'Info',
  },

  Error: {
    base: 'bg-brandRed-50 text-brandRed-200 border-red-500 ',
    iconstyle: 'text-red-500 ',
    icon: '',
    name: 'Error',
  },

  Warning: {
    base: 'bg-yellow-100 border-yellow-500 text-yellow-500',
    iconstyle: 'text-yellow-500 ',
    icon: '',
    name: 'Warning',
  },

  Success: {
    base: 'bg-success-100 border-success-200 text-success-200',
    iconstyle: 'text-green-500 ',
    icon: '',
    name: 'Success',
  },
};

export const INVOICE_STATUS_TYPE = {
  CREATED: 'created',
  PAID: 'paid',
  SENT: 'sent',
};

export const paymentStatus = {
  open: 'Awaiting Payment',
  paid: 'Paid',
  pending: 'Pending',
  canceled: 'Canceled',
  overpaid: 'Overpaid',
  waiting: 'Creating Request',
};

export const paymentStatusColors = {
  open: '#FFF1BE',
  paid: '#D6F3E2',
  pending: '#CBBEFF',
  canceled: '#FFBEBE',
  overpaid: '#BEE8FF',
  waiting: '#D3D3D3',
};

export const ROLE_LIST = [
  'Designer',
  'Software Developer',
  'Community Manager',
  'Technical Support',
  'Data Analyst',
  'DevOps Engineer',
  'Quality Assurance Engineer',
  'Cybersecurity Analyst',
  'Other',
];
