//<div id='displayhelp' style='display:none'>
var phasethreeroom=[`<div id='displayhelp' style='display:none'><p>Click and drag the images from the top that you wish to place in the gray container when creating your full path. Then, click on each of the two images to connect them.`
+`<br />Click on each of the two images to connect them.<br> To remove a connection, simply click on the two images again and the line will disappear. To remove an image that you have already placed, click on the image and then the return button in the bottom right. <br> once you are finished, press the 'submit' button to book the next client</p></div><button id='batman' style='display: block;margin: 0 auto;padding: 10px 20px;background-color: #4CAF50;color: black;border: none;border-radius: 8px;font-size: 16px;cursor: pointer;box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);transition: background-color 0.3s ease;', onclick='initiatep3()'>Click to start</button><div id='spiderman' style='display: none;'><div id='Phase3Body'><br><div id='div2'  style='width: 700px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa;'><img id='drag01' src='../static/images/${imageList[0]}' alt='Aliance'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag02' src='../static/images/${imageList[1]}' alt='Boulder'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag03' src='../static/images/${imageList[2]}' alt='Cornwall'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag04' src='../static/images/${imageList[3]}' alt='Custer'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag05' src='../static/images/${imageList[4]}' alt='DelawareCity'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag06' src='../static/images/${imageList[5]}' alt='Medora'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag07' src='../static/images/${imageList[6]}' alt='Newport'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag08' src='../static/images/${imageList[7]}' alt='ParkCity'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag09' src='../static/images/${imageList[8]}' alt='Racine'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag10' src='../static/images/${imageList[9]}' alt='Sitka'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag11' src='../static/images/${imageList[10]}' alt='WestPalmBeach'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag12' src='../static/images/${imageList[11]}' alt='Yukon'width='100' height='120' draggable='true' ondragstart='drag(event)'>`
+`<img id='drag13' src='../static/images/${imageList[12]}' alt='Yukon'width='100' height='120' draggable='true' ondragstart='drag(event)'></div><div id='div1' style='width: 1200px; height: 400px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa; background-color: lightgray;'ondrop='drop(event)' ondragover='allowDrop(event)'><div id='div3' style='width: 1200px; height: 400px; margin: 0 auto; position: relative; '></div><img id='imgL' style='position:relative;right:450px;bottom: 250px;border:2px solid blue' width='100' height='120'><img id='imgR' style='position:relative;left:450px;bottom: 250px;border:2px solid blue' width='100' height='120'><img id='return' src='../static/images/return.png' style='position: relative;left: 450px;bottom: 100px ;border: 2px solid black' width='50'height='50'> <button id='nextButton' style='display: none; padding: 10px 20px; background-color: #4CAF50; color: black; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;'>Submit</button></div></div></div>`]

const imageName = imageList.map(name => name.replace('GW/', '').replace('.jpg', ''));

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
var specificline_detour = {};  // new connections after airport is closed
var specificlinenew_detour = {};
var linecounter_detour = 0;
var specificline_saved={}
var detourcity_name=[]

//function to display the help instruction
function displayhelp() {
    $('#bighelp').hide()
    $('#displayhelp').show()
}

function showWarning(messageText) {
    const message = document.createElement('div');
    message.innerText = messageText;
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.backgroundColor = '#f44336';  // red
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '8px';
    message.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    message.style.fontSize = '18px';
    message.style.zIndex = '1000';
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 5000);
}



//function to init all the necessary varibale
function gdp_init(){
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


function getUniquePathBetween(start, end) {
    const graph = {};

    for (let key in specificline) {
        if (specificline[key] && specificline[key].name && specificline[key].name[0]) {
            const match = specificline[key].name[0].match(/(imgL|imgR|drag\d{2})/g);
            if (!match || match.length !== 2) continue;
            const [a, b] = match;
            if (!graph[a]) graph[a] = [];
            if (!graph[b]) graph[b] = [];
            graph[a].push(b);
            graph[b].push(a);
        }
    }

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


function continueButton() {
    const droppedImages = Array.from(document.getElementById('div1').children)
    .filter(el => el.tagName === 'IMG' && el.id.startsWith('drag'));

    // Step 1: Get the one valid path from imgL to imgR
    const route = getUniquePathBetween("imgL", "imgR");

    // Step 2: If no path, or some images are not in it — show warning
    if (!route || route.length === 0) {
        showWarning("No valid route found between the left and right cities.");
        return;
    }

    // Step 3: Check if all dropped images are part of the path
    const anyOutOfRoute = droppedImages.some(img => !route.includes(img.id));

    if (anyOutOfRoute) {
        showWarning("There is an unconnected image on the route. Either return it or connect it.");
        document.getElementById('nextButton').style.display = 'none';
        return;
    }

    const message = document.createElement('div');
    message.innerText = "You can now continue";
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '8px';
    message.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    message.style.fontSize = '18px';
    message.style.zIndex = '1000';
    document.body.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 1000);

    // Hide the top instruction
    const instructionDiv = document.getElementById('displayhelp');
    if (instructionDiv) instructionDiv.style.display = 'none';

    // Move the Submit button up to that position
    const submitBtn = document.getElementById('nextButton');
    submitBtn.style.display = 'block';
    submitBtn.style.margin = '20px auto';
    submitBtn.style.position = 'static'; // remove any relative offsets
    submitBtn.style.display = 'block';

    // Insert Submit button into the position of #displayhelp
    const bottomArea = document.getElementById('div1');
    if (bottomArea && bottomArea.contains(submitBtn)) {
    bottomArea.removeChild(submitBtn);
    }

    instructionDiv?.parentNode?.insertBefore(submitBtn, instructionDiv);

    submitBtn.onclick = () => {
        // Re-check all conditions before allowing finish
        const droppedImages = Array.from(document.getElementById('div1').children)
            .filter(el => el.tagName === 'IMG' && el.id.startsWith('drag'));
    
        const connectedIds = new Set();
        for (let key in specificline) {
            if (specificline[key] && specificline[key].name && specificline[key].name[0]) {
                const match = specificline[key].name[0].match(/(imgL|imgR|drag\d{2})/g);
                if (match) {
                    match.forEach(id => connectedIds.add(id));
                }
            }
        }
    
        const anyUnconnected = droppedImages.some(img => !connectedIds.has(img.id));
        if (anyUnconnected) {
            showWarning("At least one dragged image is not connected. Please fix before submitting.");
            return;
        }
    
        if (!leftAndRightAreConnected()) {
            showWarning("There must be a complete path between the left and right cities.");
            return;
        }
        if (goal_detor_deter === true) {
            chooseMiddleImageForMemory();
            // Hide the Submit button
            submitBtn.style.display = 'none';
            clearAllCanvases();
        
            const div1 = document.getElementById('div1');
            const div2 = document.getElementById('div2');
        
            const draggedCities = Array.from(div1.children)
                .filter(el => el.tagName === 'IMG' && el.id.startsWith('drag'));
        
            draggedCities.forEach(img => {
                img.style.position = 'relative';
                img.style.left = '0px';
                img.style.top = '0px';
                img.style.border = '';
                div2.appendChild(img);
            });
        
            // Step 1: Save original
            specificline_saved = specificline
            linecounter_saved = linecounter;
        
            // Step 2: Reset everything for detour
            specificline = {};
            specificlinenew = {};
            linecounter = 0;
        
            // Step 3: Hide task UI
            document.getElementById('div1').style.display = 'none';
            document.getElementById('div2').style.display = 'none';
            document.getElementById('displayhelp').style.display = 'none';
        
            // Step 4: Show detour instruction div
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
            const closedCityName = imageName[selected_middle_image_index-1]; // or rightName
            detourcity_name=closedCityName
            const warningText = document.createElement('p');
            
            warningText.innerText = `${closedCityName} is not available at the moment. Can you create an alternate path?`;
        
            const placeholderImg = document.createElement('img');
            placeholderImg.src = images[selected_middle_image_index-1].src  //this is the hidden image, changes will only make to this one src
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
                // Step 5: Hide detour message
                detourDiv.remove();
        
                // Step 6: Re-show task UI
                document.getElementById('div1').style.display = 'block';
                document.getElementById('div2').style.display = 'block';
                document.getElementById('displayhelp').style.display = 'block';
        
                // Step 7: Hide the closed city image
                const closedCityIndex = selected_middle_image_index //this is the index of the chosen hidden city
                const closedImgId = closedCityIndex < 10 ? `drag0${closedCityIndex}` : `drag${closedCityIndex}`;
                const closedImg = document.getElementById(closedImgId);
                if (closedImg) {
                    closedImg.style.display = 'none';
                }
        
                // Step 8: Allow next submission
                goal_detor_deter = false;
            };
        
            detourDiv.appendChild(warningText);
            detourDiv.appendChild(placeholderImg);
            detourDiv.appendChild(document.createElement('br'));
            detourDiv.appendChild(continueBtn);
        
            // Place above the task
            const phase3Body = document.getElementById('Phase3Body');
            phase3Body.parentNode.insertBefore(detourDiv, phase3Body);
        
            return;
        }
        // Passed all checks
        jsPsych.finishTrial();
    };
}


function makeVisible() {
    document.getElementById("spiderman").style.display = "block";
}

goalIndex = 0
let rightName = ''
let leftName = ''

let goal_detor_deter
function initiatep3(){
    if(detourLocationMap[goalIndex]){
        goal_detor_deter=true
        makeVisible()
        $('#displayhelp').show()
        for (let i = 1; i <= 13; i++) {
            if (i<10){
                images[i-1] = document.getElementById(`drag0${i}`);
            }else{
                images[i-1] = document.getElementById(`drag${i}`)
            }
        }
        // LeftSRC = images[Math.floor(Math.random()* images.length)].src
        // RightSRC = images[Math.floor(Math.random()* images.length)].src
        // while(LeftSRC == RightSRC){ // Making sure the random L and R images are not the same
        //     var RightSRC = images[Math.floor(Math.random()* images.length)].src
        // }
        container = document.getElementById('div1');
        document.getElementById('imgL').src = images[room_goaldir_left[goalIndex]-1].src
        rightName = imageName[room_goaldir_right[goalIndex]-1]
        document.getElementById('imgR').src = images[room_goaldir_right[goalIndex]-1].src
        leftName = imageName[room_goaldir_left[goalIndex]-1]
        for (let i = 1; i <= 13; i++) {
            if (images[i-1].src == images[room_goaldir_left[goalIndex]-1].src || images[i-1].src == images[room_goaldir_right[goalIndex]-1].src){
                images[i-1].style="display: none;" // Make them disappear in the top box
            }
        }   
        document.getElementById("batman").style.display = "none"
        //do not need to copy things below there
        for (let i = 1; i <= 13; i++) {
            if (i<10){
                dragElement(document.getElementById(`drag0${i}`));
            }else{
                dragElement(document.getElementById(`drag${i}`));
            }
            }
        returndrag(document.getElementById('return'))
        sideElement(document.getElementById('imgL'))
        sideElement(document.getElementById('imgR'))
        goalIndex++
    }else{
        goal_detor_deter=false
        makeVisible()
        $('#displayhelp').show()
        for (let i = 1; i <= 13; i++) {
            if (i<10){
                images[i-1] = document.getElementById(`drag0${i}`);
            }else{
                images[i-1] = document.getElementById(`drag${i}`)
            }
        }
        // LeftSRC = images[Math.floor(Math.random()* images.length)].src
        // RightSRC = images[Math.floor(Math.random()* images.length)].src
        // while(LeftSRC == RightSRC){ // Making sure the random L and R images are not the same
        //     var RightSRC = images[Math.floor(Math.random()* images.length)].src
        // }
        container = document.getElementById('div1');
        document.getElementById('imgL').src = images[room_goaldir_left[goalIndex]-1].src
        rightName = imageName[room_goaldir_right[goalIndex]-1]
        document.getElementById('imgR').src = images[room_goaldir_right[goalIndex]-1].src
        leftName = imageName[room_goaldir_left[goalIndex]-1]
        for (let i = 1; i <= 13; i++) {
            if (images[i-1].src == images[room_goaldir_left[goalIndex]-1].src || images[i-1].src == images[room_goaldir_right[goalIndex]-1].src){
                images[i-1].style="display: none;" // Make them disappear in the top box
            }
        }   
        document.getElementById("batman").style.display = "none"
        //do not need to copy things below there
        for (let i = 1; i <= 13; i++) {
            if (i<10){
                dragElement(document.getElementById(`drag0${i}`));
            }else{
                dragElement(document.getElementById(`drag${i}`));
            }
            }
        returndrag(document.getElementById('return'))
        sideElement(document.getElementById('imgL'))
        sideElement(document.getElementById('imgR'))
        goalIndex++
    }
} 
//PART THAT NEED TO BE RUN UNDER BUTTON END

function drawLine(img1,img2) {
    // Prevent direct connection between imgL and imgR
    if ((img1.id === 'imgL' && img2.id === 'imgR') || (img1.id === 'imgR' && img2.id === 'imgL')) {
        showWarning("There is no direct flight between these cities. Pick at least one in-between city to start with.");
        return;
    }

    // Count connections
    const connectionCounts = {};
    for (let key in specificline) {
        const line = specificline[key];
        if (line && line.name && line.name[0]) {
            const match = line.name[0].match(/(imgL|imgR|drag\d{2})/g);
            if (!match) continue;
            match.forEach(id => {
                connectionCounts[id] = (connectionCounts[id] || 0) + 1;
            });
        }
    }

    // Enforce max 1 connection for imgL/imgR, 2 for draggable images
    const idsToCheck = [img1.id, img2.id];
    for (let id of idsToCheck) {
        const maxAllowed = (id === 'imgL' || id === 'imgR') ? 1 : 2;
        if ((connectionCounts[id] || 0) >= maxAllowed) {
            showWarning(`This is a invalid move. You can not connect extra city to a route`);
            return;
        }
}

    
    // Prevent direct connection between imgL and imgR
    if ((img1.id === 'imgL' && img2.id === 'imgR') || (img1.id === 'imgR' && img2.id === 'imgL')) {
        const message = document.createElement('div');
        message.innerText = "There is no direct flight between these cities. Pick at least one in-between city to start with.";
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.backgroundColor = '#f44336';  // red
        message.style.color = 'white';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '8px';
        message.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        message.style.fontSize = '18px';
        message.style.zIndex = '1000';
        document.body.appendChild(message);

        setTimeout(() => {
        message.remove();
        }, 2000);
        return;
    }
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
    specificline=mergeObjects(specificline,specificlinenew)
    linecounter=linecounter+1
    if(leftAndRightAreConnected()){
        continueButton()
    }
}



function dragLine(img1) {
    if(leftAndRightAreConnected()){
        continueButton()
    }
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

function mergeObjects(target, source) {
    return { ...target, ...source };
}
function clearCanvas(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (canvas) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.remove(); // This will remove the canvas element from the DOM
    }
}

function clearAllCanvases() {
    const container = document.getElementById('div3');
    const canvases = container.querySelectorAll('canvas');
    canvases.forEach(c => clearCanvas(c.id));
}

// draw the line end


function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (elmnt.parentElement.id !== "div1") return;

        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        initialX = elmnt.offsetLeft;
        initialY = elmnt.offsetTop;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function isOverlappingWithOthers(newLeft, newTop) {
        const elmntRect = {
            left: newLeft,
            top: newTop,
            right: newLeft + elmnt.offsetWidth,
            bottom: newTop + elmnt.offsetHeight,
        };

        const others = Array.from(document.getElementById("div1").children)
            .filter(el => el.tagName === 'IMG' && el !== elmnt);

        for (let other of others) {
            const rect = other.getBoundingClientRect();
            const containerRect = document.getElementById("div1").getBoundingClientRect();
            const otherRect = {
                left: other.offsetLeft,
                top: other.offsetTop,
                right: other.offsetLeft + other.offsetWidth,
                bottom: other.offsetTop + other.offsetHeight,
            };

            if (!(elmntRect.right < otherRect.left ||
                  elmntRect.left > otherRect.right ||
                  elmntRect.bottom < otherRect.top ||
                  elmntRect.top > otherRect.bottom)) {
                return true; // overlapping
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

        // Get container bounds
        const container = document.getElementById("div1");
        const rect = container.getBoundingClientRect();

        // Stay within bounds
        if (newTop < 0) newTop = 0;
        if (newLeft < 0) newLeft = 0;
        if (newTop + elmnt.offsetHeight > rect.height) newTop = rect.height - elmnt.offsetHeight;
        if (newLeft + elmnt.offsetWidth > rect.width) newLeft = rect.width - elmnt.offsetWidth;

        // Only move if not overlapping
        if (!isOverlappingWithOthers(newLeft, newTop)) {
            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
            dragLine(elmnt);
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;

        if (elmnt.offsetLeft === initialX && elmnt.offsetTop === initialY) {
            if (attention == 1 && selected == elmnt) {
                selected.style.border = null;
                selected = 1;
                attention = 0;
            } else if (attention == 1 && selected != elmnt) {
                var optionone = elmnt.id + selected.id;
                var optiontwo = selected.id + elmnt.id;
                var checkline = 0;
                for (let i = 0; i <= linecounter; i++) {
                    if (specificline[i]) {
                        if (specificline[i].name == optionone) {
                            clearCanvas(optionone);
                            checkline = 1;
                            removeObjectByKey(specificline, i);
                        } else if (specificline[i].name == optiontwo) {
                            clearCanvas(optiontwo);
                            checkline = 1;
                            removeObjectByKey(specificline, i);
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
                }
            }
        }
    }
}


// Make the side images be able to have lines but not drag
function sideElement(elmnt) { 
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
                        clearCanvas(optionone)
                        checkline=1
                        removeObjectByKey(specificline,i)
                        }else if(specificline[i].name==optiontwo){
                        clearCanvas(optiontwo)
                        checkline=1
                        removeObjectByKey(specificline,i)
                        }
                    }
                }
                if (checkline==0){
                    drawLine(selected,elmnt)
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


function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var element = document.getElementById(data);
    var container = document.getElementById("div1");

    // Calculate intended drop position
    var containerRect = container.getBoundingClientRect();
    var dropX = ev.clientX - containerRect.left - (element.offsetWidth / 2);
    var dropY = ev.clientY - containerRect.top - (element.offsetHeight / 2);

    // Clamp position within container
    if (dropX < 0) dropX = 0;
    if (dropY < 0) dropY = 0;
    if (dropX + element.offsetWidth > containerRect.width) dropX = containerRect.width - element.offsetWidth;
    if (dropY + element.offsetHeight > containerRect.height) dropY = containerRect.height - element.offsetHeight;

    // Create a mock rectangle for the new position
    const newRect = {
        left: dropX,
        top: dropY,
        right: dropX + element.offsetWidth,
        bottom: dropY + element.offsetHeight
    };

    // Check for overlaps with existing images
    const otherImages = Array.from(container.children)
        .filter(el => el.tagName === 'IMG' && el !== element);

    const isOverlapping = otherImages.some(img => {
        const r = {
            left: img.offsetLeft,
            top: img.offsetTop,
            right: img.offsetLeft + img.offsetWidth,
            bottom: img.offsetTop + img.offsetHeight
        };

        return !(newRect.right < r.left || newRect.left > r.right ||
                 newRect.bottom < r.top || newRect.top > r.bottom);
    });

    if (isOverlapping) {
        showWarning("Do not drop a city on top of another city.");
        return;
    }

    // Append and position the element if no overlap
    container.appendChild(element);
    element.style.position = "absolute";
    element.style.left = dropX + "px";
    element.style.top = dropY + "px";
}


function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


function returndrag(elmnt){
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
                    clearCanvas(strings)
                    removeObjectByKey(specificline,i)
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
    if(leftAndRightAreConnected()){
        continueButton()
    }
}
function removeObjectByKey(obj, key) {
    if (obj.hasOwnProperty(key)) {
        delete obj[key];
    }
}


function leftAndRightAreConnected() {
    const graph = {};

    // Step 1: Build the graph
    for (let key in specificline) {
        if (specificline[key] && specificline[key].name && specificline[key].name[0]) {
            const nameStr = specificline[key].name[0];

            // Match patterns like "imgL", "imgR", "drag01" through "drag13"
            const matches = nameStr.match(/(imgL|imgR|drag\d{2})/g);
            if (!matches || matches.length !== 2) continue;

            const [a, b] = matches;

            if (!graph[a]) graph[a] = [];
            if (!graph[b]) graph[b] = [];
            graph[a].push(b);
            graph[b].push(a);
        }
    }

    // Step 2: Search for connection from imgL to imgR
    const start = "imgL";
    const target = "imgR";
    const visited = new Set();
    const stack = [start];

    while (stack.length > 0) {
        const current = stack.pop();
        if (current === target) return true;

        if (!visited.has(current)) {
            visited.add(current);
            for (const neighbor of graph[current] || []) {
                stack.push(neighbor);
            }
        }
    }

    return false;
}

function chooseMiddleImageForMemory() {
    const trueEdges = graph.getEdges().map(pair => {
        const a = pair[0] < 10 ? `drag0${pair[0]}` : `drag${pair[0]}`;
        const b = pair[1] < 10 ? `drag0${pair[1]}` : `drag${pair[1]}`;
        return new Set([a, b]);
    });

    const isTrueConnection = (a, b) => {
        return trueEdges.some(edge => edge.has(a) && edge.has(b));
    };

    const validConnections = [];
    const allDrawnNodes = new Set();

    for (let key in specificline) {
        const entry = specificline[key];
        if (!entry || !entry.name || !entry.name[0]) continue;

        const match = entry.name[0].match(/(drag\d{2}|imgL|imgR)/g);
        if (!match || match.length !== 2) continue;

        const [a, b] = match;
        if (!a || !b) continue;

        // Only store nodes that are not imgL/imgR
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

    // Store results globally
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





// === Helper: Build adjacency list from specificline object ===
function buildGraphFromSpecificLine(sline) {
    const graph = {};

    for (let key in sline) {
        if (sline[key] && sline[key].name && sline[key].name[0]) {
            const match = sline[key].name[0].match(/(imgL|imgR|drag\d{2})/g);
            if (!match || match.length !== 2) continue;
            const [a, b] = match;

            if (!graph[a]) graph[a] = [];
            if (!graph[b]) graph[b] = [];

            graph[a].push(b);
            graph[b].push(a);
        }
    }

    return graph;
}


// === Helper: Find path using DFS from start to end ===
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
