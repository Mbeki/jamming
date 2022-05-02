import React from 'react'
import { Track } from '../Track/Track'
import './Tracklist.css'

export class Tracklist extends React.Component {
     render() {
         return (
            <div className="TrackList">
                {
                    this.props.tracks.map( track => 
                        <Track track={track} 
                            key={track.id} 
                            onAdd={this.props.onAdd}
                            onRemove={this.props.onRemove}
                            isRemoval={this.props.isRemoval}/>)
                }
                
            </div>
        )
    }
}