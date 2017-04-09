 import React from 'react';
import merge from 'lodash/merge';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalHandler: null
    };
    this.oneStep = this.oneStep.bind(this);
    this.isCollided = this.isCollided.bind(this);
    this.isHittingWall = this.isHittingWall.bind(this);
    this.playSound = this.playSound.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  oneStep() {
    const blocks = this.props.blocks;
    const blockKeys = Object.keys(blocks);
    let block;

    blockKeys.forEach(key => {
      block = blocks[key];

      if (this.isCollided(blocks, blockKeys, block)) {
        this.props.rotateBlock(block.id);
        this.props.toggleCollision(block.id);
      }
      else if (this.isHittingWall(block)) {
        this.playSound(block.pos);
        this.props.reverseBlock(block.id);
      }
      else if (block.collided) {
        this.props.toggleCollision(block.id);
      }
      this.props.moveBlock(block.id);
    });
  }

  isCollided(blocks, blockKeys, block) {
    let x = block.pos[0];
    let y = block.pos[1];
    let res = false;
    blockKeys.forEach(key => {
      if (key != block.id) {
        if (blocks[key].pos[0] === x && blocks[key].pos[1] === y) {
          res = true;
        }
      }
    });
    return res;
  }

  isHittingWall(block) {
    let x = block.pos[0];
    let y = block.pos[1];
    let dir = block.direction;
    if (dir === "up" || dir === "down") {
      return (y === 0 || y === 8);
    }
    else {
      return (x === 0 || x === 8);
    }
  }

  playSound(pos) {
    let soundFile;
    if (pos[0] === 0 || pos[0] === 8) {
      soundFile = SOUNDS[pos[1]];
    }
    else {
      soundFile = SOUNDS[pos[0]];
    }
    let note = new Audio(soundFile);
    note.volume = 0.1;
    note.play();
  }

  togglePlay() {
    if (this.state.intervalHandler) {
      window.clearInterval(this.state.intervalHandler);
      this.setState({ intervalHandler: null });
    }
    else {
      const handler = window.setInterval(this.oneStep, 250);
      this.setState({ intervalHandler: handler });
    }
  }

  toggleSidebar() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("menu-open");
  }

  render() {
    const buttonImg = (this.state.intervalHandler) ? "../../assets/images/pause.png" : "../../assets/images/play-button.png";

    return (
      <div id="menu">
        <i className="fa fa-bars" onClick={ this.toggleSidebar } aria-hidden="true"></i>

        <div className="sidebar">
          <h2>NameOfApp</h2>
          <img className="play-button" onClick={ this.togglePlay } src={ buttonImg } />
          <button className="reset-button" onClick={ this.props.reset }>Reset</button>

          <div className="icons">
            <a href="https://github.com/clairewild">
              <i className="fa fa-github" aria-hidden="true"></i>
            </a>

            <a href="https://www.linkedin.com/in/claire-wild-9b132484/">
              <i className="fa fa-linkedin" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const SOUNDS = {
  0: "../../assets/sounds/e-note.mp3",
  1: "../../assets/sounds/a-note.mp3",
  2: "../../assets/sounds/b-note.mp3",
  3: "../../assets/sounds/d-note.mp3",
  4: "../../assets/sounds/highe-note.mp3",
  5: "../../assets/sounds/g-note.mp3",
  6: "../../assets/sounds/higha-note.mp3",
  7: "../../assets/sounds/highb-note.mp3",
  8: "../../assets/sounds/highd-note.mp3"
};

export default Sidebar;
