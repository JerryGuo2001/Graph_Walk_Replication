var debug_mode = 0; // debug mode determines how long the blocks are, 5 sec in debug mode, 5 minutes in actual experiment
//var data_save_method = 'csv_server_py';
var data_save_method = 'csv_server_py';

// Will be set to true when experiment is exiting fullscreen normally, to prevent above end experiment code
var normal_exit = false;
var window_height = window.screen.height;



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
    data.trial_type = "id_enter"
    window.useridtouse=data.responses
    window.useridtouse = useridtouse.split('"')[3];
    subject_id=useridtouse
  }
}
//welcome page end

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
  on_finish: function() {
      // Trigger fullscreen mode when the button is clicked
      document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
  }
};
// Fullscreen end

//Instruction page
function createinstruct(instruct_1,number){
  var intro={
    type: 'html-keyboard-response',
    choices: ['space'],
    stimulus: instruct_1,
    on_finish: function (data) {
      data.trial_type = 'intro_'+number;
      data.stimulus='instruct'
    }
  }
  return intro
}

function createfulintro(instruct,instructnames){
  intro={}
for (let i = 0; i < instructnames.length; i++) {
  instructname=instructnames[i]
  intro[i] = createinstruct(instruct[instructname],i)
}return intro
}


intro_learn=createfulintro(instruct,instructnames)
intro_mem=createfulintro(mem_instruct,mem_instructnames)
intro_dir=createfulintro(dir_instruct,dir_instructnames)
intro_short=createfulintro(short_instruct,short_instructnames)

//Instruction page end


  //practice attention check
var ac_colorprepare=colorStart()
var ac_colorstop=colorStop(ac_colorprepare)
var ac_colorlist=['blue','green','green','blue','green','green','blue','green','blue','blue']
var ac_colornumber=0
var total_ac = 0
var correct_ac = 0
var ac_feedback = {}

var instruct_lastonebefore_practice={
  type: 'html-keyboard-response',
  choices: ['spacebar'],
  stimulus: `
  <div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>
  You will have 1 second from when the cross flashes blue or green to respond, so please respond quickly. 
  If you miss several responses in a row, the experiment will quit early. However, remember that while you should pay attention to the center cross changing colors, 
  it is most important that you memorize the pairs (using the strategy we practiced earlier). You will NOT have to memorize the color changes. The task will begin once you press space.
  <p style= 'font-size:25px;margin-top:100px'>[press the spacebar to start]</p>
   `,
  on_finish: function (data) {
    data.trial_type = 'last_instruct';
    data.stimulus='instruct'
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
  on_finish: function(data) {
    data.trial_type='prac_atten_color_black'
    data.stimulus='black_plus_sign'
    prac_attentioncheck_colorchange.stimulus=create_color_list(ac_colorlist[ac_colornumber])
    jsPsych.addNodeToEndOfTimeline({
      timeline: [prac_attentioncheck_colorchange],
    }, jsPsych.resumeExperiment)
  }
}
var csfa=[]

//attention check color cross
function create_color_list(color) {
  return parse("<p style='position:absolute;top: 50%;right: 50%;transform: translate(50%, -50%);font-size: 125px;color: %s;'>\u002B</p>"
  ,color)
}

var prac_attentioncheck_colorchange={
  type: 'html-keyboard-responsefl',
  choices: ['1','2'],
  response_ends_trial: false,
  stimulus:create_color_list(ac_colorlist[ac_colornumber]),
  stimulus_duration:ac_colorstop,
  trial_duration:ac_colorstop,
  on_finish: function(data) {
    data.trial_type = 'prac_atten_color';
    data.stimulus = 'prac_stop_color'
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
  stimulus:create_memory_ten(),
  prompt:parse("<br><br><style>body {background-color: #ffff;}</style>"),
  on_finish: function(data) {
    data.trial_type='prac_atten_color_black'
    data.stimulus='black_plus_sign'
    if(ac_colornumber<ac_colortotal){
      if (csfa==49&&ac_colorlist[ac_colornumber]=='blue'){
        correct_ac += 1
        jsPsych.addNodeToEndOfTimeline({
          timeline: [prac_attentioncheck_blackplus],
        }, jsPsych.resumeExperiment)
      }else if (csfa==50&&ac_colorlist[ac_colornumber]=='green'){
        correct_ac += 1
        jsPsych.addNodeToEndOfTimeline({
          timeline: [prac_attentioncheck_blackplus],
        }, jsPsych.resumeExperiment)
      }else if (data.key_press==49&&ac_colorlist[ac_colornumber]=='blue'){
        correct_ac += 1
        jsPsych.addNodeToEndOfTimeline({
          timeline: [prac_attentioncheck_blackplus],
        }, jsPsych.resumeExperiment)
      }else if (data.key_press==50&&ac_colorlist[ac_colornumber]=='green'){
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
      if (csfa==49&&ac_colorlist[ac_colornumber]=='blue' || csfa==50&&ac_colorlist[ac_colornumber]=='green' || data.key_press==49&&ac_colorlist[ac_colornumber]=='blue' || data.key_press==49&&ac_colorlist[ac_colornumber]=='green') {
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
        console.log("Try Again button clicked!");
      });
    },
    on_finish: function(data) {
      data.trial_type = 'attentioncheck_feedback';
      data.stimulus = 'cross_check_feedback';
      data.failed_practice = kickout_record
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
      data.trial_type = 'attentioncheck_feedback';
      data.stimulus = 'cross_check_feedback';
    }
  };
}
}



var helpofattentioncheck={
  type: 'html-keyboard-response',
  choices: ['spacebar'],
  stimulus: "<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 30px;line-height:1.5'>It seems you got one wrong. Remember, for the cross below:</p><img src= '../static/images/isi.png' width='150' height='150'><p style ='font-size: 30px;line-height:1.5'>If the cross flashes <span style='color: blue;'>blue,</span> press the '1' key on your keyboard, if it flashes <span style='color: green;'>green,</span> press '2'.<p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
  on_finish: function (data) {
    data.trial_type = 'attentioncheck_help';
    data.stimulus='instruct'
  }
}

//practice attention check end


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
    data.trial_type='warning_page'
    data.stimulus='warning'
    warning=warning+1
  }
}


var thecrossant= {
  type: 'html-keyboard-response',
  choices: ['1','2'],
  stimulus_height: 100,
  stimulus_width: 100,
  stimulus_duration: 500,
  trial_duration: 500,
  response_ends_trial: false,
  stimulus:create_learningcolor_trial(curr_learning_trial,pluscolor[curr_learning_trial]),
  prompt:parse("<br><br><style>body {background-color: #ffff;}</style>"),
  on_finish: function(data) {
    data.stimulus=pluscolor[curr_learning_trial]
    data.stimulus_left=learn_left[curr_learning_trial]
    data.stimulus_right=learn_right[curr_learning_trial]
    data.trial_type='rt_plussign_withcolor'
    console.log(colordetretime)
    kp=data.key_press
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
  on_finish: function(data) {
    data.trial_type ='rt_thecrossant_black'
    data.stimulus='black_plus_sign'
    op=data.key_press
    if (kp){
      data.rt=null
    if(kp!=pluscheck[curr_learning_trial]) {
      checkfail=checkfail+1
      data.accuracy = 0
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
      data.accuracy = 1
      learningcorrectness.push(1)
    }
  }else if(op){
    data.rt=data.rt+100+timetakenforpluswindow
    if(op!=pluscheck[curr_learning_trial]) {
      checkfail=checkfail+1
      data.accuracy = 0
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
      data.accuracy = 1
      learningcorrectness.push(1)
    }
  }else{
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

    data.cumulative_accuracy = learnsum / learningcorrectness.length;
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
    data.trial_type='color_black'
    data.stimulus='black_plus_sign'
    timetakenforpluswindow=removecolor
    colordetretime=colorStart()
    removecolor=colorStop(colordetretime)
    learn_phase_color.stimulus_duration= removecolor
    learn_phase_color.trial_duration=removecolor
    thecrossant_black.stimulus_duration= 2000-removecolor
    thecrossant_black.trial_duration=2000-removecolor
    curr_learning_trial=curr_learning_trial+1,
    learn_phase.stimulus=create_learning_trial(learn_left,learn_right,curr_learning_trial)
    learn_phase.trial_duration=2000
    learn_phase.stimulus_duration=2000
    thecrossant_black.stimulus=create_memory_ten('black')
    thecrossant.stimulus=create_learningcolor_trial(curr_learning_trial,pluscolor[curr_learning_trial])
    attentioncheck_learningphase(learn_phase,sfa,curr_learning_trial,n_learning_trial,learn_break,thecrossant,thecrossant_black,thecrossant_break)
    
  }
}

function createbreak(intro_dir,instructnames,directmemory_phase){
  let thebreak= {
    type: 'html-keyboard-response',
    choices:jsPsych.NO_KEYS,
    trial_duration: 100,
    stimulus:'<p></p>',
    on_finish: function(data) {
      data.trial_type='thebreak'
      timelinepresent(intro_dir,instructnames,directmemory_phase)
    }
  }
  return thebreak
}

var learn_phase = {
  type: 'html-keyboard-responsefl',
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  stimulus:create_learning_trial(learn_left,learn_right,curr_learning_trial),
  stimulus_duration:2000,
  trial_duration:2000,
  on_finish: function(data) {
    data.trial_type = 'learn_phase(without_color)';
    data.stimulus='black_plus_sign'
    data.stimulus_left=learn_left[curr_learning_trial],
    data.stimulus_right=learn_right[curr_learning_trial],
    sfa=1
  }
}

var learn_phase_color = {
  type: 'html-keyboard-responsefl',
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  stimulus:create_memory_ten(),
  stimulus_duration:removecolor,
  trial_duration:removecolor,
  on_finish: function(data) {
    data.stimulus=pluscolor[curr_learning_trial]
    data.stimulus_left=learn_left[curr_learning_trial]
    data.stimulus_right=learn_right[curr_learning_trial]
    data.trial_type = 'black_cross(without_color)';
    sfa=1
  }
}

// learning phase end
var directcorrectness = []
//Direct Memory test
var curr_direct_trial=0
var directmemory_phase = {
  type: 'html-keyboard-responsefl',
  choices: ['1','2','3'],
  response_ends_trial: false,
  stimulus:create_direct_trial(room_direct_up,room_direct_left,room_direct_mid,room_direct_right,curr_direct_trial),
  stimulus_duration:6500,//5 second for now, we will discuss it 
  trial_duration:6500,//5 second for now 
  on_load: function() {
    let directResp = false
    document.addEventListener('keydown', function(event) {
      if (directResp) return;
      if (['1', '2', '3'].includes(event.key)) {
        directResp = true
        var selected_choice = event.key;
        var image_ids = ['img1', 'img2', 'img3'];
        image_ids.forEach(function(id) {
          var image = document.getElementById(id);
          if (image) {
            image.style.border = '';
          }
        });
        var selected_image = document.getElementById('img' + selected_choice);
        if (selected_image) {
          selected_image.style.border = '5px solid black';
        }
      
      
      }})
    // setTimeout(function() {
    //   for(let i = 0;i<document.getElementsByClassName('bottom').length;i++){
    //     document.getElementsByClassName('bottom')[i].style.visibility = 'visible';
    //   }
    // }, randomDelay);
  },
  on_finish: function(data) {
    data.trial_type = 'directmemory_phase';
    data.stimulus=room_direct_up[curr_direct_trial];
    data.stimulus_down_left=room_direct_left[curr_direct_trial],
    data.stimulus_down_mid=room_direct_mid[curr_direct_trial]
    data.stimulus_down_right=room_direct_right[curr_direct_trial];
    data.stimulus_correct=room_direct_correct[curr_direct_trial];
    data.stimulus_short=room_direct_short[curr_direct_trial];
    data.stimulus_far=room_direct_far[curr_direct_trial];
    if ((data.key_press == 49 && data.stimulus_down_left == data.stimulus_correct)||
    (data.key_press == 50 && data.stimulus_down_mid == data.stimulus_correct) ||(data.key_press == 51 && data.stimulus_down_right == data.stimulus_correct)) {
      data.accuracy = 1
      directcorrectness.push(1)
      data.weighted_accuracy = 1
    } else {
      data.accuracy = 0
      directcorrectness.push(0)
      data.weighted_accuracy = 0
    }

    if ((data.key_press == 49 && data.stimulus_down_left == data.stimulus_short)||
    (data.key_press == 50 && data.stimulus_down_mid == data.stimulus_short) ||(data.key_press == 51 && data.stimulus_down_right == data.stimulus_short)) {
      data.missedtrial = 'closer'
      data.weighted_accuracy = 0.5
    } else if ((data.key_press == 49 && data.stimulus_down_left == data.stimulus_far)||
    (data.key_press == 50 && data.stimulus_down_mid == data.stimulus_far) ||(data.key_press == 51 && data.stimulus_down_right == data.stimulus_far)) {
      data.missedtrial = 'closer'
      data.weighted_accuracy = 0.5
    }
    
    let directsum = 0;
    directcorrectness.forEach(function(value) {
      directsum += value;
    });

    data.cumulative_accuracy = directsum / directcorrectness.length;
    sfa=data.key_press,
    curr_direct_trial=curr_direct_trial+1,
    directmemory_phase.stimulus=create_direct_trial(room_direct_up,room_direct_left,room_direct_mid,room_direct_right,curr_direct_trial)
    attentioncheck(directmemory_phase,a=1,curr_direct_trial,n_direct_trial,short_break)
  }
}
//Direct Memory test end

correctness = []
//Shortest Path memory test
var curr_shortest_trial=0
var shortestpath_phase = {
  type: 'html-keyboard-responsefl',
  choices: ['1','2'],
  response_ends_trial: false,
  stimulus:create_shortestpath_trial(room_shortest_up,room_shortest_left,room_shortest_right,curr_shortest_trial),
  stimulus_duration:7500,
  trial_duration:7500,
  on_load: function() {
    let hasResponded = false;
    // Add border on response
    document.addEventListener('keydown', function(event) {
      if (hasResponded) return;
      if (['1', '2'].includes(event.key)) {
        hasResponded = true;
        var selected_choice = event.key;
        var image_ids = ['img1', 'img2'];
        image_ids.forEach(function(id) {
          var image = document.getElementById(id);
          if (image) {
            image.style.border = '';
          }
        });
        var selected_image = document.getElementById('img' + selected_choice);
        if (selected_image) {
          selected_image.style.border = '5px solid black';
        }
      }
    });
    // Reveal other rooms after 1500 ms
    // setTimeout(function() {
    //   for(let i = 0;i<document.getElementsByClassName('bottomshortest').length;i++){
    //     document.getElementsByClassName('bottomshortest')[i].style.visibility = 'visible';
    //   }
    // }, randomDelay);
  },
  on_finish: function(data) {
    data.trial_type = 'shortestpath_phase';
    data.stimulus=room_shortest_up[curr_shortest_trial];
    data.stimulus_left=room_shortest_left[curr_shortest_trial];
    data.stimulus_right=room_shortest_right[curr_shortest_trial]
    data.stimulus_correct=room_shortest_correct[curr_shortest_trial];
    if ((data.key_press == 49 && data.stimulus_left == data.stimulus_correct)||(data.key_press == 50 && data.stimulus_right == data.stimulus_correct)) {
      data.accuracy = 1
      correctness.push(1)
    } else {
      data.accuracy = 0
      correctness.push(0)
    }
  
    let onedifflength = 48
    let twodifflength = 36
    let threedifflength = 24
    let fourdifflength = 13

    if (cumulativearr[curr_shortest_trial] < onedifflength){
      data.condition = 'One Edge Diff'
    } else if (cumulativearr[curr_shortest_trial] >= onedifflength && cumulativearr[curr_shortest_trial] < onedifflength + twodifflength){
      data.condition = 'Two Edge Diff'
    } else if (cumulativearr[curr_shortest_trial] >= onedifflength + twodifflength && cumulativearr[curr_shortest_trial] < onedifflength + twodifflength + threedifflength){
      data.condition = 'Three Edge Diff'
    } else if (cumulativearr[curr_shortest_trial] >= onedifflength + twodifflength + threedifflength){
      data.condition = 'Four Edge Diff'
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
      data.specific_pairs = 'Two Edge Five Edge'
    }

    else if (cumulativearr[curr_shortest_trial] >= onedifflength + twodifflength + threedifflength){
      data.specific_pairs = 'Two Edge Six Edge'
    }

    console.log(data.condition)
    console.log(data.specific_pairs)
    let sum = 0;
    correctness.forEach(function(value) {
      sum += value;
    });
    console.log(data.accuracy)
    data.cumulative_accuracy = sum / correctness.length;


    sfa=data.key_press,
    curr_shortest_trial=curr_shortest_trial+1,
    shortestpath_phase.stimulus=create_shortestpath_trial(room_shortest_up,room_shortest_left,room_shortest_right,curr_shortest_trial)
    attentioncheck(shortestpath_phase,a=1,curr_shortest_trial,n_shortest_trial,dir_break)
  }
}
//Shortest Path memory end
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
          data.trial_type='Graph Reconstruction'
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
            timeline: [thank_you],
          }, jsPsych.resumeExperiment)
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
          data.trial_type='Goal Directed Planning'
          data.linedress=''
          for (const key in specificline) {
              data.linedressed += specificline[key].name+':[x1:'+specificline[key].location.x1+' x2:'+specificline[key].location.x2+' y1:'+specificline[key].location.y1+' y2:'+specificline[key].location.y2+']'
          }
          recon_init(),
          jsPsych.addNodeToEndOfTimeline({
            timeline: [phase3[i+1]],
          }, jsPsych.resumeExperiment)
        }
      }
    }
  }
  return phase3
}



phase3=createPhase3(n_goaldir_trial)
learn_break=createbreak(intro_dir,dir_instructnames,directmemory_phase)
short_break=createbreak(intro_short,short_instructnames,shortestpath_phase)
dir_break=createbreak(intro_mem,mem_instructnames,phase3[0])
//Goal directed planning end

// final thank you
var thank_you = {
  type: 'html-keyboard-response',
  choices: ['space'],
  stimulus: "<p> Congratulations, you are all done!</p><p>The secret code to enter at the beginning screen is: AJFHBG897</p><p> Please make sure to submit the HIT and email uciccnl@gmail.com if you had any issues! </p>",
  on_finish: function (data) {
    data.trial_type = 'thank_you';
    data.detectfocus = detectfocus;
    save_data(true)
  }
}


//time line here
timeline.push(welcome,enterFullscreen)
//debug
// timeline.push(phase3[0])
//debug
timelinepushintro(intro_learn,instructnames)
timeline.push(prac_attentioncheck_blackplus)
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
