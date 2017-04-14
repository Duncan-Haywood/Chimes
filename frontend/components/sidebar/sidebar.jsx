import React from 'react';
import merge from 'lodash/merge';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalHandler: null
    };

    this.oneStep = this.oneStep.bind(this);
    this.findFutureCollision = this.findFutureCollision.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  oneStep() {
    const blocks = this.props.blocks;
    const blockKeys = Object.keys(blocks);

    blockKeys.forEach(key => {
      let block = blocks[key];
      let collisionPos = this.findFutureCollision(blocks, blockKeys, block);

      if (collisionPos) {
        this.props.addCollision(collisionPos);
      }
      else if (this.isCollided(blocks, blockKeys, block)) {
        this.props.shiftCollisions();
        this.props.rotateBlock(block.id);
      }
      else if (this.isHittingWall(block)) {
        this.playSound(block.pos);
        this.props.reverseBlock(block.id);
      }
      this.props.moveBlock(block.id);
    });
  }

  findFutureCollision(blocks, blockKeys, block) {
    let collisionPos;
    blockKeys.forEach(key => {
      if (key != block.id) {
        collisionPos = this.collisionPos(block, blocks[key]);
      }
    });
    return collisionPos;
  }

  collisionPos(block1, block2) {
    const x = block1.pos[0];
    const y = block1.pos[1];

    switch(block1.direction) {
      case "up":
        if (block2.direction === "down" && block1.pos[0] === block2.pos[0] && block1.pos[1] === block2.pos[1] + 2) {
          return [x, y - 1];
        }
      case "down":
        if (block2.direction === "up" && block1.pos[0] === block2.pos[0] && block1.pos[1] === block2.pos[1] - 2) {
          return [x, y + 1];
        }
      case "left":
        if (block2.direction === "right" && block1.pos[1] === block2.pos[1] && block1.pos[0] === block2.pos[0] + 2) {
          return [x - 1, y];
        }
      case "right":
        if (block2.direction === "left" && block1.pos[1] === block2.pos[1] && block1.pos[0] === block2.pos[0] - 2) {
          return [x + 1, y];
        }
    }
  }

  isCollided(blocks, blockKeys, block) {
    const x = block.pos[0];
    const y = block.pos[1];
    let res = false;

    blockKeys.forEach(key => {
      if (key != block.id) {
        if (x === blocks[key].pos[0] && y === blocks[key].pos[1]) {
          res = true;
        }
      }
    });
    return res;
  }

  isHittingWall(block) {
    const x = block.pos[0];
    const y = block.pos[1];

    switch(block.direction) {
      case "up":
        return y === 0;
      case "down":
        return y === 8;
      case "left":
        return x === 0;
      case "right":
        return x === 8;
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
