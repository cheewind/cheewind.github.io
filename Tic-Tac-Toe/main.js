(() => {
  
  const EMPTY = 0;
  const CROSS = 1;
  const CIRCLE = 2;
  
  const PLAYERA = 1;
  const PLAYERB = 2;
  
  const canvasWidth = 1024;
  const canvasHeight = 768;
  const panelPositionX = 257;
  const panelPositionY = 129;
  const panelWidth = 510;
  const panelHeight = 510;

  let currentPlayer = EMPTY;
  let leftSlot = 9;
  
  let panel = {};
  function initPanel() {
    for (let r = 0; r < 3; ++r) {
      panel[r] = {};
      for (let c = 0; c < 3; ++c) {
        panel[r][c] = EMPTY;
      }
    }
  }
  
  function drawPanel() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    ctx.fillStyle = "hsl(220, 70%, 80%)";
    ctx.fillRect(0, 0, 1024, 768);
    
    ctx.fillStyle = "hsl(220, 70%, 95%)";
    ctx.fillRect(panelPositionX, panelPositionY, panelWidth, panelHeight);
    
    ctx.strokeStyle = "hsl(220, 70%, 70%)";
    ctx.lineWidth = 5;
    ctx.strokeRect(panelPositionX, panelPositionY, panelWidth, panelHeight);
    
    ctx.beginPath();
    // up horizontal
    ctx.moveTo(panelPositionX, panelPositionY + panelHeight / 3);
    ctx.lineTo(panelPositionX + panelWidth, panelPositionY + panelHeight / 3);
    // down horizontal
    ctx.moveTo(panelPositionX, panelPositionY + 2 * panelHeight / 3);
    ctx.lineTo(panelPositionX + panelWidth, panelPositionY + 2 * panelHeight / 3);
    // left vertical
    ctx.moveTo(panelPositionX + panelWidth / 3, panelPositionY);
    ctx.lineTo(panelPositionX + panelWidth / 3, panelPositionY + panelHeight);
    // right vertical
    ctx.moveTo(panelPositionX + 2 * panelWidth / 3, panelPositionY);
    ctx.lineTo(panelPositionX + 2 * panelWidth / 3, panelPositionY + panelHeight);
    ctx.closePath();
    ctx.stroke();
  }
  
  function drawCircle(row, col) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    let baseX = panelPositionX + col * panelWidth / 3;
    let baseY = panelPositionY + row * panelHeight / 3;
    
    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.strokeStyle = "hsl(0, 70%, 50%)";
    ctx.arc(baseX + panelWidth / 3 / 2, baseY + panelHeight / 3 / 2, panelWidth / 3 / 3, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
  }
  
  function drawCross(row, col) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    
    let baseX = panelPositionX + col * panelWidth / 3;
    let baseY = panelPositionY + row * panelHeight / 3;
    
    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.strokeStyle = "hsl(220, 70%, 50%)";
    ctx.moveTo(baseX + panelWidth / 3 / 6, baseY + panelHeight / 3 / 6);
    ctx.lineTo(baseX + panelWidth / 3 - panelWidth / 3 / 6, baseY + panelHeight / 3 - panelHeight / 3 / 6);
    ctx.moveTo(baseX + panelWidth / 3 - panelWidth / 3 / 6, baseY + panelHeight / 3 / 6);
    ctx.lineTo(baseX + panelWidth / 3 / 6, baseY + panelHeight / 3 - panelHeight / 3 / 6);
    ctx.closePath();
    ctx.stroke();
  }
  
  function checkWin(row, col) {
    let win;
    // check same row
    if (panel[row][0] == panel[row][col]
      && panel[row][1] == panel[row][col]
      && panel[row][2] == panel[row][col]) {
      return true;
    }
    // check same column
    if (panel[0][col] == panel[row][col]
      && panel[1][col] == panel[row][col]
      && panel[2][col] == panel[row][col]) {
      return true;
    }
    // check left oblique
    if (row == col
      && panel[0][0] == panel[row][col]
      && panel[1][1] == panel[row][col]
      && panel[2][2] == panel[row][col]) {
      return true;
    }
    // check right oblique
    if (row + col == 2
      && panel[0][2] == panel[row][col]
      && panel[1][1] == panel[row][col]
      && panel[2][0] == panel[row][col]) {
      return true;
    }
    //
    return false;
  }
  
  function createClickListener() {
    let clickListeners = document.createElement('div');
    for (let r = 0; r < 3; ++r) {
      for (let c = 0; c < 3; ++c) {
        let ck = document.createElement('div');
        clickListeners.appendChild(ck);
        ck.classList.add('clickarea');
        ck.style.width = panelWidth / 3 + 'px';
        ck.style.height = panelHeight / 3 + 'px';
        ck.style.position = 'absolute';
        ck.style.top = panelPositionY + r * panelHeight / 3 + 'px';
        ck.style.left = panelPositionX + c * panelWidth / 3 + 'px';
        ck.dataset.row = r;
        ck.dataset.col = c;
        ck.addEventListener('click', e => {
          let row = Number(e.target.dataset.row);
          let col = Number(e.target.dataset.col);
          let content = panel[row][col];
          if (content != EMPTY) return;
          
          let hint = document.getElementById('hint');
          if (currentPlayer == CROSS) {
            panel[row][col] = CROSS;
            drawCross(row, col);
            --leftSlot;
            //
            let win = checkWin(row, col);
            if (!win) {
              if (leftSlot != 0) {
                currentPlayer = CIRCLE;
                hint.innerHTML = "Player O 's turn";
              }
              else {
                currentPlayer = EMPTY;
                hint.innerHTML = "drew";
              }
            }
            else {
              currentPlayer = EMPTY;
              hint.innerHTML = "Player X win";
            }
          }
          else if (currentPlayer == CIRCLE) {
            panel[row][col] = CIRCLE;
            drawCircle(row, col);
            --leftSlot;
            //
            let win = checkWin(row, col);
            if (!win) {
              if (leftSlot != 0) {
                currentPlayer = CROSS;
                hint.innerHTML = "Player X 's turn";
              }
              else {
                currentPlayer = EMPTY;
                hint.innerHTML = "drew";
              }
            }
            else {
              currentPlayer = EMPTY;
              hint.innerHTML = "Player O win";
            }
          }
        });
      }
    }
    return clickListeners;
  }
  
  function createHint() {
    let hint = document.createElement('div');
    hint.id = 'hint';
    hint.classList.add('unselectable');
    hint.style.width = '300px';
    hint.style.height = '100px';
    hint.style.position = 'absolute';
    hint.style.top = panelHeight / 10 + 'px';
    hint.style.left = canvasWidth / 2 - 150 + 'px';
    hint.style.fontSize = '48px';
    hint.style.color = 'black';
    hint.style.textAlign = 'center';
    hint.innerHTML = "Player O 's turn";
    return hint;
  }
  
  function createUI() {
    let ui = document.getElementById('ui');
    
    let clickListener = createClickListener();
    ui.appendChild(clickListener);
    
    let hint = createHint();
    ui.appendChild(hint);
  }
  
  function createGame() {
    let game = document.createElement('div');
    game.id = 'game';
    
    let canvas = document.createElement('canvas');
    game.appendChild(canvas);
    canvas.id = 'canvas';
    canvas.setAttribute('height', '768');
    canvas.setAttribute('width', '1024');
    
    let ui = document.createElement('div');
    game.appendChild(ui);
    ui.id = 'ui';
    
    return game;
  }
  
  function initialize() {
    initPanel();
    createUI();
  }
  
  window.addEventListener('load', e => {
    let game = createGame();
    document.body.appendChild(game);
    
    initialize();
    drawPanel();
    
    currentPlayer = CIRCLE;
  });
})();
