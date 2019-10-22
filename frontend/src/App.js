import React, { Component } from 'react';
import YourMedia from './Components/YourMedia.js';
import Favourites from './Components/Favourites'
import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
	render() {
		return (
			<div>
				
				<BrowserRouter>
					<div>
						<Route exact={true} path="/" component={YourMedia} />
						<Route path="/Favourites_List" component={Favourites} />
					</div>
				</BrowserRouter>

			</div>
		);
	}
}

export default App