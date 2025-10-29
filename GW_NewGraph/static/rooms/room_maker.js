function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;
    return str.replace(/%s/g, () => args[i++]);
}


//Learning phase with color cross in the middle
function create_learningcolor_trial(trial_num,color) {
  return parse("<p style='position:absolute;top:50%;right:50%;transform:translate(50%, -50%);font-size:125px;color:" + color + ";text-shadow:\
  -2px -2px 0 #000, 0 -2px 0 #000, 2px -2px 0 #000,\
  -2px 0 0 #000, 2px 0 0 #000,\
  -2px 2px 0 #000, 0 2px 0 #000, 2px 2px 0 #000;'>+</p>");
}

//learning phase
function create_learning_trial(room_choiceStims_left,room_choiceStims_right,trial_num) {
  return parse("<p style='position:absolute;top: 50%;right: 50%;transform: translate(50%, -50%);font-size: 125px;color:black;text-shadow:-2px -2px 0 #000, 0 -2px 0 #000, 2px -2px 0 #000,-2px 0 0 #000, 2px 0 0 #000,-2px 2px 0 #000, 0 2px 0 #000, 2px 2px 0 #000;'>\u002B</p><img style='position:absolute;top: 50%;right: 70%;transform: translate(50%, -50%);z-score:0;width: 350px;height: 350px;' src='../static/images/%s' height='350'> <img style='position:absolute;top: 50%;right: 30%;transform: translate(50%, -50%);z-score:0;width: 350px;height: 350px;' src='../static/images/%s' height='350'><br><style>body {background-color: #ffff;}</style>"
  ,room_choiceStims_left[trial_num],room_choiceStims_right[trial_num])
}

//Direct Memory phase
function create_direct_trial(room_choice_up, room_choiceStims_left, room_choice_mid, room_choiceStims_right, trial_num) {
  return parse(
    "<img class='bottom' style='position:absolute;top: 20%;right: 50%;transform: translate(50%, -50%);z-score:0;width: 250px;height: 250px;' src='../static/images/%s' height='250'>" +
    "<img id='img1' class='bottom' style='position:absolute;top: 70%;right: 75%;transform: translate(50%, -50%);z-score:0;width: 250px;height: 250px;' src='../static/images/%s' height='250'>" +
    "<img id='img2' class='bottom' style='position:absolute;top: 70%;right: 50%;transform: translate(50%, -50%);z-score:0;width: 250px;height: 250px;' src='../static/images/%s' height='250'>" +
    "<img id='img3' class='bottom' style='position:absolute;top: 70%;right: 25%;transform: translate(50%, -50%);z-score:0;width: 250px;height: 250px;' src='../static/images/%s' height='250'>" +
    "<div class='bottom' style='position:absolute;top: 90%;right: 75%;transform: translate(50%, -50%);z-score:0;width: 250px;text-align:center;font-size: 30px;'>1</div>" +
    "<div class='bottom' style='position:absolute;top: 90%;right: 50%;transform: translate(50%, -50%);z-score:0;width: 250px;text-align:center;font-size: 30px;'>2</div>" +
    "<div class='bottom' style='position:absolute;top: 90%;right: 25%;transform: translate(50%, -50%);z-score:0;width: 250px;text-align:center;font-size: 30px;'>3</div>" +
    "<br><style>body {background-color: #ffff;}</style>", 
    room_choice_up[trial_num], room_choiceStims_left[trial_num], room_choice_mid[trial_num], room_choiceStims_right[trial_num]
  );
}

//Shortest path judgement
function create_shortestpath_trial(room_choice_up,room_choiceStims_left,room_choiceStims_right,trial_num) {
  return parse(
    "<img class = 'bottomshortest' style='position:absolute;top: 20%;right: 50%;transform: translate(50%, -50%);z-score:0;width: 250px;height: 250px;' src='../static/images/%s' height='250'>"+
    "<img id = 'img1' class = 'bottomshortest' style='position:absolute;top: 70%;right: 65%;transform: translate(50%, -50%);z-score:0;width: 250px;height: 250px;' src='../static/images/%s' height='250'>"+
    "<img id = 'img2' class = 'bottomshortest' style='position:absolute;top: 70%;right: 35%;transform: translate(50%, -50%);z-score:0;width: 250px;height: 250px;' src='../static/images/%s' height='250'>"+
    "<div class='bottomshortest' style='position:absolute;top: 90%;right: 65%;transform: translate(50%, -50%);z-score:0;width: 250px;text-align:center;font-size: 30px;'>1</div>" +
    "<div class='bottomshortest' style='position:absolute;top: 90%;right: 35%;transform: translate(50%, -50%);z-score:0;width: 250px;text-align:center;font-size: 30px;'>2</div>" +
    "<br><style>body {background-color: #ffff;}</style>" 
  ,room_choice_up[trial_num],room_choiceStims_left[trial_num],room_choiceStims_right[trial_num])
}

//plus sign
function create_memory_ten() {
  return parse("<p style='position:absolute;top: 50%;right: 50%;transform: translate(50%, -50%);font-size: 125px;color: black;;text-shadow:-2px -2px 0 #000, 0 -2px 0 #000, 2px -2px 0 #000,-2px 0 0 #000, 2px 0 0 #000,-2px 2px 0 #000, 0 2px 0 #000, 2px 2px 0 #000;'>\u002B</p>")
}


function create_memory_phase(blue_val,room_color,n_memory) {
  room_timeline = []
  for (var i = 0; i < n_memory; i++) {
    room_timeline.push({stimulus:create_memory_trial(),prompt:parse("<br><br><h2>Press 'N' if new, 'O' if old</h1><style>body {background-color: %s;}</style>",blue_val,room_color)})
  }
  return room_timeline
}


function add_room(room,room_timeline) {
  for (var i = 0; i < 4; i++) {
    room_timeline.push(room[i])
} return room_timeline

}

//function for attentioncheck
function attentioncheck_learningphase(learn_phase,sfa,curr_blue_trial,n_blue_rounds,thebreak,thecrossant,thecrossant_black,thecrossant_break){
  if (num_breaks > 0) {
    trials_between_breaks = n_blue_rounds / (num_breaks + 1);
    for (let i = 0; i < num_breaks; i++) {
      breaks.push(Math.floor(trials_between_breaks * (i + 1)));
    }
  }
  if(sfa && curr_blue_trial<n_blue_rounds) {
    if (sfa && breaks.includes(curr_blue_trial)) {
      jsPsych.addNodeToEndOfTimeline({
        timeline: [learn_phase_break,directmem_break, learn_phase, learn_phase_color, thecrossant, thecrossant_black, thecrossant_break],
      }, jsPsych.resumeExperiment);
    } else {
      jsPsych.addNodeToEndOfTimeline({
        timeline: [learn_phase, learn_phase_color, thecrossant, thecrossant_black, thecrossant_break],
      }, jsPsych.resumeExperiment);
    }

  }else if(sfa&& curr_blue_trial>=n_blue_rounds) {
    jsPsych.addNodeToEndOfTimeline({
      timeline: [learn_phase_end_break,thebreak],
    }, jsPsych.resumeExperiment)
  }
}

function attentioncheck(learn_phase,sfa,curr_blue_trial,n_blue_rounds,thebreak,phase='learn'){
  if(sfa && curr_blue_trial<n_blue_rounds) {
    jsPsych.addNodeToEndOfTimeline({
      timeline: [directmem_break,learn_phase],
    }, jsPsych.resumeExperiment)
  }else if(sfa&& curr_blue_trial>=n_blue_rounds) {
    jsPsych.addNodeToEndOfTimeline({
      timeline: [directmem_break,thebreak],
    }, jsPsych.resumeExperiment)
  }
  else if (!sfa && phase =='direct'){
    if(direct_warning<1&& curr_blue_trial<n_blue_rounds){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [directmem_break,learn_phase],
      }, jsPsych.resumeExperiment)
    }else if(direct_warning>=1 && direct_warning<=4 && curr_blue_trial<n_blue_rounds){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [warning_page,directmem_break,learn_phase],
      }, jsPsych.resumeExperiment)
    }else if(direct_warning<1&& curr_blue_trial>=n_blue_rounds){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [directmem_break,thebreak],
      }, jsPsych.resumeExperiment)
    }else if(direct_warning>=1 && direct_warning<=4&& curr_blue_trial>=n_blue_rounds){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [warning_page,directmem_break,thebreak],
      }, jsPsych.resumeExperiment)
    }else if(direct_warning>4){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [TaskFailed],
      }, jsPsych.resumeExperiment)
    }
  }
  else if (!sfa && phase =='short'){
    if(short_warning<1&& curr_blue_trial<n_blue_rounds){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [directmem_break,learn_phase],
      }, jsPsych.resumeExperiment)
    }else if(short_warning>=1 && short_warning<8&& curr_blue_trial<n_blue_rounds){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [warning_page,directmem_break,learn_phase],
      }, jsPsych.resumeExperiment)
    }else if(short_warning<1&& curr_blue_trial>=n_blue_rounds){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [directmem_break,thebreak],
      }, jsPsych.resumeExperiment)
    }else if(short_warning>=1 && short_warning<8&& curr_blue_trial>=n_blue_rounds){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [warning_page,directmem_break,thebreak],
      }, jsPsych.resumeExperiment)
    }else if(short_warning>=8){
      jsPsych.addNodeToEndOfTimeline({
        timeline: [TaskFailed],
      }, jsPsych.resumeExperiment)
    }
  }
}

//function to push the instruct
function timelinepushintro(intro,instructnames){
  for (let i = 0; i < instructnames.length; i++){
    timeline.push(intro[i],)
  }
}

function timelinepresent(intro, instructnames,directmemory_phase) {
  let timelinetemp = [];
  
  for (let i = 0; i < instructnames.length; i++) {
    timelinetemp.push(intro[i]);
  }
  timelinetemp.push(directmemory_phase);
  
  jsPsych.addNodeToEndOfTimeline({ timeline: timelinetemp }, jsPsych.resumeExperiment);
}

//function to generate the attention check of the plus sign
//random number
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
var pluscheck=[]
var pluscolor=[]
for (let i=0 ; i<n_learning_trial;i++){
  plusdeter = randomIntFromInterval(1, 2)
  if (plusdeter==1){
    pluscolor.push(atcheckcolor[0])
    pluscheck.push(49)
  }else if(plusdeter==2){
    pluscolor.push(atcheckcolor[1])
    pluscheck.push(50)
  }
}