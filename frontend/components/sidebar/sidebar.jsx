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
    const buttonImg = (this.state.intervalHandler) ? "http://res.cloudinary.com/dq5kxnx9d/image/upload/v1491778125/pause_fdkwav.png" : "http://res.cloudinary.com/dq5kxnx9d/image/upload/v1491778125/play-button_yg1xeu.png";

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
  0: "http://res.cloudinary.com/dq5kxnx9d/video/upload/v1491778527/e-note_itvqpz.mp3",
  1: "http://res.cloudinary.com/dq5kxnx9d/video/upload/v1491778526/a-note_sae2hh.mp3",
  2: "http://res.cloudinary.com/dq5kxnx9d/video/upload/v1491778526/b-note_xn8ick.mp3",
  3: "http://res.cloudinary.com/dq5kxnx9d/video/upload/v1491778526/d-note_ggcfia.mp3",
  4: "http://res.cloudinary.com/dq5kxnx9d/video/upload/v1491778528/highe-note_oqjnoy.mp3",
  5: "http://res.cloudinary.com/dq5kxnx9d/video/upload/v1491778527/g-note_ywaq8n.mp3",
  6: "http://res.cloudinary.com/dq5kxnx9d/video/upload/v1491778527/higha-note_qzn1re.mp3",
  7: "http://res.cloudinary.com/dq5kxnx9d/video/upload/v1491778527/highb-note_inm3qa.mp3",
  8: "http://res.cloudinary.com/dq5kxnx9d/video/upload/v1491778528/highd-note_eeigjw.mp3"
};

export default Sidebar;
