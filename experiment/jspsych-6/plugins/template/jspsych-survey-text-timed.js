jsPsych.plugins['survey-text-timed'] = (function() {
  var plugin = {};

  //jsPsych.pluginAPI.registerPreload('survey-text-timed', 'stimulus', 'image');

  plugin.info = {
    name: 'survey-text-timed',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      placeholder: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Value',
        default: "",
        description: 'Placeholder text in the textfield.'
      },
      rows: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Rows',
        default: 1,
        description: 'The number of rows for the response text box.'
      },
      columns: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Columns',
        default: 40,
        description: 'The number of columns for the response text box.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial){

    // create image
    var html = '<img src="'+trial.stimulus+'" id="jspsych-image-keyboard-response-stimulus" style="';
    if(trial.stimulus_height !== null){
      html += 'height:'+trial.stimulus_height+'px; '
      if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
        html += 'width: auto; ';
      }
    }
    if(trial.stimulus_width !== null){
      html += 'width:'+trial.stimulus_width+'px; '
      if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
        html += 'height: auto; ';
      }
    }
    html +='"></img>';

    // create question, textbox, and submit button
    html += '<form id="jspsych-survey-text-form">'
    html += '<div id="jspsych-survey-text" class="jspsych-survey-text-question" style="margin: 2em 0em;">';
    html += '<p class="jspsych-survey-text">' + trial.prompt + '</p>';
    if(trial.rows == 1){
      html += '<input type="text" name="#jspsych-survey-text-response" data-name="question" size="'+trial.columns+'" autofocus placeholder="'+trial.placeholder+'"></input>';
    } else {
      html += '<textarea name="#jspsych-survey-text-response" data-name="question_1" cols="' + trial.columns + '" rows="' + trial.rows + '" autofocus placeholder="'+trial.placeholder+'"></textarea>';
    }
    html += '</div>';
    html += '<input type="submit" id="jspsych-survey-text-next" class="jspsych-btn jspsych-survey-text" value="'+trial.button_label+'"></input>';
    html += '</form>'

    // render
    display_element.innerHTML = html;

    // called if user presses submit or times out
    var end_trial = function(){
      jsPsych.pluginAPI.clearAllTimeouts();

      var q_element = document.querySelector('#jspsych-survey-text').querySelector('textarea, input'); 
      var trial_data = {
        "stimulus": trial.stimulus,
        "response": JSON.stringify(q_element.value)
      }

      display_element.innerHTML = '';

      jsPsych.finishTrial(trial_data);
    }

    // // listen for submit button
    display_element.querySelector('#jspsych-survey-text-form').addEventListener('submit', function(e) {
      e.preventDefault();
      end_trial();
    });

    // // check for time out
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }
  };

  return plugin;
})();