import React, {Component} from 'react';
import './CSS/Favourites.css';
import trash from './Images/delete.png';
import parse from 'html-react-parser';					// cleaning the json files text's readability
// Bootstrap imports
import DescriptionModal from './DescriptionModal.js';
import VideoModal from './VideoModal.js';
import { NavLink } from 'react-router-dom';

class Favourites extends Component {
	constructor(props){
		super(props);
		this.state = {
			favourites: []
		}
	}
	// Initial load of the json data from favourites path and stored in the favourites array state
	componentDidMount(){
		fetch('/favourites',{ method: "GET", headers: { "Content-Type": "application/json" } })
		.then(res => res.json())
		.then(favourites => this.setState({ favourites }));
	}
	// This function calls the delete method upon clicking the bin icon
	myDelete = (favId,wrapper,preUrl) => {
		fetch(`/favourites?id=${favId}&wrapperType=${wrapper}&previewUrl=${preUrl}`,{ method: "DELETE", headers: { "Content-Type": "application/json" } })
		.then(() => {
			fetch('/favourites', { method: "GET", headers: { "Content-Type": "application/json" } })
				.then(res => res.json())
				.then(favourites => this.setState({ favourites }));
			})
	}

	// This function will return either an audio tag or video tag(within a modal) depending on the user's search
	mediaCheck = (media, other, source) => {
		if(media === "song" || media === "podcast" || other === "audiobook"){
			return <audio src={source} controls/>
		} else if(media === "music-video" || media === "feature-movie" || media === "tv-episode"){
		return <VideoModal video={<video width="320" height="240" src={(source)} controls> Sorry, your browser doesn't support HTML5</video>} />
		}
	}

	// This function returns the description (within a modal) of an audio book if the user searches audiobook
	audioBookDescripFav = (wrapper,descrip) => {
        if(wrapper === "audiobook"){
            return <DescriptionModal description={parse(`${descrip}`)} />
        }        
    }

	// This function returns the title of the user's searched item/s
    audioBookTitleCheckFav = (wrapper,collectName,songName) => {
        if(wrapper === "audiobook"){
            return <h4>{collectName}</h4>
        } else {
            return <h4>{songName}</h4>
        }
    }

	render(){
		return(
		<div>
			<header className="favHead">
				<h1 id="favHead">Your Favourites</h1>
				<NavLink id="link" to="/">Home</NavLink>
			</header>

			<table>
				{/*Mapping all the favourites data into a table*/}
				{this.state.favourites.map((obj, key) =>{
					return(
					<tbody key={key++}>
						<tr>
							<td className="tableData"><img src={obj.image} alt="cover pic"/><br/>
								{this.audioBookTitleCheckFav(obj.wrapperType, obj.collectionName, obj.title)}
								<p>{obj.artist}</p>
							</td>
							
							<td>{this.mediaCheck(obj.kind, obj.wrapperType, obj.previewUrl)}
							<br/>
								{this.audioBookDescripFav(obj.wrapperType, obj.description)}
							</td>
							<td><button onClick={() => this.myDelete(obj.id,obj.wrapperType,obj.previewUrl)}><img src={trash} alt="trash can"/></button></td>
						</tr>
					</tbody>
					)
				})}
			</table>
		</div>
		)
	}
}

export default Favourites;
