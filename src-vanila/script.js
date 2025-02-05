import { makeNode } from "./tools/makeNode";

class Game {
  constructor({ root, blocksColours }) {
    this.root = root;
    this.blocksColours = blocksColours;
    this.init();
  }

  // Click block
  clickBlock(el) {
    const id = el?.dataset?.id;
    if (!this?.state?.active) return;

    // styling
    el.classList.add("highlight");
    setTimeout(() => el.classList.remove("highlight"), 100);

    // game logic
    if (this.state.consequence[this.state.idx] === id) {
      this.state.idx++;
      if (this.state.idx === this.state.consequence.length) {
        this.getNextBlock();
      }
      this.updateUI();
    } else {
      this.newGame();
    }
  }

  // Init Blocks
  initBlocks() {
    const blocksElements = this.blocksColours.map((c, i) =>
      makeNode({
        tag: "div",
        children: i + 1,
        attributes: {
          class: "block opaque",
          style: `background: ${c};`,
          "data-id": i,
        },
      })
    );
    const blocks = makeNode({
      tag: "div",
      children: blocksElements,
      attributes: {
        class: "blocks",
      },
    });

    // Click handler
    const blocksClickHandler = (e) => {
      e.stopPropagation();
      this.clickBlock.bind(this)(e.target);
    };
    blocks.addEventListener("click", blocksClickHandler);

    // Add block
    this.root.appendChild(blocks);
  }

  // Generate new block number
  getNextBlock() {
    const n = Math.floor(Math.random() * this.blocksColours.length).toString();
    this.state.consequence.push(n);
    this.state.idx = 0;
  }
  // Update UI
  updateUI() {
    this.ui.level.innerText = `Level: ${this.state.consequence.length}`;
    this.ui.hint.innerHTML = this.state.consequence
      .map((c, i) => {
        const val = 1 + +c;
        return i === this.state.idx ? `[${val}]` : `&nbsp;${val}&nbsp;`;
      })
      .join(" ");
  }

  // New Game
  newGame() {
    this.state = {
      active: true,
      idx: 0,
      consequence: [],
    };
    this.getNextBlock();
    this.updateUI();
  }

  // Init Start
  initStart() {
    const startBtn = makeNode({
      tag: "button",
      children: "Start game",
      attributes: {
        type: "button",
      },
    });
    startBtn.addEventListener("click", this.newGame.bind(this));
    this.root.appendChild(startBtn);
  }
  initUI() {
    const level = makeNode({ tag: "h2" });
    level.innerText = "Simon Says";
    const hint = makeNode({ tag: "p", attributes: { class: "monospace" } });
    hint.innerText = "Start the game";
    const ui = makeNode({ tag: "div", children: [level, hint] });
    this.ui = { level, hint };
    this.root.appendChild(ui);
  }
  // Init
  init() {
    this.initUI();
    this.initBlocks();
    this.initStart();
  }
}

new Game({
  root: document.getElementById("root"),
  blocksColours: ["darkred", "purple", "darkblue", "darkcyan"],
});
