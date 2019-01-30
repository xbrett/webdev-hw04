import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Memory />, root);
}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      score: 0,
      tiles: _.shuffle(['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
                         'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H']),
      clickable: true,
      tileSelected: '',
      remainingPairs: 8
     };
  }

  tileClicked(tile) {

  }

  match(tile) {

  }

  noMatch(tile) {

  }

  checkMatch(tile) {

  }

  gameOver() {

  }

  restart() {

  }

  render() {
    return (
      <div className="center">
        <h1>Memory Game</h1>
        <table className="tile-grid">
          <tbody>
            <DisplayTiles root={this} tiles={this.state.tiles} />
          </tbody>
        </table>
        <p>Score: {this.state.score}</p>
      </div>
    );
  }
}

function DisplayTiles(props) {
  let { root, tiles } = props;

  let grid = [];
  let index = 0;

  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(
        <td key={index} onClick={root.checkMatch.bind(root)}>
          <div data-key={index} className="tile">{`${tiles[index]}`}</div>
        </td>
      );
      index++;
    }

    grid.push(<tr key={i}>{row}</tr>);
  }
  return grid;
}

