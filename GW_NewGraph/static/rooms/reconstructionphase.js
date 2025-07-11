var recon_phasethreeroom=["<div id='displayhelp' style='display:none'><p>Click and drag the objects to the gray box"
    +"<br /> You can connect the images by clicking the two images in order <br> You can remove an object by clicking on it and then clicking the return arrow on the bottom right of the gray box <br> once all the objects are in the grey box and have <b>at least one line connecting them</b>, press the 'submit' button that will appear</p><button id='nextButton' style='display:none;margin: 0 auto;padding: 10px 20px;background-color: #4CAF50;color: black;border: none;border-radius: 8px;font-size: 16px;cursor: pointer;box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);transition: background-color 0.3s ease;'>Submit</button>"
    +`</div><button id='batman' style='display: block;margin: 0 auto;padding: 10px 20px;background-color: #4CAF50;color: black;border: none;border-radius: 8px;font-size: 16px;cursor: pointer;box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);transition: background-color 0.3s ease;', onclick='recon_initiatep3()'>Click to start</button><div id='spiderman' style='display: none;'><div id='Phase3Body'><br><div id='div2'  style='width: 700px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa;'><img id='drag01' src='../static/images/${imageList[0]}' alt='Aliance' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag02' src='../static/images/${imageList[1]}' alt='Boulder' width='100' height='100' draggable='true' ondragstart='drag(event)'>
    <img id='drag03' src='../static/images/${imageList[2]}' alt='Cornwall' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag04' src='../static/images/${imageList[3]}' alt='Custer' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag05' src='../static/images/${imageList[4]}' alt='DelawareCity' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag06' src='../static/images/${imageList[5]}' alt='Medora' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag07' src='../static/images/${imageList[6]}' alt='Newport' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag08' src='../static/images/${imageList[7]}' alt='ParkCity' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag09' src='../static/images/${imageList[8]}' alt='Racine' width='100' height='100' draggable='true' ondragstart='drag(event)'>
    <img id='drag10' src='../static/images/${imageList[9]}' alt='Sitka' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag11' src='../static/images/${imageList[10]}' alt='WestPalmBeach' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag12' src='../static/images/${imageList[11]}' alt='Yukon' width='100' height='100' draggable='true' ondragstart='drag(event)'><img id='drag13' src='../static/images/${imageList[12]}' alt='img13' width='100' height='100' draggable='true' ondragstart='drag(event)'></div>`
                        +"<div id='div1' style='width: 1200px; height: 700px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa; background-color: lightgray;'ondrop='recon_drop(event)' ondragover='recon_allowDrop(event) '><div id='div3' style='width: 1200px; height: 700px; margin: 0 auto; position: relative; '></div><img id='return' src='../static/images/return.png' style='position: relative;left: 450px;bottom: 100px ;border: 2px solid black' width='50'height='50'></div></div></div>"]
//jspsych-html-button-response-button-0
//PART THAT NEED TO BE RUN UNDER BUTTON
var images = []
var attention=0
var selected=1
var LeftSRC = []
var RightSRC = []
// Select the parent element where the canvas will be added
var container = []
var specificline={}; 
var specificlinenew={};// Variable to hold the specific line
var canvas=[]
var linecounter=0


//function to display the help instruction
function displayhelp() {
    $('#bighelp').hide()
    $('#displayhelp').show()
}


//function to initita all the necessary varibale
function recon_init(){
        //PART THAT NEED TO BE RUN UNDER BUTTON
    images = []
    attention=0
    selected=1
    LeftSRC = []
    RightSRC = []
    // Select the parent element where the canvas will be added
    container = []
    specificline={}; 
    specificlinenew={};// Variable to hold the specific line
    canvas=[]
    linecounter=0
}

function recon_continueButton() {
    document.getElementById('nextButton').style.display = 'block'
    document.getElementById('nextButton').addEventListener('click', function() {
        jsPsych.finishTrial(); // End trial on button click
    }, { once: true });
    }

function recon_makeVisible() {
    document.getElementById("spiderman").style.display = "block";
}

goalIndex = 0

function recon_initiatep3(){
    recon_makeVisible()
    document.getElementById('nextButton').style.display = 'none';
    $('#displayhelp').show()

    // Load only 12 images
    for (let i = 1; i <= 13; i++) {
        if (i<10){
            images[i-1] = document.getElementById(`drag0${i}`);
        }else{
            images[i-1] = document.getElementById(`drag${i}`);
        }
    }

    container = document.getElementById('div1');
    
    // No hiding, no side elements anymore

    document.getElementById("batman").style.display = "none";

    // Enable dragging for all
    for (let i = 1; i <= 13; i++) {
        if (i<10){
            recon_dragElement(document.getElementById(`drag0${i}`));
        }else{
            recon_dragElement(document.getElementById(`drag${i}`));
        }
    }
    
    recon_returndrag(document.getElementById('return'))

    goalIndex++;
}

//PART THAT NEED TO BE RUN UNDER BUTTON END


let messageShown = false;

function recon_checkAllConnected() {
    let adjacency = {};
    for (let i = 1; i <= 13; i++) {
        const id = i < 10 ? `drag0${i}` : `drag${i}`;
        adjacency[id] = [];
    }

    for (let i = 0; i <= linecounter; i++) {
        if (specificline[i]) {
            let imgIDs = specificline[i].name[0];
            let first = imgIDs.slice(0, imgIDs.length / 2);
            let second = imgIDs.slice(imgIDs.length / 2);
            adjacency[first].push(second);
            adjacency[second].push(first);
        }
    }

    let allConnected = Object.values(adjacency).every(neighbors => neighbors.length > 0);

    if (allConnected) {
        recon_continueButton();

        if (!messageShown) {
            messageShown = true; // prevent future displays

            // Create and show message
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
            messageEl.textContent = '✅ You can now proceed';
            document.body.appendChild(messageEl);

            // Auto-hide after 2 seconds
            setTimeout(() => {
                messageEl.remove();
            }, 2000);
        }
    } else {
        document.getElementById('nextButton').style.display = 'none';
    }
}



function recon_drawLine(img1,img2) {
    // Create a new canvas element
    canvas = document.createElement('canvas');
    img1new = 0
    img2new = 0
    // Set the ID attribute for the canvas
    for(let i = 0;i<images.length;i++){
            imgID = images[i]
            if(img2.src == imgID.src){
                img2new = imgID.id
            }
            if(img1.src == imgID.src){
                img1new = imgID.id
            }
        }
    
    canvas.id = `${img1.id}`+`${img2.id}`; // change at some point to show div
    // Append the canvas to the parent container
    var containerdl = document.getElementById('div3');
    containerdl.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    // Set canvas size to match the container
    canvas.width = containerdl.offsetWidth;
    canvas.height = containerdl.offsetHeight;
    canvasname=canvas.id
    // Get image positions and dimensions
    var rect1 = img1.getBoundingClientRect();
    var rect2 = img2.getBoundingClientRect();
    var containerRect = containerdl.getBoundingClientRect();

    // Adjust positions relative to the container
    var x1 = rect1.left - containerRect.left + rect1.width / 2;
    var y1 = rect1.top - containerRect.top + rect1.height / 2;
    var x2 = rect2.left - containerRect.left + rect2.width / 2;
    var y2 = rect2.top - containerRect.top + rect2.height / 2;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'black';  // Set the line color
    ctx.lineWidth = 2;  // Set the line width
    ctx.stroke();
    // Save the line information]
    specificlinenew=Object.assign({[linecounter]:{location: { x1: x1, y1: y1, x2: x2, y2: y2 },name:[img1.id+img2.id]}})  // change at some point to show div
    specificline=recon_mergeObjects(specificline,specificlinenew)
    linecounter=linecounter+1
    recon_checkAllConnected();
}

function recon_dragLine(img1) {
    // Create a new canvas element
    for (i=0;i<=linecounter;i++){
        if (specificline[i]){
            var strings = specificline[i].name
            var substring =img1.id
            if (strings[0].includes(substring)) {
                var canvas = document.getElementById(`${strings[0]}`);
                var remainingPart = strings[0].replace(substring, '') //this is finding the img2
                var img2=document.getElementById(`${remainingPart}`)
                // Append the canvas to the parent container
                var containerdl = document.getElementById('div3');
                containerdl.appendChild(canvas);
                var ctx = canvas.getContext('2d');
                // Set canvas size to match the container
                canvas.width = containerdl.offsetWidth;
                canvas.height = containerdl.offsetHeight;
                canvasname=canvas.id
                // Get image positions and dimensions
                var rect1 = img1.getBoundingClientRect();
                var rect2 = img2.getBoundingClientRect();
                var containerRect = containerdl.getBoundingClientRect();

                // Adjust positions relative to the container
                var x1 = rect1.left - containerRect.left + rect1.width / 2;
                var y1 = rect1.top - containerRect.top + rect1.height / 2;
                var x2 = rect2.left - containerRect.left + rect2.width / 2;
                var y2 = rect2.top - containerRect.top + rect2.height / 2;

                // Draw line
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = 'black';  // Set the line color
                ctx.lineWidth = 2;  // Set the line width
                ctx.stroke();
                // Save the line information]
                specificlinenew=Object.assign({[i]:{location: { x1: x1, y1: y1, x2: x2, y2: y2 }}})
            }
        }
    }
}

function recon_mergeObjects(target, source) {
    return { ...target, ...source };
}
function recon_clearCanvas(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (canvas) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.remove(); // This will remove the canvas element from the DOM
    }
    recon_checkAllConnected();
}

// draw the line end


// Make the IMG element draggable only if it's inside div1
function recon_dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (elmnt.parentElement.id !== "div1"){
            return;
        }
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        initialX = elmnt.offsetLeft;
        initialY = elmnt.offsetTop;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Calculate new position
        var newTop = elmnt.offsetTop - pos2;
        var newLeft = elmnt.offsetLeft - pos1;

        // Get boundaries of the container
        var container = document.getElementById("div1");
        var rect = container.getBoundingClientRect();

        // Ensure the element stays within the container
        if (newTop < 0) newTop = 0;
        if (newLeft < 0) newLeft = 0;
        if (newTop + elmnt.offsetHeight > rect.height) newTop = rect.height - elmnt.offsetHeight;
        if (newLeft + elmnt.offsetWidth > rect.width) newLeft = rect.width - elmnt.offsetWidth;

        // Set the element's new position
        elmnt.style.top = newTop + "px";
        elmnt.style.left = newLeft + "px";
        recon_dragLine(elmnt)
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        // Check if the position has changed
        if (elmnt.offsetLeft === initialX && elmnt.offsetTop === initialY) {
            if (attention==1&&selected==elmnt){
                selected.style.border = null
                selected=1
                attention=0
            }else if(attention==1 &&selected!=elmnt){
                var optionone=elmnt.id+selected.id
                var optiontwo=selected.id+elmnt.id
                var checkline=0
                for (i=0;i<=linecounter;i++){
                    if (specificline[i]){
                        if (specificline[i].name==optionone){
                        recon_clearCanvas(optionone)
                        checkline=1
                        recon_removeObjectByKey(specificline,i)
                        }else if(specificline[i].name==optiontwo){
                        recon_clearCanvas(optiontwo)
                        checkline=1
                        recon_removeObjectByKey(specificline,i)
                        }
                    }
                }
                if (checkline==0){
                    recon_drawLine(selected,elmnt)
                }
                selected.style.border = null
                selected=1
                attention=0
            }else{
                if(selected!=1){
                    selected.style.border = null; // Add black stroke
                    elmnt.style.border = null;
                    attention=0
                    selected= 1
                }else if(selected==1){
                    elmnt.style.border = "4px solid black"; // Add black stroke
                    attention=1
                    selected= elmnt
                }
            }
        }
    }
}

// Make the side images be able to have lines but not drag
function recon_sideElement(elmnt) { 
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (elmnt.parentElement.id !== "div1"){
            return;
        }
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        initialX = elmnt.offsetLeft;
        initialY = elmnt.offsetTop;
        document.onmouseup = closeDragElement;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        // Check if the position has changed
        if (elmnt.offsetLeft === initialX && elmnt.offsetTop === initialY) {
            if (attention==1&&selected==elmnt){
                selected.style.border = "2px solid blue";
                selected=1
                attention=0
            }else if(attention==1 &&selected!=elmnt){
                var optionone=elmnt.id+selected.id
                var optiontwo=selected.id+elmnt.id
                var checkline=0
                for (i=0;i<=linecounter;i++){
                    if (specificline[i]){
                        if (specificline[i].name==optionone){
                        recon_clearCanvas(optionone)
                        checkline=1
                        recon_removeObjectByKey(specificline,i)
                        }else if(specificline[i].name==optiontwo){
                        recon_clearCanvas(optiontwo)
                        checkline=1
                        recon_removeObjectByKey(specificline,i)
                        }
                    }
                }
                if (checkline==0){
                    recon_drawLine(selected,elmnt)
                }
                elmnt.style.border = null
                selected.style.border = null
                selected=1
                attention=0
            }else{
                if(selected!=1){
                    elmnt.style.border = "2px solid blue";
                    attention=0
                    selected= 1
                }else if(selected==1){
                    elmnt.style.border = "4px solid black"; // Add black stroke
                    attention=1
                    selected= elmnt
                }
            }
        }
    }
}


function recon_allowDrop(ev) {
    ev.preventDefault();
}

function recon_drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var element = document.getElementById(data);
    var container = document.getElementById("div1");

    // Append the element to the drop area
    container.appendChild(element);

    // Calculate the drop position
    var containerRect = container.getBoundingClientRect();
    var dropX = ev.clientX - containerRect.left - (element.offsetWidth / 2);
    var dropY = ev.clientY - containerRect.top - (element.offsetHeight / 2);

    // Ensure the element stays within the container
    if (dropX < 0) dropX = 0;
    if (dropY < 0) dropY = 0;
    if (dropX + element.offsetWidth > containerRect.width) dropX = containerRect.width - element.offsetWidth;
    if (dropY + element.offsetHeight > containerRect.height) dropY = containerRect.height - element.offsetHeight;

    // Set the element's position to where the mouse dropped it
    element.style.position = "absolute";
    element.style.left = dropX + "px";
    element.style.top = dropY + "px";
}


function recon_returndrag(elmnt){
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (elmnt.parentElement.id !== "div1") {
            return;
        }
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        initialX = elmnt.offsetLeft;
        initialY = elmnt.offsetTop;
        document.onmouseup = closeDragElement;
    }
    function returnclear(img1){
        var substring =img1.id
        for (i=0;i<=linecounter;i++){
            if (specificline[i]){
                var strings = specificline[i].name
                if (strings[0].includes(substring)) {
                    recon_clearCanvas(strings)
                    recon_removeObjectByKey(specificline,i)
                }
            }
        }
    }
    function closeDragElement() {
        document.onmouseup = null;
        // Check if the position has changed
        if (selected.id !== 'imgL' && selected.id !== 'imgR'){ // Make sure it is not the side images
            if (elmnt.offsetLeft === initialX && elmnt.offsetTop === initialY) {
                if (selected!=1 &&attention==1){
                    returnclear(selected)
                    // If the position hasn't changed, move the element back to div2
                    var originalContainer = document.getElementById("div2");
                    originalContainer.appendChild(selected);
                    selected.style.position = "relative";
                    selected.style.top = "0px";
                    selected.style.left = "0px";
                    selected.style.border = null
                    selected=1
                    attention=0
                }
            }
        }
    }
}
function recon_removeObjectByKey(obj, key) {
    if (obj.hasOwnProperty(key)) {
        delete obj[key];
    }
}

