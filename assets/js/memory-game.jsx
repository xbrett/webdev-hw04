import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Memory channel={channel}/>, root);
}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      score: 0,
      tiles: [],
      firstClicked: null,
      secondClicked: null
     };
    this.channel = props.channel;

    this.channel
        .join()
        .receive("ok", this.updateView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp); });
  }

  updateView(view) {
    this.setState(view.game);
  }

  handleClick(tile) {

    if (tile.matched) {
      return;
    } else {
      this.channel.push("set_visible", {tile: tile})
          .receive("ok", this.updateView.bind(this));
    }

    if (this.state.firstClicked == null) {
      this.channel.push("get_first", {tile: tile})
          .receive("ok", this.updateView.bind(this));
    }
    if (this.state.firstClicked != null && this.state.secondClicked == null) {
      this.channel.push("get_second", {tile: tile})
          .receive("ok", this.updateView.bind(this));
    }
  }

  restart() {
    this.channel.push("new")
        .receive("ok", this.updateView.bind(this));
  }

  render() {
    return (
      <div className="memory-game">
        <h1>Memory Game</h1>
        <table className="gameboard">
          <tbody>
            <RenderBoard root={this} tiles={this.state.tiles}/>
          </tbody>
        </table>
        <h4>Current score: {this.state.score}</h4>
        <button type="button" onClick={this.restart.bind(this)}>Reset</button>
      </div>
    );
  }
}

function RenderBoard(props) {
  let { root, tiles } = props;
  let board = [];
  let width = 4;

  for (let i = 0; i < width; i++) {
    board.push(
      <tr key={i}>
        <RenderRow root={root} tiles={tiles.slice(i*width, i*width+4)} />
      </tr>
    );
  }
  return board;
}

function RenderRow(props) {
  let { root, tiles } = props;
  let row = [];

  for (let j = 0; j < tiles.length; j++) {
    if (tiles[j].visible) {
      row.push(
        <td key={tiles[j].key} onClick={() =>  root.handleClick(tiles[j])}>
          <div data-key={tiles[j].key} className="tile visible">{tiles[j].letter}</div>
        </td>
      );
    } else {
      row.push(
        //{`${tiles[j].letter}`}
        <td key={tiles[j].key} onClick={() => { root.handleClick(tiles[j])}}>
          <div data-key={tiles[j].key} className="tile">{tiles[j].letter}</div>
        </td>
      );
    }
    
  }
  return row;
}