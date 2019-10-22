import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
// cleaning the json files text's readability
import parse from 'html-react-parser';
// Importing components
import DescriptionModal from './DescriptionModal.js';
import VideoModal from './VideoModal.js';

import './CSS/YourMedia.css';
import play from './Images/redplay.png';

class YourMedia extends Component {
    constructor(props) {
        super(props);
        // Setting intitial states
        this.state = {
            searchResults: [],
            search: "",
            type: "",
            favouritesList: []
        };
    }

    // The main search function which depends on parameters from the user's input
    mySearch = async () => {
        const search = this.state.search;
        const type = this.state.type;
        
        const api_call = await fetch(`/api?term=${search}&entity=${type}`);
        const response = await api_call.json();
        
        this.setState({
            searchResults: response
        })
    };

    // This function is used to send the favourites information to the backend and return the info into an array
    // It also checks if a favourite has been added already and will indicate by an alert.
    myPost = async (favId,collectName, image, artist, title, preview, wrapper, kind, descrip) => {
        const favouritesCall = await fetch(`/favourites`);
        const favJson = await favouritesCall.json();

        let added = false

        if(favJson.length === 0){
            fetch(`/favourites?id=${favId}&collectionName=${collectName}&image=${image}&artist=${artist}&title=${title}&previewUrl=${preview}&wrapperType=${wrapper}&kind=${kind}&description=${descrip}`, {
                method: "POST", headers: { "Content-Type": "application/json" } })
            .then(() => {
                fetch('/favourites', { method: "GET", headers: { "Content-Type": "application/json" } })
                    .then(res => res.json())
                    .then(favouritesList => this.setState({ favouritesList }));
                })
            alert("Added to Your Favourites!")
        } else {
            for(let i=0;i<favJson.length;i++){

                if(favJson[i].id == favId || favJson[i].previewUrl === preview){
                    console.log(i)
                    alert("Already added to favourites...")
                    added = true
                     }} if (added === false) {
                        fetch(`/favourites?id=${favId}&collectionName=${collectName}&image=${image}&artist=${artist}&title=${title}&previewUrl=${preview}&wrapperType=${wrapper}&kind=${kind}&description=${descrip}`, {
                            method: "POST", headers: { "Content-Type": "application/json" } })
                        .then(() => {
                            fetch('/favourites', { method: "GET", headers: { "Content-Type": "application/json" } })
                                .then(res => res.json())
                                .then(favouritesList => this.setState({ favouritesList }));
                            })
                        alert("Added to Your Favourites!")
                    }                   
        }   
    }
    // This function will return either an audio tag or video tag(within a modal) depending on the user's search
    mediaCheck = (media, other, source) => {
                if(media === "song" || media === "podcast" || other === "audiobook"){
                    return <audio src={source} controls/>
                } else if(media === "music-video" || media === "feature-movie" || media === "tv-episode"){
                    return <VideoModal video={<video width="320" height="240" src={source} controls> Sorry, your browser doesn't support HTML5</video>} />
                }
            }

    // This function returns the description (within a modal) of an audio book if the user searches audiobook
    audioBookDescrip = (wrapper,descrip) => {
        if(wrapper === "audiobook"){
            return <DescriptionModal description={parse(`${descrip}`)} />
        }        
    }

    // This function returns the title of the user's searched item/s
    audioBookTitleCheck = (wrapper,collectName,songName) => {
        if(wrapper === "audiobook"){
            return <h4>{collectName}</h4>
        } else {
            return <h4>{songName}</h4>
        }
    }

    render() {
        return (
            <div className="mainDiv">
                
                <header id="mediaHead">
                    <img className="playImage" id="play" src={play} alt="play button"/>
                    <h1 id="media" >YOUR MEDIA</h1>
                    <p id="subtitle">Songs, Music Videos, Movies, and more... </p>
                    <NavLink className="links" to="/Favourites_list">Your Favourites</NavLink>
                </header>

                <br/>
                {/* The main search and dropdown menu for the user to interact with */}
                <form className="form">
                    <p id="help">Use the dropdown menu to select a media type</p>
                    <input onChange={e => this.setState({search: e.target.value})} type="text" name="search" placeholder="Search"/>

                    <select name="media_type" onChange={e => this.setState({type: e.target.value})}>
                        <option value="song">Song </option>
                        <option value="musicVideo">Music Video </option>
                        <option value="movie">Movie </option>
                        <option value="tvEpisode">Tv Episodes </option>
                        <option value="audiobook">Audio Book </option>
                    </select>

                    <button onClick={(e) => {
                        this.mySearch() 
                        e.preventDefault()
                    }} type="submit" value="Submit" id="btn1">Search</button>
                </form>

            <div className="dataTableDiv">
                <table className="dataTable" id="mainTable">
                    {/*Mapping all the data into a table*/}
                    {this.state.searchResults.map((obj, key) => {
                        return (
                            <tbody key={key++} className="tableRow">
                                <tr>
                                  <td className="tableCol"><img className="artworks" src={obj.artworkUrl100} alt="artwork"/></td>
                                  <td className="tableCol">{this.audioBookTitleCheck(obj.wrapperType,obj.collectionName,obj.trackName)}</td>
                                  <td className="tableCol">{obj.artistName}</td>                                  
                                  <td className="tableCol">{this.mediaCheck(obj.kind, obj.wrapperType, obj.previewUrl)}
                                    {this.audioBookDescrip(obj.wrapperType,obj.description)}
                                  </td>
                                  <td className="tableCol">
                                    <button onClick={() => this.myPost(obj.trackId,obj.collectionName, obj.artworkUrl100, obj.artistName, obj.trackName, obj.previewUrl, obj.wrapperType, obj.kind, obj.description)}>
                                    <i className="fa fa-star"></i>
                                    </button>
                                  </td>
                                </tr>
                            </tbody>
                        );
                    })}
                </table>
            </div> {/*Table div end*/}


            </div>
        )
    }
}

export default YourMedia;
