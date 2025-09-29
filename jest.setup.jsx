/* eslint-disable @typescript-eslint/no-require-imports */
require('@testing-library/jest-dom');

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next/image', () => {
  const React = require('react');
  const MockImage = (props) => {
    return React.createElement('img', { ...props, alt: props.alt || '' });
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});