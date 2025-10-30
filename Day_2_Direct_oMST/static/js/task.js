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
var too_quick_num = 0;
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

var detectfocus = 0;
var isinfocus = true;

// Helper function to handle loss of focus
function handleBlur() {
  if (isinfocus) {       // Only increment if user was previously in focus
    detectfocus += 1;
    isinfocus = false;
    console.log("User left page and is in console. Will check for suspicious data");
    console.log("Return the task or you will be rejected");
  }
}

// Helper function to handle regaining focus
function handleFocus() {
  if (!isinfocus) {
    isinfocus = true;
  }
}

// Tab visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    handleBlur();
  } else {
    handleFocus();
  }
});

// Mouse leaves window
document.addEventListener('mouseleave', handleBlur);

// Optional: mouse re-enters window
document.addEventListener('mouseenter', handleFocus);

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
    // Data Structure //
    window.useridtouse=data.responses
    window.useridtouse = useridtouse.split('"')[3];
    subject_id=useridtouse
    data.subject_id = useridtouse
    data.trial_type = "Replication_Day2"
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
    data.img_l = NaN
    data.img_c = NaN
    data.img_r = NaN
    data.img_1 = NaN
    data.img_2 = NaN
    data.img_3 = NaN
    data.trial_timestamp	= data.time_elapsed / 1000
    data.choice_timestamp = NaN
    data.response_timestamp = NaN
    data.response_delay = NaN
    data.response_key = NaN
    data.response = NaN
    data.node_correct = NaN
    data.accuracy = NaN
    data.stimulus = "text"
    data.edge_condition = NaN
    data.specific_pairs = NaN
    data.GDP_response= NaN
    data.GDP_response_detour =NaN
    data.GDP_action= NaN
    data.GDP_action_detour = NaN
    data.detour_type = NaN
    data.blocked_img= NaN
    data.Recon_response= NaN
    data.Recon_action= NaN
    data.too_quick = too_quick_num
    data.problems = NaN
    data.smooth = NaN
    data.distraction = NaN
    data.strategies = NaN
    data.easier = NaN
    data.similar = NaN
    data.comments = NaN
    data.detectfocus = detectfocus;
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
  data: {ignore: true},
  on_finish: function(data){
    too_quick_num +=1
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
    data.trial_type = "Replication_Day2"
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
    data.edge_condition = NaN
    data.specific_pairs = NaN
    data.GDP_response= NaN
    data.GDP_response_detour =NaN
    data.GDP_action= NaN
    data.GDP_action_detour = NaN
    data.detour_type = NaN
    data.blocked_img= NaN
    data.Recon_response= NaN
    data.Recon_action= NaN
    data.too_quick = too_quick_num
    data.problems = NaN
    data.smooth = NaN
    data.distraction = NaN
    data.strategies = NaN
    data.easier = NaN
    data.similar = NaN
    data.comments = NaN
    data.detectfocus = detectfocus;

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
    attentioncheck(directmemory_phase,part2_sfa,curr_direct_trial,n_direct_trial,survey_screen,phase='direct')
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

var completion_screen = {
  type: 'html-keyboard-response',
  choices: ['space'],
  stimulus: function() {
    return `<p>Congratulations, you are all done!</p>
            <p>The secret code to enter at the beginning screen is: <strong>C131I5Y8</strong></p>
            <p>Please make sure to submit the HIT and email uciccnl@gmail.com if you had any issues!</p>`;
  },
  on_start: function(data) {
    save_final_deter = 'final';
    jsPsych.data.get().filter({ignore: true}).ignore();
    save_data();
    markVersion2AsFinished();
    document.removeEventListener("keydown", blockRefresh);
    window.removeEventListener("beforeunload", blockUnload);
  }}

var decoded = "C131I5Y8"

var survey_screen = {
  type: 'html-keyboard-response',
  stimulus: `
    <div id="survey-content" style="font-size: 20px; text-align: center;">
      <p>Please complete the following task (~5–8 mins) before finishing the task.</p>
      <p><a href="https://starklab.bio.uci.edu/publix/cZkGRQ8lOGn" target="_blank" style="font-size: 22px; color: blue;">Click here to open the survey</a></p>
      <p>The task above will redirect you to Prolific, and once you finish that task feel free to exit this window or press space to end.</p>
    </div>
  `,
  choices: jsPsych.NO_KEYS,
  trial_duration: null, // We'll manually control when it ends
  on_start: function(data) {
    save_final_deter = 'final';
    jsPsych.data.get().filter({ignore: true}).ignore();
    save_data();
    markVersion2AsFinished();
    document.removeEventListener("keydown", blockRefresh);
    window.removeEventListener("beforeunload", blockUnload);
  },
  on_load: function() {
    const displayEl = jsPsych.getDisplayElement();
    displayEl.setAttribute('tabindex', '-1');
    displayEl.focus();

    // After 30 seconds, show message
    setTimeout(() => {
      document.getElementById("survey-content").insertAdjacentHTML("beforeend", `
        <p style="margin-top: 30px; font-size: 20px; color: darkred;">
          Once you have finished the task above, feel free to exit out of the task.
        </p>
      `);
    }, 30000);
  }
};

// final thank you
var thank_you = {
  type: 'html-keyboard-response',
  choices: ['space'],
  stimulus: function() {
    const encoded = "QzEzNzkzUUo=";
    var decoded = atob(encoded);
    return `<p>Congratulations, you are all done!</p>
            <p>The secret code to enter at the beginning screen is: <strong>${decoded}</strong></p>
            <p>Please make sure to submit the HIT and email uciccnl@gmail.com if you had any issues!</p>`;
  },
  on_start: function(data) {
    save_final_deter = 'final';
    jsPsych.data.get().filter({ignore: true}).ignore();
    save_data();
    markVersion2AsFinished();
    document.removeEventListener("keydown", blockRefresh);
    window.removeEventListener("beforeunload", blockUnload);
  },
  on_finish: function (data) {
    // Data Structure //
    data.stimulus = 'text'
    data.detectfocus = detectfocus;
    data.subject_id = useridtouse
    data.trial_type = "Replication_Day2"
    data.condition = sequence
    data.phase = 'End'
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
    data.img_l = NaN
    data.img_c = NaN
    data.img_r = NaN
    data.img_1 = NaN
    data.img_2 = NaN
    data.img_3 = NaN
    data.trial_timestamp	= data.time_elapsed / 1000
    data.choice_timestamp = NaN
    data.response_timestamp = NaN
    data.response_delay = NaN
    data.response_key = NaN
    data.response = NaN
    data.node_correct = NaN
    data.accuracy = NaN
    data.stimulus = "text"
    data.edge_condition = NaN
    data.specific_pairs = NaN
    data.GDP_response= NaN
    data.GDP_response_detour =NaN
    data.GDP_action= NaN
    data.GDP_action_detour = NaN
    data.detour_type = NaN
    data.blocked_img= NaN
    data.Recon_response= NaN
    data.Recon_action= NaN
    data.too_quick = too_quick_num
    data.problems = NaN
    data.smooth = NaN
    data.distraction = NaN
    data.strategies = NaN
    data.easier = NaN
    data.similar = NaN
    data.comments = NaN
    data.detectfocus = detectfocus;
    jsPsych.data.get().filter({ignore: true}).ignore();
    save_data(true)
  }
}

//time line here
timeline.push(welcome,enterFullscreen)
timeline.push(intro_dir)
//debug
// timeline.push(phase3[0])
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
