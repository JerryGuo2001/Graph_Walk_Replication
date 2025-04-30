//debug moode on/off
debugmode= true
if (debugmode==true){
  n_learning_trial=1 //This determine the number of learning trial you want in total
  n_direct_trial=1 //how many direct trial you want
  n_shortest_trial=2 //how many shortest path you want
  n_goaldir_trial=1 //how many goal directed planning you want
}else{
  n_learning_trial=128 //This determine the number of learning trial you want in total
  n_direct_trial=32 //how many direct trial you want
  n_shortest_trial=60 //how many shortest path you want
  n_goaldir_trial=1 //how many goal directed planning you want
}

//warningpage
warning=0 //this is to start the counter of total warning
warning_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5;color:red'>Warning, you are missing too many trials, make sure to press the key '1' when you see a blue cross flash and '2' when you see a green one. If you keep missing trials you will be disqualified.</p>",
checkfail=0 //this is to start the attentioncheck
checkthreshold=2 //this is to add the threshold for attentioncheck

//Text for instruction
instruct_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>In this experiment, you will observe pairs of objects. Your task is to memorize these pairs. Note that the pairs will repeat, and that the position of the object (left or right) in the pair does not matter. Objects are NOT paired in a meaningful way (for example based on what they are used for).<p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>A good strategy to remember the pairs is to try and come up with a story or image that connects the two objects. For example, if you saw the following pair of objects: \n </p><img src= '../static/images/GW-Tutorial/object_334.jpg' width='250' height='250' style='margin-right:50px'></img><img src= '../static/images/GW-Tutorial/object_268.jpg' width='250' height='250' style='margin-left:50px'><p style ='font-size: 30px;line-height:1.5'>you may imagine holding the briefcase while wearing the red robe, or you can come up with a story in which you have to pack the robe in the briefcase for a business trip.<br></p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_3="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>Let's practice this strategy, which you will use throughout the experiment. For each pair, try to come up with an image or story in your head that connects the two objects. You will have 1 second for each pair,so please work quickly. The story or image does not have to make sense.<br><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_4="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'><img src= '../static/images/GW-Tutorial/object_068.jpg' width='250' height='250' style='margin-right:50px'></img><img src= '../static/images/GW-Tutorial/object_029.jpg' width='250' height='250' style='margin-left:50px'><br><br><p style ='font-size: 30px;line-height:1.5'>Were you able to come up with a story or image connecting these items?<br><br>Once you think of one, press the spacebar to continue.</p>",
instruct_5="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>Great! Please continue to come up with a story or image for each trial.<br><br>For example, you might imagine kicking the fire hydrant while wearing the boot.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_6="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'><img src= '../static/images/GW-Tutorial/object_229.jpg' width='250' height='250' style='margin-right:50px'></img><img src= '../static/images/GW-Tutorial/object_250.jpg' width='250' height='250' style='margin-left:50px'><br><br><p style ='font-size: 30px;line-height:1.5'>Were you able to come up with a story or image connecting these items?<br><br>Once you think of one, press the spacebar to continue.</p>",
instruct_7="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>Great! Please continue to come up with a story or image for each trial.<br><br>For example, you might imagine trying to break open the piggy bank with the traffic cone.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_8="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>To make sure that you are paying attention on each trial, you will see a cross on the center of your screen like the one below:</p><img src= '../static/images/isi.png' width='250' height='250'><p style ='font-size: 30px;line-height:1.5'>If the cross flashes <span style='color: blue;'>blue,</span> press the '1' key on your keyboard, if it flashes <span style='color: green;'>green,</span> press '2'.<p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_9="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>Please make sure to respond to every trial, as too many missed trials will disqualify you from participating. Remember, the goal is to (1) memorize the flight paths, and  (2) try to respond as quickly and as accurately as possible when you see the cross change color.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",

instructnames = ["instruct_1","instruct_2","instruct_3","instruct_4","instruct_5","instruct_6","instruct_7","instruct_8","instruct_9"]// IF you want to add or decrease number of page for instruct, just delete or add var name here.
instruct={instruct_1,instruct_2,instruct_3,instruct_4,instruct_5,instruct_6,instruct_7,instruct_8,instruct_9} // IF you want to add or decrease number of page for instruct, just delete or add var here.


//Text for direct memory instruction
instruct_dir_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>Great! We will move on to the main task now, remember to memorize the city-pairings to the best of your ability.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
// instruct_dir_1 is for post test learning phase
instruct_dir_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>For the next part of this experiment, you will see an object that you studied earlier, with 3 objects below it. Use the '1', '2', and '3' buttons on your keyboard to select the object that was directly paired with the top object during the study phase. Use '1' to select the left object, '2' to select the middle object, and '3' to select the right object.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
dir_instructnames = ["instruct_dir_2"] //Same for above, if you want to delete or add, just decrease or add the var
dir_instruct={instruct_dir_2} //same for above

//Text for shortest path instruction
instruct_short_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>You may have noticed that the object pairs you studied in the study phase were connected to one another such that one object was often paired with more than just one other object.\nIn this phase, you will be presented with three objects on the screen.\nYour task is to choose which one of the side objects, left or right, you think is closer to the middle object based on how the objects were indirectly associated during the study phase.</p><br /><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_short_2="<div style='margin-left:250px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>For example, if you studied the following pairs:</p><img src= '../static/images/shortest_img_1.png' width='350' height='250'><p style ='font-size: 30px;line-height:1.5'>and you are shown the following:</p><img src= '../static/images/shortest_img_2.png' width='350' height='250'><br><p style ='font-size: 30px;line-height:1.5'>You should select the umbrella as being 'closer' to the robe, as the umbrella was 2 'steps' away from the robe (robe > briefcase > umbrella), whereas the clock was 3 'steps' away from the robe (robe > briefcase > umbrella > clock).</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>"
instruct_short_3="<div style='margin-left:250px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>Press '1' on your keyboard if you think the center object is closer to the LEFT object, based on what you learned in the previous phase. Press '2' on your keyboard if you think the object that is closer to the center object is the RIGHT object.<br><br>It might seem difficult and overwhelming, but trust your instincts, and do your best! Please contact the experimenter if you have any questions on this section before continuing.</p><br><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>"
short_instructnames = ["instruct_short_1","instruct_short_2","instruct_short_3"]
short_instruct={instruct_short_1,instruct_short_2,instruct_short_3} 

//Text for phase 3 instruction
instruct_mem_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>In this part of the task, you will be shown all the images that you have studied earlier. There will NOT be any novel images that you have not already seen.<br>We will ask you to arrange the images on the screen in a way you think is best reflective of the pair arrangement you saw in the learning part (remember that the same object can appear in multiple pairs). You can move the images on the screen by clicking on them with your mouse, one at the time, and dragging them to whatever you think is a suitable position within the white rectangular area. Make sure you don't place any images on top of each other (no overlap). </p><br><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_mem_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>After placing the images on the screen, <strong>you will connect the images based on whether or not they were directly paired together during the learning phase.</strong> You can link the images together by first clicking on one image, followed by the image you want to connect it to. You don't need to drag/draw the line, just click on the two images you'd like to connect - and the line will appear. Note that if you want to make a new connection using the same object you had connected previously, you must click on that object again in order to draw a new line to another object. If you would like to remove a connection, use the same process&mdash;click one image followed by the image it is linked to, and the existing line will be removed.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_mem_3="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>When you are satisfied with the position of all the images and their connections, click the 'Submit' button to finish the task!</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
mem_instructnames = ["instruct_mem_1","instruct_mem_2","instruct_mem_3"]
mem_instruct={instruct_mem_1,instruct_mem_2,instruct_mem_3} 

//learning phse

imageList=['GW/backpack.jpg','GW/boat.jpg','GW/cake.jpg','GW/couch.jpg','GW/fan.jpg','GW/globe.jpg','GW/mailbox.jpg','GW/oven.jpg','GW/pawn.jpg','GW/picnic_basket.jpg','GW/rocking_chair.jpg','GW/skates.jpg','GW/sunglasses.jpg']

imageIndex= [[0,1], [1,3], [4,3], [11,3], [1,2], [2,3], [2,10], [11,10], [2,5], [5,6], [5,8], [10,8], [6,7], [8,7], [8,9], [7,9]]

list_left=[imageList[imageIndex[0][0]],imageList[imageIndex[1][0]],imageList[imageIndex[2][0]],imageList[imageIndex[3][0]],imageList[imageIndex[4][0]],imageList[imageIndex[5][0]],imageList[imageIndex[6][0]],imageList[imageIndex[7][0]],imageList[imageIndex[8][0]],imageList[imageIndex[9][0]],imageList[imageIndex[10][0]],imageList[imageIndex[11][0]],imageList[imageIndex[12][0]],imageList[imageIndex[13][0]],imageList[imageIndex[14][0]],imageList[imageIndex[15][0]]]
list_right=[imageList[imageIndex[0][1]],imageList[imageIndex[1][1]],imageList[imageIndex[2][1]],imageList[imageIndex[3][1]],imageList[imageIndex[4][1]],imageList[imageIndex[5][1]],imageList[imageIndex[6][1]],imageList[imageIndex[7][1]],imageList[imageIndex[8][1]],imageList[imageIndex[9][1]],imageList[imageIndex[10][1]],imageList[imageIndex[11][1]],imageList[imageIndex[12][1]],imageList[imageIndex[13][1]],imageList[imageIndex[14][1]],imageList[imageIndex[15][1]]]
learn_left=[]
learn_right=[]

let arr = [];
for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 8; j++) {
    arr.push(i);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let randomizedArray = shuffle(arr);

randomizedArray = ensureNoConsecutiveDuplicates(randomizedArray)

for (var i = 0; i < randomizedArray.length; i++){
    learn_left.push(list_left[randomizedArray[i]])
    learn_right.push(list_right[randomizedArray[i]])
}

var correctNode = []
var correctDirectNodes = 0
var shortDirectNodes = 0
var farDirectNodes = 0

// Graph object
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    if (!this.adjacencyList[vertex1]) this.addVertex(vertex1);
    if (!this.adjacencyList[vertex2]) this.addVertex(vertex2);

    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1); // For undirected graph
  }

  displayGraph() {
    console.log(this.adjacencyList);
  }

    // Function to find nodes that are directly connected to the center node (1 edge apart)
  getDirectNeighbors(centerNode) {
    return this.adjacencyList[centerNode] || [];
  }

  getSingleDirectNeighbor() {
    const nodeIndexMap = new Map();
    return (centerNode) => {
        const neighbors = this.adjacencyList[centerNode] || [];
        if (neighbors.length === 0) return null;
        if (!nodeIndexMap.has(centerNode)) {
            nodeIndexMap.set(centerNode, 0);
        }
        let index = nodeIndexMap.get(centerNode);
        const neighbor = neighbors[index];
        nodeIndexMap.set(centerNode, (index + 1) % neighbors.length);
        return neighbor;
    };
}

  initTriplet() {
      this.correctNodefunc = this.getSingleDirectNeighbor();
  }

  cycleThroughNeighbors(node) {
      const nextNeighbor = this.correctNodefunc(node);
      return nextNeighbor
  } 


  // Function to find all nodes that are not directly connected to the center node
  getNonDirectNeighbors(centerNode) {
    const directNeighbors = new Set(this.getDirectNeighbors(centerNode));
    const allNodes = Object.keys(this.adjacencyList).map(Number);

    // Non-direct neighbors are all nodes that are not direct neighbors and not the centerNode itself
    const nonDirectNeighbors = allNodes.filter(node => !directNeighbors.has(node) && node !== centerNode);
    
    return nonDirectNeighbors;
  }

  getNeighborsAtDistance(centerNode, distance) {
    // If distance is 0, return only the centerNode itself
    if (distance === 0) {
      return [centerNode];
    }

    // Initialize sets and queues for BFS
    const visited = new Set([centerNode]);  // Track visited nodes to avoid cycles
    const queue = [[centerNode, 0]];  // Queue for BFS, stores pairs [node, currentDistance]
    const result = new Set();  // Store the nodes found at the desired distance

    // BFS loop
    while (queue.length > 0) {
      const [currentNode, currentDistance] = queue.shift();

      // Get neighbors of the current node
      const neighbors = this.getDirectNeighbors(currentNode);

      for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);

          // If we reached the desired distance, add the node to result
          if (currentDistance + 1 === distance) {
            result.add(neighbor);
          }

          // If still under the desired distance, keep exploring
          if (currentDistance + 1 < distance) {
            queue.push([neighbor, currentDistance + 1]);
          }
        }
      }
    }

    return Array.from(result);  // Return the neighbors found at the specified distance
}
  // Function to generate a triplet [directNeighbor, centerNode, randomNonDirectNeighbor]
  getTriplet(centerNode) {
    const directNeighbors = this.getDirectNeighbors(centerNode);
    const nonDirectNeighbors = this.getNonDirectNeighbors(centerNode);
    const shorterNeighbor = this.getNeighborsAtDistance(centerNode,2)
    const furtherNeighbor = this.getNeighborsAtDistance(centerNode,3).concat(this.getNeighborsAtDistance(centerNode,4))
    if (directNeighbors.length === 0 || nonDirectNeighbors.length === 0) {
      return null; // Return null if no valid triplet can be found
    }

    // Select a random direct neighbor (1 edge apart)

    const correctNodeOption = this.cycleThroughNeighbors(centerNode)

    // Select a random non-direct neighbor (not directly connected)
    const shorterNode = shorterNeighbor[Math.floor(Math.random() * shorterNeighbor.length)];
    const furtherNode = furtherNeighbor[Math.floor(Math.random() * furtherNeighbor.length)]
    while(furtherNode == shorterNode){
      furtherNode = furtherNeighbor[Math.floor(Math.random() * furtherNeighbor.length)]
    }
    
   
    if(Math.floor(Math.random() * 3 + 1) == 1) {
      directNodes = [correctNodeOption, centerNode, furtherNode, shorterNode]
    }else if (Math.floor(Math.random() * 3 + 1) == 2){
      directNodes = [shorterNode, centerNode, correctNodeOption, furtherNode];
    } else{
      directNodes = [furtherNode, centerNode, shorterNode, correctNodeOption]
    }
    correctDirectNodes = correctNodeOption
    shortDirectNodes = shorterNode
    farDirectNodes = furtherNode
  }

  // Helper function to perform BFS and find all nodes k edges apart from the starting node
  findNodesKEdgesApart(start, k) {
    const queue = [[start, 0]];  // [vertex, distance]
    const visited = new Set();
    visited.add(start);
    const result = new Set();

    while (queue.length > 0) {
      const [vertex, distance] = queue.shift();

      // If we've reached the distance k, add this vertex
      if (distance === k) {
        result.add(vertex);
      }

      // If we haven't reached k edges yet, continue exploring neighbors
      if (distance < k) {
        this.adjacencyList[vertex].forEach(neighbor => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push([neighbor, distance + 1]);
          }
        });
      }
    }

    return Array.from(result); // Return the nodes that are k edges apart from the start
  }

  // Function to find triplets where one node is leftK edges away and another node is rightK edges away from the center node
  getCustomTriplets(leftK, rightK) {
    const triplets = [];

    for (const centerNode in this.adjacencyList) {
      const nodesLeftKEdgesApart = this.findNodesKEdgesApart(parseInt(centerNode), leftK);
      const nodesRightKEdgesApart = this.findNodesKEdgesApart(parseInt(centerNode), rightK);

      // Create triplets [nodeLeftK, centerNode, nodeRightK]
      nodesLeftKEdgesApart.forEach((nodeLeft) => {
        nodesRightKEdgesApart.forEach((nodeRight) => {
          if (Math.floor(Math.random() * 2 + 1) == 1){
          triplets.push([nodeLeft, parseInt(centerNode), nodeRight]);
          } else {triplets.push([nodeRight, parseInt(centerNode), nodeLeft])}
          correctNode.push(nodeLeft)
        });
      });
    }

    return triplets;
  }
  
  getPairsKEdgesApart(k) {
    const pairs = new Set();

    // Helper function to perform BFS and find vertices k edges apart
    const bfs = (start) => {
      const queue = [[start, 0]];  // [vertex, distance]
      const visited = new Set();
      visited.add(start);

      while (queue.length) {
        const [vertex, distance] = queue.shift();

        // If we've reached the distance k, add the pair to the set
        if (distance === k) {
          const pair = [Math.min(start, vertex), Math.max(start, vertex)];
          pairs.add(pair.toString());
          continue;
        }

        // If not at distance k, explore neighbors
        this.adjacencyList[vertex].forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push([neighbor, distance + 1]);
          }
        });
      }
    };

    // Perform BFS from each vertex
    for (const vertex in this.adjacencyList) {
      bfs(parseInt(vertex));
    }

    // Convert the set back into an array of pairs
    return Array.from(pairs).map(pair => pair.split(',').map(Number));
  }
}

// Initialize the graph
const graph = new Graph();
for (let i = 1; i < 13; i++) {
  graph.addVertex(i);
}

graph.addEdge(1, 2);
graph.addEdge(2, 3);
graph.addEdge(2, 4);
graph.addEdge(3, 4);
graph.addEdge(3, 11);
graph.addEdge(3, 6);
graph.addEdge(4, 5);
graph.addEdge(4, 12);
graph.addEdge(6, 7);
graph.addEdge(6, 9);
graph.addEdge(7, 8);
graph.addEdge(8, 9);
graph.addEdge(8, 10);
graph.addEdge(9, 10);
graph.addEdge(9, 11);
graph.addEdge(11, 12);

graph.displayGraph();

//Direct Memory phase
graph.initTriplet()
let directRight = []
let directMid = []
let directLeft = []
let directUp = []
let directCorrect = []
let directShort = []
let directFar = []
var directNodes = 0

for(let i = 1;i<13;i++){
  for(let j = 0;j<graph.getDirectNeighbors(i).length;j++){
    graph.getTriplet(i)
    directLeft.push(directNodes[0])
    directUp.push(directNodes[1])
    directMid.push(directNodes[2])
    directRight.push(directNodes[3])
    directCorrect.push(correctDirectNodes)
    directShort.push(shortDirectNodes)
    directFar.push(farDirectNodes)
  }
  
}

let directarr = [];
  for (let i = 0; i < directLeft.length; i++) {
    directarr.push(i);
  }
directarr = shuffle(directarr)
directarr = shuffle(directarr)
directarr = shuffle(directarr)
let room_direct_left=[]
let room_direct_mid=[]
let room_direct_right=[]
let room_direct_up=[]
let room_direct_correct=[]
let room_direct_far=[]
let room_direct_short=[]


for(let i = 0;i<directLeft.length;i++){
  room_direct_up.push(imageList[directUp[directarr[i]]-1])
  room_direct_left.push(imageList[directLeft[directarr[i]]-1])
  room_direct_right.push(imageList[directRight[directarr[i]]-1])
  room_direct_mid.push(imageList[directMid[directarr[i]]-1])
  room_direct_correct.push(imageList[directCorrect[directarr[i]]-1])
  room_direct_short.push(imageList[directShort[directarr[i]]-1])
  room_direct_far.push(imageList[directFar[directarr[i]]-1])
}


//Shoretst Path judge phase
twothree = graph.getCustomTriplets(2,3)
threefour = graph.getCustomTriplets(3,4)
fourfive = graph.getCustomTriplets(4,5)
let onediff = twothree.concat(threefour,fourfive)
let onediffcorrect = correctNode
correctNode = []

twofour = graph.getCustomTriplets(2,4)
threefive = graph.getCustomTriplets(3,5)
let twodiff = twofour.concat(threefive)
let twodiffcorrect = correctNode
correctNode = []

twofive = graph.getCustomTriplets(2,5)
let threediff = twofive
let threediffcorrect = correctNode

let diff_arr = []

for (let i = 0;i < 20;i++){
  diff_arr.push(i)
}
shuffle(diff_arr)

let shuffled_one_diff = []
let shuffled_two_diff = []
let shuffled_three_diff = []

let shuffled_one_diff_correct = []
let shuffled_two_diff_correct = []
let shuffled_three_diff_correct = []
let combined_arr = []

for (let i = 0;i < 20;i++){
  shuffled_one_diff.push(onediff[i])
  shuffled_one_diff_correct.push(onediffcorrect[i])
  combined_arr.push(i)
}
for (let i = 0;i < 20;i++){
  shuffled_two_diff.push(twodiff[i])
  shuffled_two_diff_correct.push(twodiffcorrect[i])
  combined_arr.push(i+20)
}
for (let i = 0;i < 20;i++){
  shuffled_three_diff.push(threediff[i])
  shuffled_three_diff_correct.push(threediffcorrect[i])
  combined_arr.push(i+40)
}

let cumulativediff = shuffled_one_diff.concat(shuffled_two_diff,shuffled_three_diff)
let cumulativeCorrect = shuffled_one_diff_correct.concat(shuffled_two_diff_correct,shuffled_three_diff_correct)

let cumulativearr = []
  for (let i = 0; i < cumulativediff.length; i++) {
    cumulativearr.push(i)
  }

cumulativearr=shuffle(cumulativearr)

let correctShortList = []
let upList = []
let leftList = []
let rightList = []
let sorted_combined_arr = []
for (let i = 0;i<cumulativediff.length;i++){
  upList.push(cumulativediff[cumulativearr[i]][1])
  leftList.push(cumulativediff[cumulativearr[i]][0])
  rightList.push(cumulativediff[cumulativearr[i]][2])
  correctShortList.push(cumulativeCorrect[cumulativearr[i]])
  sorted_combined_arr.push(combined_arr[i])
}
var room_shortest_right = []
var room_shortest_left = []
var room_shortest_up = []
var  room_shortest_correct = []
for (let i = 0;i<n_shortest_trial;i++){
  room_shortest_up.push(imageList[upList[i]-1])
  room_shortest_left.push(imageList[leftList[i]-1])
  room_shortest_right.push(imageList[rightList[i]-1])
  room_shortest_correct.push(imageList[correctShortList[i]-1])
}


//Goal Directed Navigation:

var room_goaldir_left = []
var room_goaldir_right = []

let twoEdgePair = graph.getPairsKEdgesApart(2)
let threeEdgePair = graph.getPairsKEdgesApart(3)
let fourEdgePair = graph.getPairsKEdgesApart(4)
let fiveEdgePair = graph.getPairsKEdgesApart(5)

let goaldirList = graph.getPairsKEdgesApart(2).concat(graph.getPairsKEdgesApart(3),graph.getPairsKEdgesApart(4),graph.getPairsKEdgesApart(5))
goaldirIndex = []
for (let i = 0; i < goaldirList.length; i++) {
  goaldirIndex.push(i);
}
goaldirIndex = shuffle(goaldirIndex)

let shuffledList = []
for (let i = 0;i < 4; i++){
  shuffledList.push(goaldirList[goaldirIndex[i]])
  shuffledList.push(goaldirList[goaldirIndex[i+twoEdgePair.length]])
  shuffledList.push(goaldirList[goaldirIndex[i+twoEdgePair.length + threeEdgePair.length]])
  shuffledList.push(goaldirList[goaldirIndex[i+twoEdgePair.length + threeEdgePair.length + fourEdgePair.length]])
}

let shuffledIndex = []
for (let i = 0; i < shuffledList.length; i++) {
  shuffledIndex.push(i);
}

for (let i = 0; i<shuffledList.length; i++){
  if(Math.floor(Math.random() * 2 + 1) == 1){
    room_goaldir_left.push(shuffledList[shuffledIndex[i]][0])
    room_goaldir_right.push(shuffledList[shuffledIndex[i]][1])
  }else {
    room_goaldir_left.push(shuffledList[shuffledIndex[i]][1])
    room_goaldir_right.push(shuffledList[shuffledIndex[i]][0])
  }

}

function ensureNoConsecutiveDuplicates(arr) {
  for (let i = 1; i < arr.length; i++) {
      if (arr[i] === arr[i - 1]) {
          for (let j = i + 1; j < arr.length; j++) {
              if (arr[j] !== arr[i] && arr[j - 1] !== arr[i]) {
                  [arr[i], arr[j]] = [arr[j], arr[i]];
                  break;
              }
          }
      }
  }
  return arr;
}

//color for the plus sign
atcheckcolor=['blue','green']

//determinant for the time for the flash color
function colorStart(){
    colordetretime= Math.floor(Math.random() * (1000 - 300 + 1)) + 300;
    return colordetretime
}

//time for the duration of the color being present
function colorStop(colordetretime){
    removecolor= 1500-colordetretime-100;
    return removecolor
}


//randomDelay for Direct Memory Test and Shortest Path Judgement
var randomDelay = Math.floor(Math.random() * (2500 - 100 + 1)) + 100;
