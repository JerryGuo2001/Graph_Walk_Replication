//const { navigatorLock } = require("@supabase/supabase-js");

var debug_mode = 0; // debug mode determines how long the blocks are, 5 sec in debug mode, 5 minutes in actual experiment
//var data_save_method = 'csv_server_py';
var data_save_method = 'csv_server_py';

var part2_sfa= NaN
var direct_warning = 0
var short_warning = 0
var quickKP = 0;
var infKP = 0;
var timer = 0;
var too_quick = 0;
// Will be set to true when experiment is exiting fullscreen normally, to prevent above end experiment code
var normal_exit = false;
var window_height = window.screen.height;

// Save function references
function blockRefresh(event) {
  if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
    event.preventDefault();
    alert("Page refresh is disabled.");
  }
}

function blockUnload(event) {
  event.preventDefault();
  event.returnValue = ""; // Some browsers need this line
}

// Attach the listeners
document.addEventListener("keydown", blockRefresh);
window.addEventListener("beforeunload", blockUnload);

//this is to test if the user leave the webpage
var detectfocus=0
var isinfocus=1
document.addEventListener('mouseleave', e=>{
  detectfocus=detectfocus+1
  isinfocus=0
  //this is to see if user are focus or not
})
document.addEventListener('visibilitychange', e=>{
   if (document.visibilityState === 'visible') {
 //report that user is in focus
 isinfocus=1
  } else {
  detectfocus=detectfocus+1
  isinfocus=0
  //this is to see if user are focus or not
  }  
})

// Randomly generate an 8-character alphanumeric subject ID via jsPsych
var subject_id = jsPsych.randomization.randomID(8);

// Load PsiTurk
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
var condition = psiturk.taskdata.get('condition') + 1; // they do zero-indexing

var timeline = []

//welcome page
var welcome = {
  type: 'survey-html-form',
  html: "<label for='worker_id'>Enter your Prolific Worker ID. Please make sure this is correct! </label><br><input type='text' id='worker_id' name='worker_id' required><br><br>",
  on_finish: function (data) {
    window.useridtouse=data.responses
    window.useridtouse = useridtouse.split('"')[3];
    subject_id=useridtouse
    data.subject_id = useridtouse
    data.trial_type = "Replication"
    data.condition = sequence
    data.phase = 'Instruction'
    data.node_l = NaN
    data.node_c = NaN
    data.node_r = NaN
    data.node_1 = NaN
    data.node_2 = NaN
    data.node_3 = NaN
    data.dist_l = NaN
    data.dist_r = NaN
    data.dist_1 = NaN
    data.dist_2 = NaN
    data.dist_3 = NaN
    data.trial_timestamp	= NaN
    data.choice_timestamp = NaN
    data.response_timestamp = NaN
    data.response_delay = NaN
    data.response_key = NaN
    data.response = NaN
    data.accuracy = NaN
    data.stimulus = "text"
    data.edge_condition = NaN
    data.specific_pairs = NaN
    save_data()
  }
}
//welcome page end

var too_quick={
  type: 'html-keyboard-response',
  stimulus: '<h1 style="color: red;font-size: 50px">Your response was too quick. Please take your time to carefully consider your answer before responding.</h1>' +
            '<p style="color: red;font-size: 50px">The experiment will continue in 10 seconds.</p>',
  choices: jsPsych.NO_KEYS, // Prevent responses
  trial_duration: 10000, // Stay on screen for 10 seconds
  on_finish: function(data) {
    data.subject_id = useridtouse
    data.trial_type = "Replication"
    data.condition = sequence
    data.phase = 'Too_Quick'
    data.node_l = NaN
    data.node_c = NaN
    data.node_r = NaN
    data.node_1 = NaN
    data.node_2 = NaN
    data.node_3 = NaN
    data.dist_l = NaN
    data.dist_r = NaN
    data.dist_1 = NaN
    data.dist_2 = NaN
    data.dist_3 = NaN
    data.trial_timestamp	= NaN
    data.choice_timestamp = NaN
    data.response_timestamp = NaN
    data.response_delay = NaN
    data.response_key = NaN
    data.response = NaN
    data.accuracy = NaN
    data.stimulus = "text"
    quickKP +=1
  }
}


//direct_memory
var dirmem_too_quick_check=0
var curr_direct_trial=0
var directmemory_phase = {
  type: 'html-keyboard-response',
  choices: ['1','2','3'],
  response_ends_trial: true,
  stimulus:create_direct_trial(room_direct_up,room_direct_left,room_direct_mid,room_direct_right,curr_direct_trial),
  stimulus_duration:6500,//6.5 second for now, we will discuss it 
  trial_duration:6500,//5 second for now 
  on_finish: function(data) {
    // For too quick responses //
    infKP += 1
    if (infKP==1){
      // Start the timer
      timer = 0;
      infINT = setInterval(() => {
          timer++;;
      }, 1000);
    }
    if (infKP == 4 && timer < 4) {
      clearInterval(infINT)
      jsPsych.addNodeToEndOfTimeline({
      timeline: [too_quick],
      }, jsPsych.resumeExperiment)
      infKP = -1
      timer = 0;
      too_quick += 1
    } else if ((infKP <= 4 && timer >= 4)){
      infKP = 0
      clearInterval(infINT);
      timer = 0
    }

    if (data.rt && data.rt < 300) {
      jsPsych.addNodeToEndOfTimeline({
        timeline: [too_quick],
        }, jsPsych.resumeExperiment)
    }
    // Data Structure //
    data.subject_id = useridtouse
    data.trial_type = "Replication"
    data.condition = sequence
    data.phase = 'Direct'
    data.node_l = NaN // For learning and judgement
    data.node_c = node_direct_up[curr_direct_trial]
    data.node_r = NaN // For learning and judgement
    data.node_1 = node_direct_left[curr_direct_trial]
    data.node_2 = node_direct_mid[curr_direct_trial]
    data.node_3 = node_direct_right[curr_direct_trial]
    data.dist_l = NaN // For learning and judgement
    data.dist_r = NaN // For learning and judgement
    data.dist_1 = distance_direct_left[curr_direct_trial]
    data.dist_2 = distance_direct_mid[curr_direct_trial]
    data.dist_3 = distance_direct_right[curr_direct_trial]
    data.img_l = NaN // For learning and judgement
    data.img_c = room_direct_up[curr_direct_trial]
    data.img_r = NaN // For learning and judgement
    data.img_1 = room_direct_left[curr_direct_trial]
    data.img_2 = room_direct_mid[curr_direct_trial]
    data.img_3 = room_direct_right[curr_direct_trial]
    data.trial_timestamp	= data.time_elapsed / 1000
    data.choice_timestamp = data.time_elapsed / 1000
    data.response_timestamp = (data.rt + data.time_elapsed) / 1000
    data.response_delay = 0
    data.response_key = data.key_press - 48
    data.response = data.key_press - 49
    data.node_correct = node_direct_correct[curr_direct_trial]
    if ((data.key_press == 49 && data.node_1 == data.node_correct)||
    (data.key_press == 50 && data.node_2 == data.node_correct) ||(data.key_press == 51 && data.node_3 == data.node_correct)) {
      data.accuracy = 1
    } else {
      data.accuracy = 0
    }
    data.stimulus = "text"
    data.too_quick = too_quick

    // Advance Trial Num //
    curr_direct_trial=curr_direct_trial+1;

    // For missing responses //
    part2_sfa=data.key_press
    if (!part2_sfa){
      direct_warning +=1
    }

    // CHECK BUT REMOVE //
    console.log(data.response_timestamp, data.choice_timestamp)

    // Advance Trial //
    directmemory_phase.stimulus=create_direct_trial(room_direct_up,room_direct_left,room_direct_mid,room_direct_right,curr_direct_trial)
    attentioncheck(directmemory_phase,part2_sfa,curr_direct_trial,n_direct_trial,intro_short,phase='direct')
  }
}

// Direct Memory Test End //

var directmem_break= {
  type: 'html-keyboard-response',
  choices:jsPsych.NO_KEYS,
  stimulus_duration: 1000,
  trial_duration: 1000,
  stimulus:'<p></p>',
  data: {ignore: true},
  on_finish: function(data) {
    data.stimulus = 'text'
    data.trial_type = 'Replication'
  }
}

//Fullscreen start
var enterFullscreen = {
  type: 'html-button-response',
  stimulus: `
        <style>
            ul {
                list-style-type: disc;
                margin: 20px 0;
                padding-left: 100px;
                text-align: left;
            }
            li {
                margin-bottom: 15px;
                font-size: 18px;
                line-height: 1.6;
            }
            p {
                font-size: 18px;
                line-height: 1.6;
                margin: 10px 0;
                text-align: center;
            }
        </style>
        <h3 style='text-align: center'><strong>Thank you for your participation in this study. Please:</strong></h3>
        <br />
        <ul>
            <li>Follow the instructions for each task and try your best to perform well.</li>
            <li>Maximize your browser and focus completely on the task without any distractions.</li>
            <li><strong>DO NOT</strong> take notes during the experiment, as this interferes with our ability to accurately measure the learning process.</li>
            <li><strong>DO NOT</strong> participate if you feel you cannot fully commit to these requirements.</li>
        </ul> <br />
        <p>When you are ready to take the experiment, click 'Enter Fullscreen' to begin.</p> <br />
    `,
  choices: ['Enter Fullscreen'],
  data: {ignore: true},
  on_finish: function(data) {
      // Trigger fullscreen mode when the button is clicked
      document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
      data.trial_type = 'Replication'
      data.stimulus = 'text'
  }
};
// Fullscreen end

//Instruction page
function create_instruct(instruct,instructnames,instruction_number,prac_attentioncheck_blackplus,a=''){
  var intro_learn={
    type: 'html-button-response',
    button_html: '<button class="jspsych-btn" style="padding: 12px 24px; font-size: 18px; border-radius: 10px; background-color: #4CAF50; color: white; border: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 0 10px;">%choice%</button>',
    choices: ['Next'],
    stimulus: instruct[`instruct_`+a+`${instruction_number}`],
    data: {ignore: true},
    on_finish: function (data) {
      data.trial_type = 'Replication';
      data.stimulus='text';
      // Check which button was pressed
      if (instructnames.length==1){
        if (data.button_pressed == 0) {
          jsPsych.addNodeToEndOfTimeline({
              timeline: [prac_attentioncheck_blackplus],
            }, jsPsych.resumeExperiment)
        }
      }else if (instruction_number>=instructnames.length){
        if (data.button_pressed == 0) {
          intro_learn.choices=['Previous','Next']
          instruction_number-=1
          intro_learn.stimulus=instruct[`instruct_`+a+`${instruction_number}`],
          jsPsych.addNodeToEndOfTimeline({
              timeline: [intro_learn],
            }, jsPsych.resumeExperiment)
        } else if (data.button_pressed == 1) {
          jsPsych.addNodeToEndOfTimeline({
              timeline: [prac_attentioncheck_blackplus],
            }, jsPsych.resumeExperiment)
        }
      }else if (instruction_number==1){
        instruction_number+=1
        intro_learn.choices=['Previous','Next']
        intro_learn.stimulus=instruct[`instruct_`+a+`${instruction_number}`],
        jsPsych.addNodeToEndOfTimeline({
          timeline: [intro_learn],
        }, jsPsych.resumeExperiment)
      }else if (instruction_number==instructnames.length-1){
        if (data.button_pressed == 0) {
          if (instruction_number==2){
            intro_learn.choices=['Next']
          }
          instruction_number-=1
          intro_learn.stimulus=instruct[`instruct_`+a+`${instruction_number}`],
          jsPsych.addNodeToEndOfTimeline({
              timeline: [intro_learn],
            }, jsPsych.resumeExperiment)
          } else if (data.button_pressed == 1) {
            intro_learn.choices=['Previous','Start']
            instruction_number+=1
            intro_learn.stimulus=instruct[`instruct_`+a+`${instruction_number}`],
            jsPsych.addNodeToEndOfTimeline({
                timeline: [intro_learn],
              }, jsPsych.resumeExperiment)
          }
      }else{
      if (data.button_pressed == 0) {
        if (instruction_number==2){
          intro_learn.choices=['Next']
        }
        instruction_number-=1
        intro_learn.stimulus=instruct[`instruct_`+a+`${instruction_number}`],
        jsPsych.addNodeToEndOfTimeline({
            timeline: [intro_learn],
          }, jsPsych.resumeExperiment)
        } else if (data.button_pressed == 1) {
          instruction_number+=1
          intro_learn.stimulus=instruct[`instruct_`+a+`${instruction_number}`],
          jsPsych.addNodeToEndOfTimeline({
              timeline: [intro_learn],
            }, jsPsych.resumeExperiment)
        }
      }
    }
  }
  return intro_learn
}


  //practice attention check
var ac_colorprepare=colorStart()
var ac_colorstop=colorStop(ac_colorprepare)
var ac_colorlist=['blue','yellow','yellow','blue','yellow','yellow','blue','yellow','blue','blue']
var ac_colornumber=0
var total_ac = 0
var correct_ac = 0
var ac_feedback = {}

var instruct_lastonebefore_practice={
  type: 'html-keyboard-response',
  choices: ['spacebar'],
  stimulus: `
  <div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>
  You will have 1 second from when the cross flashes blue or yellow to respond, so please respond quickly. 
  If you miss several responses in a row, the experiment will quit early. However, remember that while you should pay attention to the center cross changing colors, 
  it is most important that you memorize the pairs (using the strategy we practiced earlier). You will NOT have to memorize the color changes. The task will begin once you press space.
  <p style= 'font-size:25px;margin-top:100px'>[press the spacebar to start]</p>
   `,
  data: {ignore: true},
  on_finish: function (data) {
    data.trial_type = 'Replication';
    data.stimulus='text'
  }
}

// 1: The black plus sign, the color change, the black plus sign for response


var prac_attentioncheck_blackplus={
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  stimulus_height: 100,
  stimulus_width: 100,
  stimulus_duration: ac_colorprepare,
  trial_duration: ac_colorprepare,
  response_ends_trial: false,
  stimulus:create_memory_ten(),
  prompt:parse("<br><br><style>body {background-color: #ffff;}</style>"),
  data: {ignore: true},
  on_finish: function(data) {
    data.trial_type='Replication'
    data.phase = 'Practice'
    data.stimulus='text'
    prac_attentioncheck_colorchange.stimulus=create_color_list(ac_colorlist[ac_colornumber])
    jsPsych.addNodeToEndOfTimeline({
      timeline: [prac_attentioncheck_colorchange],
    }, jsPsych.resumeExperiment)
  }
}
var csfa=[]

//attention check color cross
function create_color_list(color) {
  return parse("<p style='position:absolute;top:50%;right:50%;transform:translate(50%, -50%);font-size:125px;color:" + color + ";text-shadow:\
  -2px -2px 0 #000, 0 -2px 0 #000, 2px -2px 0 #000,\
  -2px 0 0 #000, 2px 0 0 #000,\
  -2px 2px 0 #000, 0 2px 0 #000, 2px 2px 0 #000;'>+</p>");
}

var prac_attentioncheck_colorchange={
  type: 'html-keyboard-responsefl',
  choices: ['1','2'],
  response_ends_trial: false,
  stimulus:create_color_list(ac_colorlist[ac_colornumber]),
  stimulus_duration:ac_colorstop,
  trial_duration:ac_colorstop,
  data: {ignore: true},
  on_finish: function(data) {
    data.trial_type = 'Replication';
    data.phase = 'Practice'
    data.stimulus = 'text'
    csfa=data.key_press
    jsPsych.addNodeToEndOfTimeline({
      timeline: [prac_attentioncheck_thethird],
    }, jsPsych.resumeExperiment)
  }
}

var prac_attentioncheck_thethird={
  type: 'html-keyboard-response',
  choices: ['1','2'],
  stimulus_height: 100,
  stimulus_width: 100,
  stimulus_duration: 2000,
  trial_duration: 2000,
  response_ends_trial: false,
  data: {ignore: true},
  stimulus:create_memory_ten(),
  prompt:parse("<br><br><style>body {background-color: #ffff;}</style>"),
  on_finish: function(data) {
    data.trial_type='Replication'
    data.phase = 'Practice'
    data.stimulus='text'
    if(ac_colornumber<ac_colortotal){
      if (csfa==49&&ac_colorlist[ac_colornumber]=='blue'){
        correct_ac += 1
        jsPsych.addNodeToEndOfTimeline({
          timeline: [prac_attentioncheck_blackplus],
        }, jsPsych.resumeExperiment)
      }else if (csfa==50&&ac_colorlist[ac_colornumber]=='yellow'){
        correct_ac += 1
        jsPsych.addNodeToEndOfTimeline({
          timeline: [prac_attentioncheck_blackplus],
        }, jsPsych.resumeExperiment)
      }else if (data.key_press==49&&ac_colorlist[ac_colornumber]=='blue'){
        correct_ac += 1
        jsPsych.addNodeToEndOfTimeline({
          timeline: [prac_attentioncheck_blackplus],
        }, jsPsych.resumeExperiment)
      }else if (data.key_press==50&&ac_colorlist[ac_colornumber]=='yellow'){
        correct_ac += 1
        jsPsych.addNodeToEndOfTimeline({
          timeline: [prac_attentioncheck_blackplus],
        }, jsPsych.resumeExperiment)
      }else{
        jsPsych.addNodeToEndOfTimeline({
          timeline: [helpofattentioncheck,prac_attentioncheck_blackplus],
        }, jsPsych.resumeExperiment)
      }
    }else{
      if (csfa==49&&ac_colorlist[ac_colornumber]=='blue' || csfa==50&&ac_colorlist[ac_colornumber]=='yellow' || data.key_press==49&&ac_colorlist[ac_colornumber]=='blue' || data.key_press==49&&ac_colorlist[ac_colornumber]=='yellow') {
        correct_ac += 1
      }
      total_ac += 1
      getACvalues()
      if (kickout_record>kickout_total){
          jsPsych.addNodeToEndOfTimeline({
            timeline: [TaskEarlyFail],
          }, jsPsych.resumeExperiment)
      }else{
          jsPsych.addNodeToEndOfTimeline({
            timeline: [ac_feedback],
          }, jsPsych.resumeExperiment)
      }
  }
    ac_colornumber+=1
    total_ac +=1
    csfa=[]
    ac_colorprepare=colorStart()
    ac_colorstop=colorStop(ac_colorprepare)
    prac_attentioncheck_blackplus.stimulus_duration=ac_colorprepare
    prac_attentioncheck_blackplus.trial_duration=ac_colorprepare
    prac_attentioncheck_colorchange.stimulus_duration=ac_colorstop
    prac_attentioncheck_colorchange.trial_duration=ac_colorstop
  }
}

function getACvalues() {
  if (correct_ac/total_ac<0.7){
  kickout_record+=1
  ac_feedback = {
    type: 'html-button-response',
    stimulus: `<div style='margin-left:200px; margin-right: 200px; text-align: center;'>
                <p style='font-size: 30px; line-height:1.5'>
                  Thank you for completing the practice, your score is ${correct_ac}/${total_ac}. 
                  <br><br> 
                  Please try to respond to each color change as accurately as possible during the task. 
                  To continue this experiment, please make sure to get at least 7 of the 10 trials correct. When you are ready press 'Try Again'. 
                </p><br>
              </div>`,
    choices: ['Try Again'],
    data: {ignore: true},
    button_html: [
      '<button id="retry-button" class ="custom-button" style="font-size: 20px; padding: 10px; margin: 10px;">%choice%</button>',
    ],
    response_ends_trial: true, 
    on_load: function() {
      document.getElementById("retry-button").addEventListener("click", function() {
        ac_colornumber = 0
        total_ac = 0
        correct_ac = 0
        jsPsych.addNodeToEndOfTimeline({
          timeline: [prac_attentioncheck_blackplus],
        }, jsPsych.resumeExperiment)
      });
    },
    on_finish: function(data) {
      data.trial_type = 'Replication';
      data.phase = 'Practice'
      data.stimulus = 'text';
      data.kickout = kickout_record
    }
  };
}else{
  ac_feedback = {
    type: 'html-button-response',
    stimulus: `<div style='margin-left:200px; margin-right: 200px; text-align: center;'>
                <p style='font-size: 30px; line-height:1.5'>
                  Thank you for completing the practice, your score is ${correct_ac}/${total_ac}. 
                  <br><br> 
                  Please try to respond to each color change as accurately as possible during the task. 
                  If you are ready to continue to the next practice, press 'Continue'.
                </p><br>
              </div>`,
    choices: ['Continue'],
    data: {ignore: true},
    button_html: [
      '<button id="continue-button" class="custom-button" style="font-size: 20px; padding: 10px; margin: 10px;">%choice%</button>'
    ],
    response_ends_trial: true, 
    on_load: function() {
      document.getElementById("continue-button").addEventListener("click", function() {
        jsPsych.addNodeToEndOfTimeline({
          timeline: [instruct_lastonebefore_practice,learn_phase,learn_phase_color,thecrossant,thecrossant_black,thecrossant_break],
        }, jsPsych.resumeExperiment)
      });
    },
    on_finish: function(data) {
      data.trial_type = 'Replication';
      data.phase = 'Practice'
      data.stimulus = 'text';
    }
  };
}
}

var helpofattentioncheck={
  type: 'html-keyboard-response',
  choices: ['spacebar'],
  data: {ignore: true},
  stimulus: "<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>It seems you got one wrong. Remember, for the cross below:</p><img src= '../static/images/isi.png' width='150' height='150'><p style ='font-size: 30px;line-height:1.5'>If the cross flashes <span style='color: blue; text-shadow: -1px -1px 0 #000,1px -1px 0 #000,-1px  1px 0 #000,1px  1px 0 #000'>blue,</span> press the '1' key on your keyboard, if it flashes <span style='color: yellow; text-shadow: -1px -1px 0 #000,1px -1px 0 #000,-1px  1px 0 #000,1px  1px 0 #000'>yellow,</span> press '2'.<p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
  on_finish: function (data) {
    data.trial_type = 'Replication';
    data.phase = 'Practice'
    data.stimulus='text'
  }
}

//practice attention check end

// Learn prac 1

var learn_prac1_phase = {
  type: 'html-keyboard-responsefl',
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  stimulus:create_learning_trial(['story_example_01.png'],['story_example_02.png'],0),
  stimulus_duration:3000,
  trial_duration:3000,
  data: {ignore: true},
  on_load: function(){
    timeline.push(intro_prac1_learn)  
  },
  on_finish: function(data) {
    data.trial_type = 'Replication';
    data.phase = 'Practice'
    data.stimulus='text'
    attentioncheck(intro_prac1_learn,a=1,1,0,intro_prac1_learn)
  }
}

var learn_prac2_phase = {
  type: 'html-keyboard-responsefl',
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  stimulus:create_learning_trial(['story_example_03.png'],['story_example_04.png'],0),
  stimulus_duration:3000,
  trial_duration:3000,
  data: {ignore: true},
  on_finish: function(data) {
    data.trial_type = 'Replication';
    data.phase = 'Practice'
    data.stimulus='text'
    attentioncheck(intro_prac2_learn,a=1,1,0,intro_prac2_learn)
  }
}

// learning phase
var curr_learning_trial=0
var colordetretime=colorStart()
var removecolor=colorStop(colordetretime)
var timetakenforpluswindow=removecolor

var warning_page={
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  trial_duration:3000,
  stimulus: '<h1 style="color: red;">Please make sure to respond to the questions.</h1><br><h1 style="color: red;">Continued failure to respond will</h1><br><h1 style="color: red;">result in the task ending early</h1><br><h1 style="color: red;">The experiment will resume in 3 seconds</h1>',
  on_finish: function(data) {
    data.trial_type='Replication'
    data.stimulus='warning'
    warning=warning+1
  }
}

let learn_rt = NaN
let learn_duration = NaN
let learn_accuracy = NaN
let learn_kp = NaN

var thecrossant= {
  type: 'html-keyboard-response',
  choices: ['1','2'],
  stimulus_height: 100,
  stimulus_width: 100,
  stimulus_duration: 500,
  trial_duration: 500,
  response_ends_trial: false,
  stimulus:create_learningcolor_trial(curr_learning_trial,pluscolor[curr_learning_trial]),
  data: {ignore: true},
  prompt:parse("<br><br><style>body {background-color: #ffff;}</style>"),
  on_finish: function(data) {
    data.stimulus='text'
    data.trial_type='Replication'
    kp=data.key_press
    learn_duration = data.time_elapsed
    learn_rt = data.rt

  }
}
learningcorrectness = []
var thecrossant_black={
  type: 'html-keyboard-response',
  choices: ['1','2'],
  stimulus_height: 100,
  stimulus_width: 100,
  stimulus_duration: 2000-removecolor,
  trial_duration: 2000-removecolor,
  response_ends_trial: false,
  stimulus:create_memory_ten('black'),
  prompt:parse("<br><br><style>body {background-color: #ffff;}</style>"),
  data: {ignore: true},
  on_finish: function(data) {
    data.trial_type ='Replication'
    data.stimulus='text'
    op=data.key_press
    if (kp){
      data.rt=null
      learn_kp = kp - 48
      
    if(kp!=pluscheck[curr_learning_trial]) {
      checkfail=checkfail+1
      learn_accuracy = 0
      learningcorrectness.push(0)
      if(checkfail>=checkthreshold&&checkfail<4){
        jsPsych.endCurrentTimeline(),
        jsPsych.addNodeToEndOfTimeline({
          timeline: [warning_page,thecrossant_break],
        }, jsPsych.resumeExperiment)
      }else if(checkfail>4){
        jsPsych.endCurrentTimeline(),
        jsPsych.addNodeToEndOfTimeline({
        timeline:[TaskFailed],},jsPsych.resumeExperiment)
        //end experiment
      }
    }else{
      checkfail=0
      learn_accuracy = 1
      learningcorrectness.push(1)
    }
  }else if(op){
    learn_duration = data.time_elapsed
    learn_kp = op - 48
    data.rt=data.rt+100+timetakenforpluswindow
    learn_rt=data.rt+100+timetakenforpluswindow
    if(op!=pluscheck[curr_learning_trial]) {
      checkfail=checkfail+1
      learn_accuracy = 0
      learningcorrectness.push(0)
      if(checkfail>=checkthreshold&&checkfail<4){
        jsPsych.endCurrentTimeline(),
        jsPsych.addNodeToEndOfTimeline({
          timeline: [warning_page,thecrossant_break],
        }, jsPsych.resumeExperiment)
      }else if(checkfail>4){
        jsPsych.endCurrentTimeline(),
        jsPsych.addNodeToEndOfTimeline({
        timeline:[TaskFailed],},jsPsych.resumeExperiment)
        //end experiment
      }
    }else{
      checkfail=0
      learn_accuracy = 1
      learningcorrectness.push(1)
    }
  }else{
    learn_duration = data.time_elapsed
    learn_rt = -1
    learn_kp = -1
    learn_accuracy = 0
    checkfail=checkfail+1
    if(checkfail>=checkthreshold&&checkfail<4){
      jsPsych.endCurrentTimeline(),
      jsPsych.addNodeToEndOfTimeline({
        timeline: [warning_page,thecrossant_break],
        }, jsPsych.resumeExperiment)
    }else if(checkfail>4){
      jsPsych.endCurrentTimeline(),
      jsPsych.addNodeToEndOfTimeline({
      timeline:[TaskFailed],},jsPsych.resumeExperiment)
      //end experiment
    }
  }
  let learnsum = 0;
    learningcorrectness.forEach(function(value) {
      learnsum += value;
    });

}
}

var TaskFailed = {
  type: 'html-keyboard-response',
  stimulus: '<p>Unfortunately, you do not qualify to continue this experiment.</p>' +
            '<p>Please press <strong>Escape</strong> to close the window. You will be paid for your time up to now.</p>',
  choices: ['Esc'],
  on_finish: function(data){
    window.close();
  }
};


let dir_instruction_number=1
let intro_dir=create_instruct(dir_instruct,dir_instructnames,dir_instruction_number,directmemory_phase,a='dir_')

var thecrossant_break={
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  stimulus_height: 100,
  stimulus_width: 100,
  stimulus_duration: 100,
  trial_duration: 100,
  response_ends_trial: false,
  stimulus:create_memory_ten('black'),
  prompt:parse("<br><br><style>body {background-color: #ffff;}</style>"),
  on_finish: function(data) {
    data.subject_id = useridtouse
    data.trial_type = "Replication"
    data.condition = sequence
    data.phase = 'Study'
    data.node_l = learn_node_left[curr_learning_trial]
    data.node_c = NaN // For direct memory
    data.node_r = learn_node_right[curr_learning_trial]
    data.node_1 = NaN // For direct memory
    data.node_2 = NaN // For direct memory
    data.node_3 = NaN // For direct memory
    data.dist_l = NaN // For judgement
    data.dist_r = NaN // For judgement
    data.dist_1 = NaN // For direct memory
    data.dist_2 = NaN // For direct memory
    data.dist_3 = NaN // For direct memory
    data.img_l = learn_left[curr_learning_trial]
    data.img_c = room_direct_up[curr_direct_trial]
    data.img_r = learn_right[curr_learning_trial]
    data.img_1 = NaN // For direct memory
    data.img_2 = NaN // For direct memory
    data.img_3 = NaN // For direct memory
    data.trial_timestamp	= img_pres_duration / 1000
    data.choice_timestamp = learn_duration / 1000
    data.response_timestamp = (learn_rt + learn_duration) / 1000
    data.response_delay = data.choice_timestamp - data.trial_timestamp
    data.response_key = learn_kp 
    data.response = learn_kp - 1
    data.accuracy = learn_accuracy
    data.node_correct = NaN // For direct memory and judgement
    data.too_quick = NaN // For direct memory and judgement
    data.stimulus = 'text'

    timetakenforpluswindow=removecolor
    colordetretime=colorStart()
    removecolor=colorStop(colordetretime)
    learn_phase_color.stimulus_duration= removecolor
    learn_phase_color.trial_duration=removecolor
    thecrossant_black.stimulus_duration= 2000-removecolor
    thecrossant_black.trial_duration=2000-removecolor
    curr_learning_trial=curr_learning_trial+1,
    learn_phase.stimulus=create_learning_trial(learn_left,learn_right,curr_learning_trial)
    learn_phase.trial_duration=3000
    learn_phase.stimulus_duration=3000
    thecrossant_black.stimulus=create_memory_ten('black')
    thecrossant.stimulus=create_learningcolor_trial(curr_learning_trial,pluscolor[curr_learning_trial])
    attentioncheck_learningphase(learn_phase,sfa,curr_learning_trial,n_learning_trial,intro_dir,thecrossant,thecrossant_black,thecrossant_break)
    
  }
}

function createbreak(intro_dir,instructnames,directmemory_phase){
  let thebreak= {
    type: 'html-keyboard-response',
    choices:jsPsych.NO_KEYS,
    trial_duration: 100,
    stimulus:'<p></p>',
    data: {ignore: true},
    on_finish: function(data) {
      data.trial_type='Replication'
      data.stimulus = 'text'
      timelinepresent(intro_dir,instructnames,directmemory_phase)
    }
  }
  return thebreak
}
var img_pres_duration = NaN
var learn_phase = {
  type: 'html-keyboard-responsefl',
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  stimulus:create_learning_trial(learn_left,learn_right,curr_learning_trial),
  stimulus_duration:3000,
  trial_duration:3000,
  data: {ignore: true},
  on_finish: function(data) {
    data.trial_type = 'Replication';
    data.stimulus='text'
    sfa=1
    img_pres_duration = data.time_elapsed
  }
}

var learn_phase_color = {
  type: 'html-keyboard-responsefl',
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  stimulus:create_memory_ten(),
  stimulus_duration:removecolor,
  trial_duration:removecolor,
  data: {ignore: true},
  on_finish: function(data) {
    data.stimulus='text'
    data.trial_type = 'Replication';
    sfa=1
  }
}

learn_phase_break = {
  type: 'html-keyboard-response',
      stimulus:  `
        <div id="break-container" style="font-size: 24px; max-width: 800px; margin: auto; text-align: center;">
          <p><strong>Please take a short (up to 60 seconds) break.</strong></p>
          <p>Use this time to stretch and reset. After the break, you will continue to learn more flights.</p>
          <p>If you would like to resume without a break, press the <strong>spacebar</strong>.</p>
          <p>Otherwise, the screen will advance automatically after 60 seconds.</p><br><br><br>
          <p><strong>Time remaining: <span id="countdown">60</span> seconds</strong></p>
        </div>
      `,
      choices: ['spacebar'],
      trial_duration: 60000, // 60 seconds
      response_ends_trial: true,
      data: {ignore: true},
  on_load: function() {
    let countdown = 60;
    const countdownEl = document.getElementById('countdown');
    const interval = setInterval(() => {
      countdown--;
      if (countdownEl) countdownEl.textContent = countdown;
      if (countdown <= 0) clearInterval(interval);
    }, 1000);
  },
  on_finish: function(data) {
    data.stimulus='text'
    data.trial_type = 'Replication';
  }
}

learn_phase_end_break = {
  type: 'html-keyboard-response',
      stimulus: `
        <div style="font-size: 24px; max-width: 800px; margin: auto; text-align: center;">
          <p><strong>Thank you for completing the first part of your job. Please take a short (up to 60 seconds) break.</strong></p>
          <p>Use this time to stretch and reset. After the break, you will continue to the next part of your job.</p>
          <p>If you would like to resume without a break, press the <strong>spacebar</strong>.</p>
          <p>Otherwise, the screen will advance automatically after 60 seconds.</p><br><br><br>
          <p><strong>Time remaining: <span id="countdown2">60</span> seconds</strong></p>
        </div>
      `,
      choices: ['spacebar'],
      trial_duration: 60000, // 60 seconds
      data: {ignore: true},
      response_ends_trial: true,
  on_load: function() {
    let countdown = 60;
    const countdownEl = document.getElementById('countdown2');
    const interval = setInterval(() => {
      countdown--;
      if (countdownEl) countdownEl.textContent = countdown;
      if (countdown <= 0) clearInterval(interval);
    }, 1000);
  },
  on_finish: function(data) {
    data.stimulus='text'
    data.trial_type = 'Replication';
  }
}


// learning phase end
var directcorrectness = []


//goal directed planning
var phase3 = {}
//Goal directed planning
function createPhase3(numberoftrial){
  var phase3 = {}
  for (let i = 0; i < numberoftrial; i++){
    if (i==numberoftrial-1){
      phase3[i] = {
        type: 'html-keyboard-response',
        stimulus: phasethreeroom[0],
        choices: jsPsych.NO_KEYS, // Disable keyboard responses
        // on_load: function() {
        //   document.getElementById('nextButton').style.display = 'block'
        //   document.getElementById('nextButton').addEventListener('click', function() {
        //     jsPsych.finishTrial(); // End trial on button click
        //   });
        // },
        on_finish: function (data) {
          data.trial_type='Replication'
          data.phase = "Goal Directed Planning"
          data.stimulus = `GDP-${i}`
          data.imgL_ID = leftName
          data.imgR_ID = rightName
          data.linedress=''
          if (detourLocationMap[i]) {
            // Safely check and log for specificline_saved
            if (specificline_saved && Object.keys(specificline_saved).length > 0) {
              for (const key in specificline_saved) {
                data.linedressed += specificline_saved[key].name + 
                  ':[x1:' + specificline_saved[key].location.x1 + 
                  ' x2:' + specificline_saved[key].location.x2 + 
                  ' y1:' + specificline_saved[key].location.y1 + 
                  ' y2:' + specificline_saved[key].location.y2 + ']';
              }
            } else {
              console.log(`specificline_saved is empty or undefined in trial ${i}`);
            }
          
            // Safely check and log for specificline
            if (specificline && Object.keys(specificline).length > 0) {
              for (const key in specificline) {
                data.linedressed_detor += specificline[key].name + 
                  ':[x1:' + specificline[key].location.x1 + 
                  ' x2:' + specificline[key].location.x2 + 
                  ' y1:' + specificline[key].location.y1 + 
                  ' y2:' + specificline[key].location.y2 + ']';
              }
            } else {
              console.log(`specificline is empty or undefined in trial ${i}`);
            }
          
            data.detour_trial = true;
            console.log(`Trial ${i} is a detour trial`);
            
          } else {
            // Safely check and log for specificline
            if (specificline && Object.keys(specificline).length > 0) {
              for (const key in specificline) {
                data.linedressed += specificline[key].name + 
                  ':[x1:' + specificline[key].location.x1 + 
                  ' x2:' + specificline[key].location.x2 + 
                  ' y1:' + specificline[key].location.y1 + 
                  ' y2:' + specificline[key].location.y2 + ']';
              }
            } else {
              console.log(`specificline is empty or undefined in trial ${i}`);
            }
          
            data.detour_trial = false;
          }
          if (goaldirIndex[numberoftrial] < twoEdgePair.length){
            data.edge_condition = 'Three Edge Diff'
          } else if (goaldirIndex[numberoftrial] >= twoEdgePair.length && goaldirIndex[numberoftrial] < twoEdgePair.length + threeEdgePair.length){
            data.edge_condition = 'Four Edge Diff'
          } else if (goaldirIndex[numberoftrial] >=twoEdgePair.length + threeEdgePair.length &&  goaldirIndex[numberoftrial] < twoEdgePair.length + threeEdgePair.length + fourEdgePair.length){
            data.edge_condition = 'Five Edge Diff'
          }else if (goaldirIndex[numberoftrial] >= threeEdgePair.length + fourEdgePair.length + fiveEdgePair.length+twoEdgePair.length){
            data.edge_condition = 'Six Edge Diff'
          }
          gdp_init(),
          jsPsych.addNodeToEndOfTimeline({
            timeline: [intro_graph],
          }, jsPsych.resumeExperiment)
          specificline_saved={};
          detourcity_name=[];
        }
      }
    }else{
      phase3[i] = {
        type: 'html-keyboard-response',
        stimulus: phasethreeroom[0],
        choices: jsPsych.NO_KEYS, // Disable keyboard responses
        // on_load: function() {
        //   document.getElementById('nextButton').addEventListener('click', function() {
        //     jsPsych.finishTrial(); // End trial on button click
        //   });
        // },
        on_finish: function (data) {
          data.trial_type = "Replication"
          data.phase='Goal Directed Planning'
          data.stimulus = `GDP-${i}`
          data.imgL_ID = leftName
          data.imgR_ID = rightName
          data.linedress=''
          if (detourLocationMap[i]) {
            // Safely check and log for specificline_saved
            if (specificline_saved && Object.keys(specificline_saved).length > 0) {
              for (const key in specificline_saved) {
                data.linedressed += specificline_saved[key].name + 
                  ':[x1:' + specificline_saved[key].location.x1 + 
                  ' x2:' + specificline_saved[key].location.x2 + 
                  ' y1:' + specificline_saved[key].location.y1 + 
                  ' y2:' + specificline_saved[key].location.y2 + ']';
              }
            } else {
              console.log(`specificline_saved is empty or undefined in trial ${i}`);
            }
          
            // Safely check and log for specificline
            if (specificline && Object.keys(specificline).length > 0) {
              for (const key in specificline) {
                data.linedressed_detor += specificline[key].name + 
                  ':[x1:' + specificline[key].location.x1 + 
                  ' x2:' + specificline[key].location.x2 + 
                  ' y1:' + specificline[key].location.y1 + 
                  ' y2:' + specificline[key].location.y2 + ']';
              }
            } else {
              console.log(`specificline is empty or undefined in trial ${i}`);
            }
          
            data.detour_trial = true;
            console.log(`Trial ${i} is a detour trial`);
            
          } else {
            // Safely check and log for specificline
            if (specificline && Object.keys(specificline).length > 0) {
              for (const key in specificline) {
                data.linedressed += specificline[key].name + 
                  ':[x1:' + specificline[key].location.x1 + 
                  ' x2:' + specificline[key].location.x2 + 
                  ' y1:' + specificline[key].location.y1 + 
                  ' y2:' + specificline[key].location.y2 + ']';
              }
            } else {
              console.log(`specificline is empty or undefined in trial ${i}`);
            }
          
            data.detour_trial = false;
          }
          
          if (goaldirIndex[numberoftrial] < twoEdgePair.length){
            data.edge_condition = 'Three Edge Diff'
          } else if (goaldirIndex[numberoftrial] >= twoEdgePair.length && goaldirIndex[numberoftrial] < twoEdgePair.length + threeEdgePair.length){
            data.edge_condition = 'Four Edge Diff'
          } else if (goaldirIndex[numberoftrial] >=twoEdgePair.length + threeEdgePair.length &&  goaldirIndex[numberoftrial] < twoEdgePair.length + threeEdgePair.length + fourEdgePair.length){
            data.edge_condition = 'Five Edge Diff'
          }else if (goaldirIndex[numberoftrial] >= threeEdgePair.length + fourEdgePair.length + fiveEdgePair.length+twoEdgePair.length){
            data.edge_condition = 'Six Edge Diff'
          }
          gdp_init(),
          phase3[i+1].stimulus = `<div id='displayhelp' style='display:none'><p>Click and drag the locations to the gray box to make your flight plans`
            +`<br /> you can 'book' flights by clicking on the two cities in order <br> You can remove flights by clicking on a city and clicking the return arrow on the bottom right of the gray box <br> once you are finished, press the 'submit' button to book the next client</p></div><button id='batman' style='display: block;margin: 0 auto;padding: 10px 20px;background-color: #4CAF50;color: black;border: none;border-radius: 8px;font-size: 16px;cursor: pointer;box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);transition: background-color 0.3s ease;', onclick='initiatep3()'>Click to start</button><div id='spiderman' style='display: none;'><button id='nextButton' style='display: block; padding: 10px 20px; background-color: #4CAF50; color: black; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;'>Submit</button>`
            +`<div id='Phase3Body'><br><div id='div2'  style='width: 700px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa;'><img id='drag01' src='../static/images/${imageList[0]}' alt='Aliance'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag02' src='../static/images/${imageList[1]}' alt='Boulder'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag03' src='../static/images/${imageList[2]}' alt='Cornwall'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag04' src='../static/images/${imageList[3]}' alt='Custer'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag05' src='../static/images/${imageList[4]}' alt='DelawareCity'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag06' src='../static/images/${imageList[5]}' alt='Medora'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag07' src='../static/images/${imageList[6]}' alt='Newport'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag08' src='../static/images/${imageList[7]}' alt='ParkCity'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag09' src='../static/images/${imageList[8]}' alt='Racine'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag10' src='../static/images/${imageList[9]}' alt='Sitka'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag11' src='../static/images/${imageList[10]}' alt='WestPalmBeach'width='100' height='120' draggable='true' ondragstart='drag(event)'><img id='drag12' src='../static/images/${imageList[11]}' alt='Yukon'width='100' height='120' draggable='true' ondragstart='drag(event)'>`
            +`<img id='drag13' src='../static/images/${imageList[12]}' alt='Yukon'width='100' height='120' draggable='true' ondragstart='drag(event)'></div><div id='div1' style='width: 1200px; height: 400px; margin: 0 auto; position: relative; bottom: 10%; border: 1px solid #aaaaaa; background-color: lightgray;'ondrop='drop(event)' ondragover='allowDrop(event)'><div id='div3' style='width: 1200px; height: 400px; margin: 0 auto; position: relative; '></div><img id='imgL' style='position:relative;right:450px;bottom: 250px;border:2px solid blue' width='100' height='120'><img id='imgR' style='position:relative;left:450px;bottom: 250px;border:2px solid blue' width='100' height='120'><img id='return' src='../static/images/return.png' style='position: relative;left: 450px;bottom: 100px ;border: 2px solid black' width='50'height='50'> <button id='nextButton' style='display: none; padding: 10px 20px; background-color: #4CAF50; color: black; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;'>Submit</button></div></div></div>`
          ,        
          jsPsych.addNodeToEndOfTimeline({
            timeline: [phase3[i+1]],
          }, jsPsych.resumeExperiment)
          specificline_saved={};
          detourcity_name=[];
        }
      }
    }
  }
  return phase3
}


phase3=createPhase3(n_goaldir_trial)


//recon phase
function recon_createPhase3(numberoftrial){
  var recon_phase3 = {}
  for (let i = 0; i < numberoftrial; i++){
    if (i==numberoftrial-1){
      recon_phase3[i] = {
        type: 'html-keyboard-response',
        stimulus: recon_phasethreeroom[0],
        choices: jsPsych.NO_KEYS, // Disable keyboard responses
        // on_load: function() {
        //   document.getElementById('nextButton').style.display = 'block'
        //   document.getElementById('nextButton').addEventListener('click', function() {
        //     jsPsych.finishTrial(); // End trial on button click
        //   });
        // },
        on_start:function(){
          save_data()
        },
        on_finish: function (data) {
          data.trial_type='Replication'
          data.phase='Graph Reconstruction'
          data.linedress=''
          for (const key in specificline) {
              data.linedressed += specificline[key].name+':[x1:'+specificline[key].location.x1+' x2:'+specificline[key].location.x2+' y1:'+specificline[key].location.y1+' y2:'+specificline[key].location.y2+']'
          }
          // if (goaldirIndex[numberoftrial] < threeEdgePair.length){
          //   data.condition = 'Three Edge Diff'
          // } else if (goaldirIndex[numberoftrial] >= threeEdgePair.length && goaldirIndex[numberoftrial] < threeEdgePair.length + fourEdgePair.length){
          //   data.condition = 'Four Edge Diff'
          // } else if (goaldirIndex[numberoftrial] >= threeEdgePair.length + fourEdgePair.length + fiveEdgePair.length){
          //   data.condition = 'Five Edge Diff'
          // }
          recon_init(),
          jsPsych.addNodeToEndOfTimeline({
            timeline: [end_questions,thank_you],
          }, jsPsych.resumeExperiment)
        }
      }
    }else{
      recon_phase3[i] = {
        type: 'html-keyboard-response',
        stimulus: recon_phasethreeroom[0],
        choices: jsPsych.NO_KEYS, // Disable keyboard responses
        // on_load: function() {
        //   document.getElementById('nextButton').addEventListener('click', function() {
        //     jsPsych.finishTrial(); // End trial on button click
        //   });
        // },
        on_finish: function (data) {
          data.trial_type='Replication'
          data.phase='Goal Directed Planning'
          data.linedress=''
          for (const key in specificline) {
              data.linedressed += specificline[key].name+':[x1:'+specificline[key].location.x1+' x2:'+specificline[key].location.x2+' y1:'+specificline[key].location.y1+' y2:'+specificline[key].location.y2+']'
          }
          recon_init(),
          jsPsych.addNodeToEndOfTimeline({
            timeline: [recon_phase3[i+1]],
          }, jsPsych.resumeExperiment)
        }
      }
    }
  }
  return recon_phase3
}

var recon_phase3=recon_createPhase3(1)

//recon phase end

//shortestpath
correctness = []
let mem_instruction_number=1
let intro_mem=create_instruct(mem_instruct,mem_instructnames,mem_instruction_number,phase3[0],a='mem_')
correctness = []

var curr_shortest_trial=0
var shortestpath_phase = {
  type: 'html-keyboard-response',
  choices: ['1','2'],
  response_ends_trial: true,
  stimulus:create_shortestpath_trial(room_shortest_up,room_shortest_left,room_shortest_right,curr_shortest_trial),
  stimulus_duration:7500,
  trial_duration:7500,
  on_load: function() {
  },
  on_finish: function(data) {
  
    let onedifflength = 24
    let twodifflength = 24
    let threedifflength = 24
    let fourdifflength = 12

    if (cumulativearr[curr_shortest_trial] < onedifflength){
      data.edge_condition = 'One Edge Diff'
    } else if (cumulativearr[curr_shortest_trial] >= onedifflength && cumulativearr[curr_shortest_trial] < onedifflength + twodifflength){
      data.edge_condition = 'Two Edge Diff'
    } else if (cumulativearr[curr_shortest_trial] >= onedifflength + twodifflength && cumulativearr[curr_shortest_trial] < onedifflength + twodifflength + threedifflength){
      data.edge_condition = 'Three Edge Diff'
    } else if (cumulativearr[curr_shortest_trial] >= onedifflength + twodifflength + threedifflength){
      data.edge_condition = 'Four Edge Diff'
    }

    if (cumulativearr[curr_shortest_trial] < shuffled_twothree.length){
      data.specific_pairs = "Two Edge Three Edge"
    } else if (cumulativearr[curr_shortest_trial] >= shuffled_twothree.length && cumulativearr[curr_shortest_trial] < shuffled_twothree.length + shuffled_threefour.length){
      data.specific_pairs = 'Three Edge Four Edge'
    } else if (cumulativearr[curr_shortest_trial] >= shuffled_twothree.length + shuffled_threefour.length && cumulativearr[curr_shortest_trial] < shuffled_twothree.length + shuffled_threefour.length + shuffled_fourfive.length){
      data.specific_pairs = 'Four Edge Five Edge'
    } else if (cumulativearr[curr_shortest_trial] >= shuffled_twothree.length + shuffled_threefour.length + shuffled_fourfive.length && cumulativearr[curr_shortest_trial] < onedifflength){
      data.specific_pairs = 'Five Edge Six Edge'

    } else if (cumulativearr[curr_shortest_trial] >= onedifflength && cumulativearr[curr_shortest_trial] < onedifflength + shuffled_twofour.length){
      data.specific_pairs = 'Two Edge Four Edge'
    } else if (cumulativearr[curr_shortest_trial] >= onedifflength + shuffled_twofour.length && cumulativearr[curr_shortest_trial] < onedifflength + shuffled_twofour.length + shuffled_threefive.length){
      data.specific_pairs = 'Three Edge Five Edge'
    } else if (cumulativearr[curr_shortest_trial] >= onedifflength + shuffled_twofour.length + shuffled_threefive.length && cumulativearr[curr_shortest_trial] < onedifflength + twodifflength){
      data.specific_pairs = 'Four Edge Six Edge'

    } else if (cumulativearr[curr_shortest_trial] >= onedifflength + twodifflength && cumulativearr[curr_shortest_trial] < onedifflength + twodifflength + shuffled_twofive.length){
      data.specific_pairs = 'Two Edge Five Edge'
    } else if (cumulativearr[curr_shortest_trial] >= onedifflength + twodifflength + shuffled_twofive.length && cumulativearr[curr_shortest_trial] < onedifflength + twodifflength + threedifflength){
      data.specific_pairs = 'Three Edge Six Edge'
    }

    else if (cumulativearr[curr_shortest_trial] >= onedifflength + twodifflength + threedifflength){
      data.specific_pairs = 'Two Edge Six Edge'
    }

    infKP += 1
    if (infKP==1){
      // Start the timer
      timer = 0;
      infINT = setInterval(() => {
          timer++;;
      }, 1000);
    }
    if (infKP == 4 && timer < 4) {
      clearInterval(infINT)
      jsPsych.addNodeToEndOfTimeline({
      timeline: [too_quick],
      }, jsPsych.resumeExperiment)
      infKP = -1
      timer = 0;
      too_quick += 1
    } else if ((infKP <= 4 && timer >= 4)){
      infKP = 0
      clearInterval(infINT);
      timer = 0
    }

    if (data.rt && data.rt < 300) {
      jsPsych.addNodeToEndOfTimeline({
        timeline: [too_quick],
        }, jsPsych.resumeExperiment)
    }

    data.subject_id = useridtouse
    data.trial_type = "Replication"
    data.condition = sequence
    data.phase = 'Judgement'
    data.node_l = shortest_node_left[curr_shortest_trial]
    data.node_c = shortest_node_up[curr_shortest_trial]
    data.node_r = shortest_node_right[curr_shortest_trial]
    data.node_1 = NaN
    data.node_2 = NaN
    data.node_3 = NaN
    data.dist_l = distance_short_left[curr_shortest_trial]
    data.dist_r = distance_short_right[curr_shortest_trial]
    data.dist_1 = NaN
    data.dist_2 = NaN
    data.dist_3 = NaN
    data.img_l = room_shortest_left[curr_shortest_trial]
    data.img_c = room_shortest_up[curr_shortest_trial]
    data.img_r = room_shortest_right[curr_shortest_trial]
    data.img_1 = NaN
    data.img_2 = NaN
    data.img_3 = NaN
    data.trial_timestamp	= data.time_elapsed / 1000
    data.choice_timestamp = data.time_elapsed / 1000
    data.response_timestamp = (data.rt + data.time_elapsed) / 1000
    data.response_delay = 0
    data.response_key = data.key_press - 48
    data.response = data.key_press - 49
    data.node_correct = shortest_node_correct[curr_shortest_trial]
    if ((data.key_press == 49 && data.node_l == data.node_correct)||
    (data.key_press == 50 && data.node_r == data.node_correct)) {
      data.accuracy = 1
    } else {
      data.accuracy = 0
    }
    data.stimulus = "text"
    data.too_quick = too_quick

    part2_sfa=data.key_press
    if (!part2_sfa){
      short_warning +=1
    }
    curr_shortest_trial=curr_shortest_trial+1
    shortestpath_phase.stimulus=create_shortestpath_trial(room_shortest_up,room_shortest_left,room_shortest_right,curr_shortest_trial)
    attentioncheck(shortestpath_phase,part2_sfa,curr_shortest_trial,n_shortest_trial,intro_mem,phase='short')
  }
}
//Shortest Path memory end
//Goal directed planning end

let short_instruction_number=1
let intro_short=create_instruct(short_instruct,short_instructnames,short_instruction_number,shortestpath_phase,a='short_')


// Survey
var end_questions = {
  type: 'survey-html-form',
  preamble: "<br><br><h1>Post-Task Survey</h1><p style='font-size: 16px'>Thank you for completing the task! We would like you to answer the following questions before the experiment ends. <br>Note: <span style='color: red;'>*</span> = required</p><hr>",
  html: survey_questions + `
        <button id="submit_end_questions" class="custom-button">Submit Answers</button><br><br>`,
  on_load: function() {
    document.querySelector('.jspsych-btn').style.display = 'none';
    document.getElementById("submit_end_questions").addEventListener("click", function(event) {
      
      event.preventDefault();
      problems = []
      for (i=0;i<3;i++){
          var response1=document.getElementsByName("smooth")[i].checked
          if (response1){
              smooth = document.getElementsByName("smooth")[i].value
          }
          var response2=document.getElementsByName("problems")[i].checked
          if (response2){
              problems.push(document.getElementsByName("problems")[i].value)
          }
      }
      
      distraction = document.getElementById("distraction").value
      strategies = document.getElementById("strategies").value
      easier = document.getElementById('easier').value
      similar = document.getElementById('similar').value
      comments = document.getElementById('comments').value
      let checked = validateForm()
      if (checked){
        jsPsych.finishTrial()
      }
  
  });
  },
  on_finish: function(data) {
    data.trial_type = "Replication"
    data.stimulus = "survey"
    data.problems = problems
    data.smooth = smooth
    data.distraction  = (distraction  || "").replace(/,/g, ';');
    data.strategies   = (strategies   || "").replace(/,/g, ';');
    data.easier       = (easier       || "").replace(/,/g, ';');
    data.similar      = (similar      || "").replace(/,/g, ';');
    data.comments     = (comments     || "").replace(/,/g, ';');
  }
};

function validateForm() {
  const requiredFields = document.querySelectorAll("[required]");
  let allFilled = true;
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      allFilled = false;
      field.style.border = "2px solid red";
    } else {
      field.style.border = "";
    }
  });
  return true;
}

var problems = []
var smooth = 0 
var distraction = 0 
var strategies = 0 
var easier = 0 
var similar = 0 
var comments = 0 

//graph reconstruction instruction start
let graph_instruction_number=1
let intro_graph=create_instruct(graph_instruct,graph_instructnames,graph_instruction_number,recon_phase3[0],a='graph_')
//graph reconstruction instruction finish

// final thank you
var thank_you = {
  type: 'html-keyboard-response',
  choices: ['space'],
  stimulus: "<p> Congratulations, you are all done!</p><p>The secret code to enter at the beginning screen is: CFQ53IVT</p><p> Please make sure to submit the HIT and email uciccnl@gmail.com if you had any issues! </p>",
  on_start: function(data){
    save_final_deter='final',
    jsPsych.data.get().filter({ignore: true}).ignore();
    save_data(),
    markVersion2AsFinished()
    // Remove the listeners
    document.removeEventListener("keydown", blockRefresh);
    window.removeEventListener("beforeunload", blockUnload);
  },
  on_finish: function (data) {
    data.trial_type = 'End';
    data.stimulus = 'text'
    data.detectfocus = detectfocus;
    jsPsych.data.get().filter({ignore: true}).ignore();
    save_data(true)
  }
}

//instruction section
let instruction_number=1
let intro_learn=create_instruct(instruct,instructnames,instruction_number,learn_prac1_phase)
let prac1_num=1
let intro_prac1_learn=create_instruct(instructprac1,instructprac1names,prac1_num,learn_prac2_phase,a='prac_')
let prac2_num=1
let intro_prac2_learn=create_instruct(instructprac2,instructprac2names,prac2_num,prac_attentioncheck_blackplus,a='prac2_')


//time line here
timeline.push(welcome,enterFullscreen)
timeline.push(intro_learn)
//debug
// timelinepushintro(intro_learn,instructnames)
// timeline.push(prac_attentioncheck_blackplus)
// timeline.push(learn_phase)
// timeline.push(learn_phase_color,thecrossant,thecrossant_black,thecrossant_break)

jsPsych.init({
  timeline: timeline,
  preload_images: all_images,
  max_load_time: 600000,
  on_finish: function () {
    /* Retrieve the participant's data from jsPsych */
    // Determine and save participant bonus payment
    psiturk.recordUnstructuredData("subject_id", subject_id);
    save_data(true)
  },
})
