import React from 'react';
import Favourites from '../Components/Favourites';
import renderer from 'react-test-renderer';

test('renders correctly', () => {
const tree = renderer
.create(<Favourites/>)
.toJSON();
expect(tree).toMatchSnapshot();
});