import React from 'react';
import YourMedia from '../Components/YourMedia.js';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
const tree = renderer
.create(<YourMedia/>)
.toJSON();
expect(tree).toMatchSnapshot();
});