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
      tileClicked: '',
      remainingPairs: 8
     };
  }

  handleClick(_ev) {
    let tile = _ev.target;

    if (this.state.clickable && !tile.classList.contains('visible')) {
      _ev.persist();
      tile.firstChild.classList.add('visible');

      if (!this.state.tileClicked) {
        this.setState(_.assign({}, this.state, 
          { tileClicked: tile, score: this.state.score + 1 }));
      } else if (this.state.tileClicked.firstChild.dataset.key != tile.firstChild.dataset.key) {
        this.setState(_.assign({}, this.state, {clickable: false}), () => { this.checkMatch(tile); });
      }
    }
  }

  checkMatch(tile) {
    if (this.state.tileClicked.firstChild.innerText == tile.firstChild.innerText) {
      this.match(tile);
    } else {
      this.noMatch(tile);
    }
  }

  match(tile) {
    this.setState(_.assign({}, this.state, {
      tileClicked: '',
      score: this.state.score + 1,
      remainingPairs: this.state.remainingPairs - 1,
      clickable: true
    }), () => {this.gameOver();});
  }

  noMatch(tile) {
    this.setState(_.assign({}, this.state, {score: this.state.score + 1}));
    setTimeout(() => {
        tile.firstChild.classList.remove('visible');
        this.state.tileClicked.firstChild.classList.remove('visible');
        this.setState(_.assign({}, this.state, {tileClicked: '', clickable: true }));
      }, 1000);
  }

  gameOver() {
    if (this.state.remainingPairs == 0) {
      setTimeout(() => {
        alert("Winner!\nScore: " + this.state.score);
      }, 1000);
    }
  }

  restart() {
    window.location.reload();
  }

  render() {
    return (
      <div className="memory-game">
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
        <td key={index} onClick={root.handleClick.bind(root)}>
          <div data-key={index} className="tile">{`${tiles[index]}`}</div>
        </td>
      );
      index++;
    }
    grid.push(<tr key={i}>{row}</tr>);
  }
  return grid;
}

