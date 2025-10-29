/* PhaseThree.js (deferred src binding, preserves original behavior)
   - Adds per-trial action logging with relative times.
   - Adds detour typing + separate detour logs and line store.
*/

// ---------------------------------------------
// Phase 3 room HTML (unchanged text; no early src loads)
// ---------------------------------------------
var phasethreeroom = [`
<div id='displayhelp' style='display:none'>
  <p>
    Click and drag the images from the top that you wish to place in the gray container when creating your full path.
    Then, click on each of the two images to connect them.<br />
    Click on each of the two images to connect them.<br>
    To remove a connection, simply click on the two images again and the line will disappear.
    To remove an image that you have already placed, click on the image and then the return button in the bottom right.
    <br> once you are finished, press the 'submit' button to book the next client
  </p>
</div>

<button id='batman'
        style='display: block;margin: 0 auto;padding: 10px 20px;background-color: #4CAF50;color: black;border: none;border-radius: 8px;font-size: 16px;cursor: pointer;box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);transition: background-color 0.3s ease;'
        onclick='initiatep3()'>Click to start</button>

<div id='spiderman' style='display: none;'>
  <button id='nextButton'
          style='display: block; padding: 10px 20px; background-color: #4CAF50; color: black; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;'>
    Submit
  </button>

  <div id='Phase3Body'>
    <br>
    <div id='div2' style='width: 700px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa;'>
      <img id='drag01' data-name='${imageList[0]}'  alt='Aliance'        width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag02' data-name='${imageList[1]}'  alt='Boulder'        width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag03' data-name='${imageList[2]}'  alt='Cornwall'       width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag04' data-name='${imageList[3]}'  alt='Custer'         width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag05' data-name='${imageList[4]}'  alt='DelawareCity'   width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag06' data-name='${imageList[5]}'  alt='Medora'         width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag07' data-name='${imageList[6]}'  alt='Newport'        width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag08' data-name='${imageList[7]}'  alt='ParkCity'       width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag09' data-name='${imageList[8]}'  alt='Racine'         width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag10' data-name='${imageList[9]}'  alt='Sitka'          width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag11' data-name='${imageList[10]}' alt='WestPalmBeach'  width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag12' data-name='${imageList[11]}' alt='Yukon'          width='100' height='120' draggable='true' ondragstart='drag(event)'>
      <img id='drag13' data-name='${imageList[12]}' alt='Yukon'          width='100' height='120' draggable='true' ondragstart='drag(event)'>
    </div>

    <div id='div1'
         style='width: 1200px; height: 400px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa; background-color: lightgray;'
         ondrop='drop(event)' ondragover='allowDrop(event)'>
      <div id='div3' style='width: 1200px; height: 400px; margin: 0 auto; position: relative; '></div>

      <img id='imgL' style='position:relative;right:450px;bottom: 250px;border:2px solid blue' width='100' height='120'>
      <img id='imgR' style='position:relative;left:450px;bottom: 250px;border:2px solid blue'  width='100' height='120'>

      <!-- return icon bound at runtime -->
      <img id='return' data-name='return.png'
           style='position: relative;left: 450px;bottom: 100px ;border: 2px solid black' width='50' height='50'>
    </div>
  </div>
</div>
`];

// Image base names (strip .png)
const imageName = imageList.map(name => String(name).replace(/\.png$/i, ''));

// ---------------------------------------------
// Runtime prefix + late binding helpers
// ---------------------------------------------
function p3GetPrefix() {
  const raw = (typeof window !== "undefined" && window.PHASE3_IMG_PREFIX) || "";
  const cleaned = String(raw).replace(/undefined/gi, "").replace(/\/{2,}/g, "/");
  return cleaned && !cleaned.endsWith("/") ? cleaned + "/" : cleaned;
}

function lateBindPhase3Sources() {
  const prefix = p3GetPrefix(); // may be ""
  for (let i = 1; i <= 13; i++) {
    const id = i < 10 ? `drag0${i}` : `drag${i}`;
    const el = document.getElementById(id);
    if (el && !el.src) {
      const name = el.getAttribute("data-name");
      if (name) el.src = prefix + name;
    }
  }
  const ret = document.getElementById("return");
  if (ret && !ret.src) {
    const name = ret.getAttribute("data-name");
    if (name) ret.src = prefix + name;
  }
}

// ---------------------------------------------
// State + Logging
// ---------------------------------------------

// PART THAT NEED TO BE RUN UNDER BUTTON
var images = [];
var attention = 0;
var selected = 1;
var LeftSRC = [];
var RightSRC = [];
var container = [];
var specificline = {};
var specificlinenew = {};
var canvas = [];
var linecounter = 0;

// DETOUR stores
var specificline_detour = {};
var specificlinenew_detour = {};
var linecounter_detour = 0;
var specificline_saved = {};
var detourcity_name = [];

// phase flags & timers
var goal_detor_deter;         // original flag (trial precondition)
var detour_active = false;    // true after user presses "Continue" on detour prompt

var p3StartMs = null;         // absolute ms when phase-3 trial starts
var p3DetourStartMs = null;   // absolute ms when detour segment starts (after Continue)

// action logs (normal vs detour)
var action_phase3 = [];
var action_phase3_detour = [];
window.action_phase3 = action_phase3;
window.action_phase3_detour = action_phase3_detour;

// detour meta (type + which was closed)
var detour_info = null; // { type: 'correct_connection'|'random_fallback_node', hiddenId, hiddenCity }

// route logs into correct sink + relative timer
function logAction(type, details) {
  try {
    const now = Date.now();
    if (detour_active) {
      const t = (p3DetourStartMs == null) ? 0 : (now - p3DetourStartMs);
      action_phase3_detour.push(Object.assign({ t, t_abs: now, type }, details || {}));
    } else {
      const t = (p3StartMs == null) ? 0 : (now - p3StartMs);
      action_phase3.push(Object.assign({ t, t_abs: now, type }, details || {}));
    }
  } catch (e) {}
}

// choose which line store to use depending on detour phase
function getLineStore() {
  if (detour_active) {
    return {
      store: specificline_detour,
      setStore: (v) => { specificline_detour = v; },
      counter: linecounter_detour,
      setCounter: (v) => { linecounter_detour = v; }
    };
  } else {
    return {
      store: specificline,
      setStore: (v) => { specificline = v; },
      counter: linecounter,
      setCounter: (v) => { linecounter = v; }
    };
  }
}

// ---------------------------------------------
// Helpers
// ---------------------------------------------

function displayhelp() {
  $('#bighelp').hide();
  $('#displayhelp').show();
}

function showWarning(messageText) {
  const message = document.createElement('div');
  message.innerText = messageText;
  message.style.position = 'fixed';
  message.style.top = '20px';
  message.style.left = '50%';
  message.style.transform = 'translateX(-50%)';
  message.style.backgroundColor = '#f44336';
  message.style.color = 'white';
  message.style.padding = '10px 20px';
  message.style.borderRadius = '8px';
  message.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
  message.style.fontSize = '18px';
  message.style.zIndex = '1000';
  document.body.appendChild(message);
  setTimeout(() => { message.remove(); }, 5000);
}

// init vars
function gdp_init() {
  images = [];
  attention = 0;
  selected = 1;
  LeftSRC = [];
  RightSRC = [];
  container = [];
  specificline = {};
  specificlinenew = {};
  canvas = [];
  linecounter = 0;

  // reset detour segment state
  specificline_detour = {};
  specificlinenew_detour = {};
  linecounter_detour = 0;
  detour_info = null;
  detour_active = false;

  p3StartMs = null;
  p3DetourStartMs = null;

  action_phase3 = [];
  action_phase3_detour = [];
  window.action_phase3 = action_phase3;
  window.action_phase3_detour = action_phase3_detour;

  logAction('init_phase3');
}

function buildGraphFromStore(storeObj) {
  const g = {};
  for (let k in storeObj) {
    if (storeObj[k] && storeObj[k].name && storeObj[k].name[0]) {
      const m = storeObj[k].name[0].match(/(imgL|imgR|drag\d{2})/g);
      if (!m || m.length !== 2) continue;
      const [a, b] = m;
      if (!g[a]) g[a] = [];
      if (!g[b]) g[b] = [];
      g[a].push(b);
      g[b].push(a);
    }
  }
  return g;
}

function getUniquePathBetween(start, end) {
  const { store } = getLineStore();
  const graph = buildGraphFromStore(store);
  const visited = new Set();
  const path = [];
  function dfs(node) {
    if (node === end) return true;
    visited.add(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        path.push(neighbor);
        if (dfs(neighbor)) return true;
        path.pop();
      }
    }
    return false;
  }
  path.push(start);
  const found = dfs(start);
  return found ? path : null;
}

function mergeObjects(target, source) {
  return { ...target, ...source };
}
function clearCanvas(canvasId) {
  const cv = document.getElementById(canvasId);
  if (cv) {
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    cv.remove();
  }
}

function clearAllCanvases() {
  const container = document.getElementById('div3');
  const canvases = container.querySelectorAll('canvas');
  canvases.forEach(c => clearCanvas(c.id));
}

// ---------------------------------------------
// Continue/Submit button
// ---------------------------------------------
function continueButton() {
  const submitBtn = document.getElementById('nextButton');
  submitBtn.style.display = 'block';
  submitBtn.style.margin = '20px auto';
  submitBtn.style.position = 'static';

  const bottomArea = document.getElementById('div1');
  if (bottomArea && bottomArea.contains(submitBtn)) {
    bottomArea.removeChild(submitBtn);
  }

  submitBtn.onclick = () => {
    const droppedImages = Array.from(document.getElementById('div1').children)
      .filter(el => el.tagName === 'IMG' && el.id.startsWith('drag'));

    const route = getUniquePathBetween("imgL", "imgR");
    if (!route || route.length === 0) {
      logAction('submit_attempt_failed', { reason: 'no_route' });
      showWarning("No valid route found between the left and right images.");
      return;
    }

    // must all be on route
    const anyOutOfRoute = droppedImages.some(img => !route.includes(img.id));
    if (anyOutOfRoute) {
      logAction('submit_attempt_failed', { reason: 'image_outside_route' });
      showWarning("There is an unconnected image on the route. Either return it or connect it.");
      return;
    }

    // all dragged must appear in at least one edge
    const { store } = getLineStore();
    const connectedIds = new Set();
    for (let key in store) {
      if (store[key] && store[key].name && store[key].name[0]) {
        const match = store[key].name[0].match(/(imgL|imgR|drag\d{2})/g);
        if (match) match.forEach(id => connectedIds.add(id));
      }
    }
    const anyUnconnected = droppedImages.some(img => !connectedIds.has(img.id));
    if (anyUnconnected) {
      logAction('submit_attempt_failed', { reason: 'unconnected_image_present' });
      showWarning("At least one dragged image is not connected. Please fix before submitting.");
      return;
    }

    if (!leftAndRightAreConnected()) {
      logAction('submit_attempt_failed', { reason: 'L_R_not_connected' });
      showWarning("There must be a complete path between the left and right cities.");
      return;
    }

    // DETOUR branch (precondition from your schedule)
    if (goal_detor_deter === true && !detour_active) {
      // decide which to close + record detour type
      chooseMiddleImageForMemory(); // sets window.selected_middle_image_type & index
      const closedCityName = imageName[(window.selected_middle_image_index || 1) - 1];
      const closedCityIndex = window.selected_middle_image_index;
      const closedImgId = closedCityIndex < 10 ? `drag0${closedCityIndex}` : `drag${closedCityIndex}`;
      detour_info = {
        type: window.selected_middle_image_type || 'unknown',
        hiddenId: closedImgId,
        hiddenCity: closedCityName
      };
      logAction('detour_prompt_shown', Object.assign({}, detour_info));

      // UI swap to show detour prompt
      submitBtn.style.display = 'none';
      clearAllCanvases();

      const div1 = document.getElementById('div1');
      const div2 = document.getElementById('div2');

      // move any dragged cities back to top bar visually
      const draggedCities = Array.from(div1.children)
        .filter(el => el.tagName === 'IMG' && el.id.startsWith('drag'));
      draggedCities.forEach(img => {
        img.style.position = 'relative';
        img.style.left = '0px';
        img.style.top = '0px';
        img.style.border = '';
        div2.appendChild(img);
      });

      // keep original solution
      specificline_saved = specificline;
      linecounter_saved = linecounter;

      // reset current store for the forthcoming detour phase
      specificline = {};
      specificlinenew = {};
      linecounter = 0;

      // hide screens and show detour dialog
      document.getElementById('div1').style.display = 'none';
      document.getElementById('div2').style.display = 'none';
      document.getElementById('spiderman').style.display = 'none';
      document.getElementById('displayhelp').style.display = 'none';

      const detourDiv = document.createElement('div');
      detourDiv.id = 'detour-warning';
      detourDiv.style.position = 'fixed';
      detourDiv.style.top = '0';
      detourDiv.style.left = '50%';
      detourDiv.style.transform = 'translateX(-50%)';
      detourDiv.style.backgroundColor = '#fff';
      detourDiv.style.border = '2px solid #ccc';
      detourDiv.style.padding = '20px';
      detourDiv.style.zIndex = '9999';
      detourDiv.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
      detourDiv.style.textAlign = 'center';

      detourcity_name = closedCityName;

      const warningText = document.createElement('p');
      warningText.innerText = `${closedCityName} is not available at the moment. Can you create an alternate path?`;

      const placeholderImg = document.createElement('img');
      placeholderImg.src = images[closedCityIndex - 1].src;
      placeholderImg.style.width = '100px';
      placeholderImg.style.height = '120px';
      placeholderImg.style.margin = '10px';

      const continueBtn = document.createElement('button');
      continueBtn.innerText = 'Continue';
      continueBtn.style.padding = '10px 20px';
      continueBtn.style.backgroundColor = '#4CAF50';
      continueBtn.style.color = 'black';
      continueBtn.style.border = 'none';
      continueBtn.style.borderRadius = '8px';
      continueBtn.style.fontSize = '16px';
      continueBtn.style.cursor = 'pointer';
      continueBtn.style.marginTop = '20px';

      continueBtn.onclick = () => {
        detourDiv.remove();
        document.getElementById('div1').style.display = 'block';
        document.getElementById('div2').style.display = 'block';
        document.getElementById('displayhelp').style.display = 'block';
        document.getElementById('spiderman').style.display = 'block';

        // hide the closed image
        const closedImg = document.getElementById(closedImgId);
        if (closedImg) closedImg.style.display = 'none';

        // flip into detour phase & start its timer
        detour_active = true;
        p3DetourStartMs = Date.now();
        logAction('detour_begin', Object.assign({}, detour_info));

        // keep using same handlers & button logic
        continueButton();
      };

      detourDiv.appendChild(warningText);
      detourDiv.appendChild(placeholderImg);
      detourDiv.appendChild(document.createElement('br'));
      detourDiv.appendChild(continueBtn);

      const spidermanBody = document.getElementById('spiderman');
      spidermanBody.parentNode.insertBefore(detourDiv, spidermanBody);
      return;
    }

    // normal successful submit (no detour or detour already done)
    logAction('submit_success', { detour_active });
    jsPsych.finishTrial();
  };
}

// ---------------------------------------------
// Trial start / init
// ---------------------------------------------
function makeVisible() {
  document.getElementById("spiderman").style.display = "block";
}

goalIndex = 0;
let rightName = '';
let leftName = '';

function initiatep3() {
  lateBindPhase3Sources();

  // start per-trial timer once
  if (p3StartMs == null) {
    p3StartMs = Date.now();
    logAction('start_trial');
  }

  if (detourLocationMap[goalIndex]) {
    goal_detor_deter = true;
  } else {
    goal_detor_deter = false;
  }

  makeVisible();
  continueButton();
  $('#displayhelp').show();

  for (let i = 1; i <= 13; i++) {
    images[i - 1] = document.getElementById(i < 10 ? `drag0${i}` : `drag${i}`);
  }
  container = document.getElementById('div1');

  document.getElementById('imgL').src = images[room_goaldir_left[goalIndex] - 1].src;
  rightName = imageName[room_goaldir_right[goalIndex] - 1];
  document.getElementById('imgR').src = images[room_goaldir_right[goalIndex] - 1].src;
  leftName = imageName[room_goaldir_left[goalIndex] - 1];

  for (let i = 1; i <= 13; i++) {
    if (images[i - 1].src == images[room_goaldir_left[goalIndex] - 1].src ||
        images[i - 1].src == images[room_goaldir_right[goalIndex] - 1].src) {
      images[i - 1].style = "display: none;";
    }
  }

  document.getElementById("batman").style.display = "none";

  for (let i = 1; i <= 13; i++) {
    dragElement(document.getElementById(i < 10 ? `drag0${i}` : `drag${i}`));
  }
  returndrag(document.getElementById('return'));
  sideElement(document.getElementById('imgL'));
  sideElement(document.getElementById('imgR'));
  goalIndex++;
}
window.initiatep3 = initiatep3;

// ---------------------------------------------
// City-name resolver (readable edges)
// ---------------------------------------------
function resolveCityNameById(elId) {
  if (elId === 'imgL') return leftName;
  if (elId === 'imgR') return rightName;
  const m = elId.match(/^drag(\d{2})$/);
  if (m) {
    const idx = parseInt(m[1], 10);
    if (!isNaN(idx) && idx >= 1 && idx <= imageName.length) {
      return imageName[idx - 1];
    }
  }
  return null;
}

// ---------------------------------------------
// Line drawing / updating (routes to the correct store)
// ---------------------------------------------
function drawLine(img1, img2) {
  // block direct L<->R
  if ((img1.id === 'imgL' && img2.id === 'imgR') || (img1.id === 'imgR' && img2.id === 'imgL')) {
    logAction('invalid_direct_connection_attempt', { a: img1.id, b: img2.id });
    showWarning("There is no direct flight between these cities. Pick at least one in-between city to start with.");
    return;
  }

  const { store, setStore, counter, setCounter } = getLineStore();

  // degree constraints
  const connectionCounts = {};
  for (let key in store) {
    const line = store[key];
    if (line && line.name && line.name[0]) {
      const match = line.name[0].match(/(imgL|imgR|drag\d{2})/g);
      if (!match) continue;
      match.forEach(id => { connectionCounts[id] = (connectionCounts[id] || 0) + 1; });
    }
  }

  const idsToCheck = [img1.id, img2.id];
  for (let id of idsToCheck) {
    const maxAllowed = (id === 'imgL' || id === 'imgR') ? 1 : 2;
    if ((connectionCounts[id] || 0) >= maxAllowed) {
      logAction('invalid_connection_degree', { node: id, degree: connectionCounts[id], limit: maxAllowed });
      showWarning(`This is a invalid move. You can not connect extra city to a route`);
      return;
    }
  }

  // draw
  canvas = document.createElement('canvas');
  canvas.id = `${img1.id}${img2.id}`;
  const containerdl = document.getElementById('div3');
  containerdl.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = containerdl.offsetWidth;
  canvas.height = containerdl.offsetHeight;

  const rect1 = img1.getBoundingClientRect();
  const rect2 = img2.getBoundingClientRect();
  const containerRect = containerdl.getBoundingClientRect();

  const x1 = rect1.left - containerRect.left + rect1.width / 2;
  const y1 = rect1.top - containerRect.top + rect1.height / 2;
  const x2 = rect2.left - containerRect.left + rect2.width / 2;
  const y2 = rect2.top - containerRect.top + rect2.height / 2;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();

  const aId = img1.id;
  const bId = img2.id;
  const aCity = resolveCityNameById(aId);
  const bCity = resolveCityNameById(bId);

  const entry = {
    [counter]: {
      location: { x1, y1, x2, y2 },
      name: [aId + bId],
      ids: [aId, bId],
      cities: [aCity, bCity]
    }
  };
  setStore(mergeObjects(store, entry));
  setCounter(counter + 1);

  logAction('draw_line', { a: aId, b: bId, aCity, bCity, x1, y1, x2, y2, detour_active });
}

function dragLine(img1) {
  const { store, setStore, counter } = getLineStore();
  for (let i = 0; i <= counter; i++) {
    if (store[i]) {
      const strings = store[i].name;
      const substring = img1.id;
      if (strings[0].includes(substring)) {
        const canvas = document.getElementById(`${strings[0]}`);
        const remainingPart = strings[0].replace(substring, '');
        const img2 = document.getElementById(`${remainingPart}`);
        const containerdl = document.getElementById('div3');
        containerdl.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        canvas.width = containerdl.offsetWidth;
        canvas.height = containerdl.offsetHeight;

        const rect1 = img1.getBoundingClientRect();
        const rect2 = img2.getBoundingClientRect();
        const containerRect = containerdl.getBoundingClientRect();

        const x1 = rect1.left - containerRect.left + rect1.width / 2;
        const y1 = rect1.top - containerRect.top + rect1.height / 2;
        const x2 = rect2.left - containerRect.left + rect2.width / 2;
        const y2 = rect2.top - containerRect.top + rect2.height / 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        // update only the location (no extra logs to avoid spam)
        const patch = Object.assign({}, store);
        if (!patch[i]) patch[i] = {};
        patch[i] = Object.assign({}, patch[i], { location: { x1, y1, x2, y2 } });
        setStore(patch);
      }
    }
  }
}

function leftAndRightAreConnected() {
  const { store } = getLineStore();
  const graph = buildGraphFromStore(store);
  const start = "imgL";
  const target = "imgR";
  const visited = new Set();
  const stack = [start];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === target) return true;
    if (!visited.has(current)) {
      visited.add(current);
      for (const neighbor of (graph[current] || [])) stack.push(neighbor);
    }
  }
  return false;
}

// ---------------------------------------------
// Drag/drop and selection logic
// (Only logs drag_start / drag_end for nodes. No continuous spam.)
// ---------------------------------------------
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var startX = 0, startY = 0;
  var initialX = 0, initialY = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (elmnt.parentElement.id !== "div1") return;
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX; pos4 = e.clientY;
    initialX = elmnt.offsetLeft; initialY = elmnt.offsetTop;
    startX = initialX; startY = initialY;
    logAction('drag_start', { id: elmnt.id, x: startX, y: startY, detour_active });
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function isOverlappingWithOthers(newLeft, newTop) {
    const elmntRect = { left: newLeft, top: newTop, right: newLeft + elmnt.offsetWidth, bottom: newTop + elmnt.offsetHeight };
    const others = Array.from(document.getElementById("div1").children)
      .filter(el => el.tagName === 'IMG' && el !== elmnt);
    for (let other of others) {
      const otherRect = { left: other.offsetLeft, top: other.offsetTop, right: other.offsetLeft + other.offsetWidth, bottom: other.offsetTop + other.offsetHeight };
      if (!(elmntRect.right < otherRect.left || elmntRect.left > otherRect.right ||
            elmntRect.bottom < otherRect.top || elmntRect.top > otherRect.bottom)) {
        return true;
      }
    }
    return false;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    var newTop = elmnt.offsetTop - pos2;
    var newLeft = elmnt.offsetLeft - pos1;

    const container = document.getElementById("div1");
    const rect = container.getBoundingClientRect();

    if (newTop < 0) newTop = 0;
    if (newLeft < 0) newLeft = 0;
    if (newTop + elmnt.offsetHeight > rect.height) newTop = rect.height - elmnt.offsetHeight;
    if (newLeft + elmnt.offsetWidth > rect.width) newLeft = rect.width - elmnt.offsetWidth;

    if (!isOverlappingWithOthers(newLeft, newTop)) {
      elmnt.style.top = newTop + "px";
      elmnt.style.left = newLeft + "px";
      dragLine(elmnt);
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    const endX = elmnt.offsetLeft;
    const endY = elmnt.offsetTop;
    const moved = (endX !== startX || endY !== startY) && elmnt.parentElement && elmnt.parentElement.id === "div1";
    logAction('drag_end', { id: elmnt.id, x: endX, y: endY, moved, detour_active });

    if (elmnt.offsetLeft === initialX && elmnt.offsetTop === initialY) {
      if (attention == 1 && selected == elmnt) {
        selected.style.border = null;
        logAction('deselect_node', { id: elmnt.id, detour_active });
        selected = 1;
        attention = 0;
      } else if (attention == 1 && selected != elmnt) {
        const { store, setStore, counter, setCounter } = getLineStore();
        var optionone = elmnt.id + selected.id;
        var optiontwo = selected.id + elmnt.id;
        var checkline = 0;
        for (let i = 0; i <= counter; i++) {
          if (store[i]) {
            if (store[i].name == optionone) {
              clearCanvas(optionone);
              checkline = 1;
              logAction('remove_line', { a: elmnt.id, b: selected.id, detour_active });
              removeObjectByKey(store, i);
              setStore(store);
            } else if (store[i].name == optiontwo) {
              clearCanvas(optiontwo);
              checkline = 1;
              logAction('remove_line', { a: selected.id, b: elmnt.id, detour_active });
              removeObjectByKey(store, i);
              setStore(store);
            }
          }
        }
        if (checkline == 0) {
          drawLine(selected, elmnt);
        }
        selected.style.border = null;
        selected = 1;
        attention = 0;
      } else {
        if (selected != 1) {
          selected.style.border = null;
          elmnt.style.border = null;
          attention = 0;
          selected = 1;
        } else {
          elmnt.style.border = "4px solid black";
          attention = 1;
          selected = elmnt;
          logAction('select_node', { id: elmnt.id, detour_active });
        }
      }
    }
  }
}

// side images can connect but not drag
function sideElement(elmnt) {
  var initialX = 0, initialY = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (elmnt.parentElement.id !== "div1"){ return; }
    e = e || window.event;
    e.preventDefault();
    initialX = elmnt.offsetLeft;
    initialY = elmnt.offsetTop;
    document.onmouseup = closeDragElement;
  }

  function closeDragElement() {
    document.onmouseup = null;
    if (elmnt.offsetLeft === initialX && elmnt.offsetTop === initialY) {
      if (attention==1 && selected==elmnt){
        selected.style.border = "2px solid blue";
        logAction('deselect_node', { id: elmnt.id, detour_active });
        selected = 1;
        attention = 0;
      } else if (attention==1 && selected!=elmnt){
        const { store, setStore, counter, setCounter } = getLineStore();
        var optionone = elmnt.id + selected.id;
        var optiontwo = selected.id + elmnt.id;
        var checkline = 0;
        for (let i=0; i<=counter; i++){
          if (store[i]){
            if (store[i].name==optionone){
              clearCanvas(optionone);
              checkline=1;
              logAction('remove_line', { a: elmnt.id, b: selected.id, detour_active });
              removeObjectByKey(store,i);
              setStore(store);
            } else if (store[i].name==optiontwo){
              clearCanvas(optiontwo);
              checkline=1;
              logAction('remove_line', { a: selected.id, b: elmnt.id, detour_active });
              removeObjectByKey(store,i);
              setStore(store);
            }
          }
        }
        if (checkline==0){ drawLine(selected, elmnt); }
        elmnt.style.border = null;
        selected.style.border = null;
        selected = 1;
        attention = 0;
      } else {
        if (selected!=1){
          elmnt.style.border = "2px solid blue";
          attention = 0;
          selected = 1;
        } else if (selected==1){
          elmnt.style.border = "4px solid black";
          attention = 1;
          selected = elmnt;
          logAction('select_node', { id: elmnt.id, detour_active });
        }
      }
    }
  }
}

function allowDrop(ev) { ev.preventDefault(); }

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var element = document.getElementById(data);
  var container = document.getElementById("div1");

  var containerRect = container.getBoundingClientRect();
  var dropX = ev.clientX - containerRect.left - (element.offsetWidth / 2);
  var dropY = ev.clientY - containerRect.top - (element.offsetHeight / 2);

  if (dropX < 0) dropX = 0;
  if (dropY < 0) dropY = 0;
  if (dropX + element.offsetWidth > containerRect.width) dropX = containerRect.width - element.offsetWidth;
  if (dropY + element.offsetHeight > containerRect.height) dropY = containerRect.height - element.offsetHeight;

  const newRect = { left: dropX, top: dropY, right: dropX + element.offsetWidth, bottom: dropY + element.offsetHeight };

  const otherImages = Array.from(container.children)
    .filter(el => el.tagName === 'IMG' && el !== element);

  const isOverlapping = otherImages.some(img => {
    const r = { left: img.offsetLeft, top: img.offsetTop, right: img.offsetLeft + img.offsetWidth, bottom: img.offsetTop + img.offsetHeight };
    return !(newRect.right < r.left || newRect.left > r.right || newRect.bottom < r.top || newRect.top > r.bottom);
  });

  if (isOverlapping) {
    logAction('invalid_overlap_drop', { id: element.id, x: dropX, y: dropY, detour_active });
    showWarning("Do not drop a city on top of another city.");
    return;
  }

  container.appendChild(element);
  element.style.position = "absolute";
  element.style.left = dropX + "px";
  element.style.top = dropY + "px";
  logAction('drop_on_canvas', { id: element.id, x: dropX, y: dropY, detour_active });
}

function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }

function returndrag(elmnt) {
  var initialX = 0, initialY = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (elmnt.parentElement.id !== "div1") { return; }
    e = e || window.event;
    e.preventDefault();
    initialX = elmnt.offsetLeft; initialY = elmnt.offsetTop;
    document.onmouseup = closeDragElement;
  }
  function returnclear(img1){
    const { store, setStore, counter } = getLineStore();
    var substring = img1.id;
    for (let i=0; i<=counter; i++){
      if (store[i]){
        var strings = store[i].name;
        if (strings[0].includes(substring)) {
          clearCanvas(strings[0]);
          logAction('remove_line', { edge: strings[0], detour_active });
          removeObjectByKey(store,i);
          setStore(store);
        }
      }
    }
  }
  function closeDragElement() {
    document.onmouseup = null;
    if (selected.id !== 'imgL' && selected.id !== 'imgR'){
      if (elmnt.offsetLeft === initialX && elmnt.offsetTop === initialY) {
        if (selected!=1 && attention==1){
          returnclear(selected);
          var originalContainer = document.getElementById("div2");
          originalContainer.appendChild(selected);
          selected.style.position = "relative";
          selected.style.top = "0px";
          selected.style.left = "0px";
          selected.style.border = null;
          logAction('return_to_gallery', { id: selected.id, detour_active });
          selected = 1;
          attention = 0;
        }
      }
    }
  }
}
function removeObjectByKey(obj, key) {
  if (obj.hasOwnProperty(key)) { delete obj[key]; }
}

// ---------------------------------------------
// Memory-choice helpers (unchanged but used to set detour type)
// ---------------------------------------------
function chooseMiddleImageForMemory() {
  const trueEdges = graph.getEdges().map(pair => {
    const a = pair[0] < 10 ? `drag0${pair[0]}` : `drag${pair[0]}`;
    const b = pair[1] < 10 ? `drag0${pair[1]}` : `drag${pair[1]}`;
    return new Set([a, b]);
  });
  const isTrueConnection = (a, b) => {
    return trueEdges.some(edge => edge.has(a) && edge.has(b));
  };

  const { store } = getLineStore(); // current (pre-detour) store
  const validConnections = [];
  const allDrawnNodes = new Set();

  for (let key in store) {
    const entry = store[key];
    if (!entry || !entry.name || !entry.name[0]) continue;

    const match = entry.name[0].match(/(drag\d{2}|imgL|imgR)/g);
    if (!match || match.length !== 2) continue;

    const [a, b] = match;
    if (!a || !b) continue;

    if (a !== "imgL" && a !== "imgR") allDrawnNodes.add(a);
    if (b !== "imgL" && b !== "imgR") allDrawnNodes.add(b);

    if (a === "imgL" || a === "imgR" || b === "imgL" || b === "imgR") continue;

    const connection = [a, b];
    if (isTrueConnection(a, b)) {
      validConnections.push(connection);
    }
  }

  let selectedImageID = null;
  let sourceType = null;

  if (validConnections.length > 0) {
    const selectedPair = validConnections[Math.floor(Math.random() * validConnections.length)];
    selectedImageID = selectedPair[Math.floor(Math.random() * 2)];
    sourceType = "correct_connection";
  } else if (allDrawnNodes.size > 0) {
    const fallbackArray = Array.from(allDrawnNodes);
    selectedImageID = fallbackArray[Math.floor(Math.random() * fallbackArray.length)];
    sourceType = "random_fallback_node";
  }

  window.selected_middle_image = selectedImageID;
  window.selected_middle_image_index = null;
  window.selected_middle_image_type = sourceType;

  if (selectedImageID) {
    const match = selectedImageID.match(/drag(\d{2})/);
    if (match) {
      window.selected_middle_image_index = parseInt(match[1], 10);
    }
  }

  console.log("Selected image from connection:", window.selected_middle_image);
  console.log("Selected image index:", window.selected_middle_image_index);
  console.log("Connection type:", window.selected_middle_image_type);

  if (!window.selected_middle_image) {
    console.warn("No image could be selected. (This should never happen if user drew anything)");
  }
}

// generic DFS (kept for completeness)
function findPath(graph, start, end) {
  const visited = new Set();
  const path = [];
  function dfs(node) {
    if (node === end) return true;
    visited.add(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        path.push(neighbor);
        if (dfs(neighbor)) return true;
        path.pop();
      }
    }
    return false;
  }
  path.push(start);
  const found = dfs(start);
  return found ? path : null;
}
