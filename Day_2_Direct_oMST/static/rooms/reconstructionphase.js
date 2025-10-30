/* recon_PhaseThree.js
   - Reconstruction phase UI and logic
   - Stores lines in the same schema as Phase 3:
     store[idx] = {
       location: { x1, y1, x2, y2 },
       name:     [aId + bId],
       ids:      [aId, bId],
       cities:   [aCity, bCity]
     }
*/

// ==========================
// HTML (reconstruction phase)
// ==========================
var recon_phasethreeroom = [
  "<div id='displayhelp' style='display:none'><p>Click and drag the objects to the gray box"
  +"<br /> You can connect the images by clicking the two images in order <br> You can remove an object by clicking on it and then clicking the return arrow on the bottom right of the gray box <br> once all the objects are in the grey box and have <b>at least one line connecting them</b>, press the 'submit' button that will appear</p><button id='nextButton' style='display:block;margin: 0 auto;padding: 10px 20px;background-color: #4CAF50;color: black;border: none;border-radius: 8px;font-size: 16px;cursor: pointer;box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);transition: background-color 0.3s ease;'>Submit</button>"
  +`</div><button id='batman' style='display: block;margin: 0 auto;padding: 10px 20px;background-color: #4CAF50;color: black;border: none;border-radius: 8px;font-size: 16px;cursor: pointer;box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);transition: background-color 0.3s ease;' onclick='recon_initiatep3()'>Click to start</button><div id='spiderman' style='display: none;'><div id='Phase3Body'><br><div id='div2'  style='width: 700px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa;'><img id='drag01' src='../static/images/${imageList[0]}' alt='Aliance' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag02' src='../static/images/${imageList[1]}' alt='Boulder' width='100' height='100' draggable='true' ondragstart='drag(event)'>
  <img id='drag03' src='../static/images/${imageList[2]}' alt='Cornwall' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag04' src='../static/images/${imageList[3]}' alt='Custer' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag05' src='../static/images/${imageList[4]}' alt='DelawareCity' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag06' src='../static/images/${imageList[5]}' alt='Medora' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag07' src='../static/images/${imageList[6]}' alt='Newport' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag08' src='../static/images/${imageList[7]}' alt='ParkCity' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag09' src='../static/images/${imageList[8]}' alt='Racine' width='100' height='100' draggable='true' ondragstart='drag(event)'>
  <img id='drag10' src='../static/images/${imageList[9]}' alt='Sitka' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag11' src='../static/images/${imageList[10]}' alt='WestPalmBeach' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag12' src='../static/images/${imageList[11]}' alt='Yukon' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag13' src='../static/images/${imageList[12]}' alt='img13' width='100' height='100' draggable='true' ondragstart='drag(event)'></div>`
  +"<div id='div1' style='width: 1200px; height: 700px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa; background-color: lightgray;' ondrop='recon_drop(event)' ondragover='recon_allowDrop(event)'><div id='div3' style='width: 1200px; height: 700px; margin: 0 auto; position: relative; '></div><img id='return' src='../static/images/return.png' style='position: relative;left: 450px;bottom: 100px ;border: 2px solid black' width='50'height='50'></div></div></div>"
];

// =====================================
// Helpers: city names and id resolution
// =====================================

// Image base names (strip .png)
const recon_imageName = imageList.map(name => String(name).replace(/\.png$/i, ''));

// Map element id -> readable city name (drag01..drag13 only in recon)
function recon_resolveCityNameById(elId) {
  const m = elId.match(/^drag(\d{2})$/);
  if (!m) return null;
  const idx = parseInt(m[1], 10);
  if (isNaN(idx) || idx < 1 || idx > recon_imageName.length) return null;
  return recon_imageName[idx - 1];
}

// =========
// Logging
// =========
let p3ReconStartMs = null;
let action_recon = [];
window.action_recon = action_recon;

function logRecon(type, details) {
  try {
    const now = Date.now();
    const t = (p3ReconStartMs == null) ? 0 : (now - p3ReconStartMs);
    action_recon.push(Object.assign({ t, t_abs: now, type }, details || {}));
  } catch (e) {}
}

// =====================================
// Global state for the recon phase only
// =====================================
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

// =========
// UI bits
// =========
function displayhelp() {
  $('#bighelp').hide();
  $('#displayhelp').show();
}

// =====
// Init
// =====
function recon_init(){
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
  p3ReconStartMs = null;
  action_recon = [];
  window.action_recon = action_recon;
  logRecon('recon_init');
}

// ==============================
// Continue / Submit button wiring
// ==============================
function recon_continueButton() {
  const btn = document.getElementById('nextButton');
  btn.style.display = 'block';

  // prevent duplicate listeners
  btn.replaceWith(btn.cloneNode(true));
  const fresh = document.getElementById('nextButton');

  fresh.addEventListener('click', function() {
    const ok = recon_checkAllConnected();
    logRecon('submit_click', { allConnected: ok });
    if (ok) {
      logRecon('submit_success');
      jsPsych.finishTrial();
    } else {
      // message
      let messageEl = document.createElement('div');
      messageEl.id = 'proceed-message';
      messageEl.style.position = 'fixed';
      messageEl.style.top = '20px';
      messageEl.style.left = '50%';
      messageEl.style.transform = 'translateX(-50%)';
      messageEl.style.backgroundColor = '#d4edda';
      messageEl.style.color = '#155724';
      messageEl.style.border = '1px solid #c3e6cb';
      messageEl.style.padding = '10px 20px';
      messageEl.style.fontSize = '18px';
      messageEl.style.fontWeight = 'bold';
      messageEl.style.borderRadius = '8px';
      messageEl.style.zIndex = '9999';
      messageEl.textContent = 'There are unconnected objects';
      document.body.appendChild(messageEl);
      setTimeout(() => messageEl.remove(), 2000);
    }
  });
}

function recon_makeVisible() {
  document.getElementById("spiderman").style.display = "block";
}

var goalIndex = 0;

// Expose a plain drag-start handler used by <img ondragstart="drag(event)">
function drag(ev){ ev.dataTransfer.setData("text", ev.target.id); }

// Main entry point (button onclick)
function recon_initiatep3(){
  if (p3ReconStartMs == null) {
    p3ReconStartMs = Date.now();
    logRecon('recon_start');
  }

  recon_makeVisible();
  recon_continueButton();
  $('#displayhelp').show();

  for (let i = 1; i <= 13; i++) {
    images[i-1] = document.getElementById(i<10 ? `drag0${i}` : `drag${i}`);
  }

  container = document.getElementById('div1');
  document.getElementById("batman").style.display = "none";

  for (let i = 1; i <= 13; i++) {
    recon_dragElement(document.getElementById(i<10 ? `drag0${i}` : `drag${i}`));
  }
  recon_returndrag(document.getElementById('return'));

  goalIndex++;
}

// ===========================
// Connectivity sanity check
// ===========================
function recon_checkAllConnected() {
  let adjacency = {};
  for (let i = 1; i <= 13; i++) {
    const id = i < 10 ? `drag0${i}` : `drag${i}`;
    adjacency[id] = [];
  }
  for (let i = 0; i <= linecounter; i++) {
    if (specificline[i]) {
      let imgIDs = specificline[i].name[0];      // e.g., "drag03drag07"
      let first = imgIDs.slice(0, imgIDs.length / 2);
      let second = imgIDs.slice(imgIDs.length / 2);
      if (adjacency[first]) adjacency[first].push(second);
      if (adjacency[second]) adjacency[second].push(first);
    }
  }
  let allConnected = Object.values(adjacency).every(neighbors => neighbors.length > 0);
  return allConnected;
}

// ==============
// Line routines
// ==============
function recon_drawLine(img1, img2) {
  // create canvas
  const canvas = document.createElement('canvas');
  canvas.id = `${img1.id}${img2.id}`;
  const containerdl = document.getElementById('div3');
  containerdl.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = containerdl.offsetWidth;
  canvas.height = containerdl.offsetHeight;

  // geometry
  const rect1 = img1.getBoundingClientRect();
  const rect2 = img2.getBoundingClientRect();
  const containerRect = containerdl.getBoundingClientRect();
  const x1 = rect1.left - containerRect.left + rect1.width / 2;
  const y1 = rect1.top  - containerRect.top  + rect1.height / 2;
  const x2 = rect2.left - containerRect.left + rect2.width / 2;
  const y2 = rect2.top  - containerRect.top  + rect2.height / 2;

  // draw
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Phase-3-style entry (ids + cities included)
  const aId = img1.id;
  const bId = img2.id;
  const aCity = recon_resolveCityNameById(aId);
  const bCity = recon_resolveCityNameById(bId);

  const entry = {
    [linecounter]: {
      location: { x1, y1, x2, y2 },
      name:     [aId + bId],
      ids:      [aId, bId],
      cities:   [aCity, bCity]
    }
  };
  specificline = recon_mergeObjects(specificline, entry);

  logRecon('draw_line', { a: aId, b: bId, aCity, bCity, x1, y1, x2, y2 });
  linecounter += 1;
}

function recon_dragLine(img1) {
  for (let i = 0; i <= linecounter; i++) {
    if (!specificline[i] || !specificline[i].name) continue;

    const edgeStr = specificline[i].name[0];           // e.g., "drag03drag07"
    if (!edgeStr.includes(img1.id)) continue;

    // find the other endpoint id
    const otherId = edgeStr.replace(img1.id, '');
    const otherEl = document.getElementById(otherId);
    if (!otherEl) continue;

    // redraw on the same canvas
    const canvas = document.getElementById(edgeStr);
    if (!canvas) continue;

    const containerdl = document.getElementById('div3');
    containerdl.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = containerdl.offsetWidth;
    canvas.height = containerdl.offsetHeight;

    const rect1 = img1.getBoundingClientRect();
    const rect2 = otherEl.getBoundingClientRect();
    const containerRect = containerdl.getBoundingClientRect();

    const x1 = rect1.left - containerRect.left + rect1.width / 2;
    const y1 = rect1.top  - containerRect.top  + rect1.height / 2;
    const x2 = rect2.left - containerRect.left + rect2.width / 2;
    const y2 = rect2.top  - containerRect.top  + rect2.height / 2;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // persist the new geometry in the same structure
    specificline[i] = Object.assign({}, specificline[i], {
      location: { x1, y1, x2, y2 }
    });
    // (No log here to avoid spam.)
  }
}

function recon_mergeObjects(target, source) { return { ...target, ...source }; }

function recon_clearCanvas(canvasId) {
  var c = document.getElementById(canvasId);
  if (c) {
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    c.remove();
  }
}

// ===================================
// Dragging images within div1 (canvas)
// ===================================
function recon_dragElement(elmnt) {
  var pos1=0, pos2=0, pos3=0, pos4=0;
  var initialX=0, initialY=0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (elmnt.parentElement.id !== "div1") return;
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX; pos4 = e.clientY;
    initialX = elmnt.offsetLeft; initialY = elmnt.offsetTop;
    logRecon('drag_start', { id: elmnt.id, x: initialX, y: initialY });
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX; pos4 = e.clientY;

    var newTop = elmnt.offsetTop - pos2;
    var newLeft = elmnt.offsetLeft - pos1;

    var container = document.getElementById("div1");
    var rect = container.getBoundingClientRect();

    if (newTop < 0) newTop = 0;
    if (newLeft < 0) newLeft = 0;
    if (newTop + elmnt.offsetHeight > rect.height) newTop = rect.height - elmnt.offsetHeight;
    if (newLeft + elmnt.offsetWidth > rect.width) newLeft = rect.width - elmnt.offsetWidth;

    elmnt.style.top  = newTop  + "px";
    elmnt.style.left = newLeft + "px";
    recon_dragLine(elmnt);
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    const moved = (elmnt.offsetLeft !== initialX || elmnt.offsetTop !== initialY);
    if (moved && elmnt.parentElement && elmnt.parentElement.id === "div1") {
      logRecon('drag_end', { id: elmnt.id, x: elmnt.offsetLeft, y: elmnt.offsetTop });
    }

    if (elmnt.offsetLeft === initialX && elmnt.offsetTop === initialY) {
      if (attention==1 && selected==elmnt){
        selected.style.border = null; selected=1; attention=0;
      } else if (attention==1 && selected!=elmnt){
        var optionone=elmnt.id+selected.id;
        var optiontwo=selected.id+elmnt.id;
        var checkline=0;
        for (let i=0;i<=linecounter;i++){
          if (specificline[i]){
            if (specificline[i].name==optionone){
              recon_clearCanvas(optionone);
              checkline=1;
              recon_removeObjectByKey(specificline,i);
              logRecon('remove_line', { a: elmnt.id, b: selected.id });
            } else if (specificline[i].name==optiontwo){
              recon_clearCanvas(optiontwo);
              checkline=1;
              recon_removeObjectByKey(specificline,i);
              logRecon('remove_line', { a: selected.id, b: elmnt.id });
            }
          }
        }
        if (checkline==0){ recon_drawLine(selected,elmnt); }
        selected.style.border = null; selected=1; attention=0;
      } else {
        if(selected!=1){
          selected.style.border = null;
          elmnt.style.border = null;
          attention=0; selected=1;
        } else {
          elmnt.style.border = "4px solid black";
          attention=1; selected=elmnt;
        }
      }
    }
  }
}

// ===============================
// Optional: sideElement prototype
// ===============================
function recon_sideElement(elmnt) { 
  var initialX = 0, initialY = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (elmnt.parentElement.id !== "div1") return;
    e = e || window.event;
    e.preventDefault();
    initialX = elmnt.offsetLeft; initialY = elmnt.offsetTop;
    document.onmouseup = closeDragElement;
  }

  function closeDragElement() {
    document.onmouseup = null;
    if (elmnt.offsetLeft === initialX && elmnt.offsetTop === initialY) {
      if (attention==1 && selected==elmnt){
        selected.style.border = "2px solid blue"; selected=1; attention=0;
      } else if (attention==1 && selected!=elmnt){
        var optionone=elmnt.id+selected.id;
        var optiontwo=selected.id+elmnt.id;
        var checkline=0;
        for (let i=0;i<=linecounter;i++){
          if (specificline[i]){
            if (specificline[i].name==optionone){
              recon_clearCanvas(optionone);
              checkline=1;
              recon_removeObjectByKey(specificline,i);
              logRecon('remove_line', { a: elmnt.id, b: selected.id });
            } else if (specificline[i].name==optiontwo){
              recon_clearCanvas(optiontwo);
              checkline=1;
              recon_removeObjectByKey(specificline,i);
              logRecon('remove_line', { a: selected.id, b: elmnt.id });
            }
          }
        }
        if (checkline==0){ recon_drawLine(selected,elmnt); }
        elmnt.style.border = null;
        selected.style.border = null;
        selected=1; attention=0;
      } else {
        if(selected!=1){
          elmnt.style.border = "2px solid blue"; attention=0; selected=1;
        } else {
          elmnt.style.border = "4px solid black"; attention=1; selected=elmnt;
        }
      }
    }
  }
}

// ============================
// DnD for adding/removing imgs
// ============================
function recon_allowDrop(ev) { ev.preventDefault(); }

function recon_drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var element = document.getElementById(data);
  var container = document.getElementById("div1");

  container.appendChild(element);

  var containerRect = container.getBoundingClientRect();
  var dropX = ev.clientX - containerRect.left - (element.offsetWidth / 2);
  var dropY = ev.clientY - containerRect.top  - (element.offsetHeight / 2);

  if (dropX < 0) dropX = 0;
  if (dropY < 0) dropY = 0;
  if (dropX + element.offsetWidth > containerRect.width)  dropX = containerRect.width  - element.offsetWidth;
  if (dropY + element.offsetHeight > containerRect.height) dropY = containerRect.height - element.offsetHeight;

  element.style.position = "absolute";
  element.style.left = dropX + "px";
  element.style.top  = dropY + "px";

  logRecon('drop_on_canvas', { id: element.id, x: dropX, y: dropY });
}

function recon_returndrag(elmnt){
  var initialX=0, initialY=0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    if (elmnt.parentElement.id !== "div1") return;
    e = e || window.event;
    e.preventDefault();
    initialX = elmnt.offsetLeft; initialY = elmnt.offsetTop;
    document.onmouseup = closeDragElement;
  }
  function returnclear(img1){
    var substring = img1.id;
    for (let i=0;i<=linecounter;i++){
      if (specificline[i]){
        var strings = specificline[i].name;
        if (strings[0].includes(substring)) {
          recon_clearCanvas(strings[0]);
          recon_removeObjectByKey(specificline,i);
          logRecon('remove_line', { edge: strings[0] });
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
          logRecon('return_to_gallery', { id: selected.id });
          selected=1; attention=0;
        }
      }
    }
  }
}

function recon_removeObjectByKey(obj, key) {
  if (obj.hasOwnProperty(key)) { delete obj[key]; }
}

// Expose the entry function
window.recon_initiatep3 = recon_initiatep3;
