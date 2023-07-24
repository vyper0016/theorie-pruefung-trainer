let current_question;
let questionsArray = [];
let current_index = -1;
let left = 30;
let submitted = false;
const categorizedQuestions = {'0':[], '1':[]};

const dataIds = {
    asw1: 'asw_1',
    asw2: 'asw_2',
    asw3: 'asw_3',
    text: 'text',
    asw_pretext: 'asw_pretext',
    points: 'points',
    category: 'category',
    ts: 'times_seen',
    tr: 'times_right',
    ls: 'last_seen',
    qinfo: 'info',
    stvo: 'stvo',
    asw_hint: 'asw_hint',
    mq: 'mq_flag',
    marked: 'marked'
  };


async function getQuestions(){
    questionsArray = await eel.get_set_questions()();
}


async function load(){
    await getQuestions();
    console.log(questionsArray);
    await nextQuestion();
}


async function nextQuestion(){
  if(current_index === 19){
    const radio2 = document.getElementById('two');
    radio2.checked = true;
  }
  goToQuestion(current_index + 1);
}


async function fillQuestion(){

    for (const key in dataIds) {
        const elements = document.querySelectorAll(`#${key}`);
          elements.forEach(element => {
            element.innerHTML = current_question[dataIds[key]];
          });
      }
      const asw3_div = document.getElementById('asw3h');
      if('asw_3' in current_question){
        
        asw3_div.style.display = 'flex';
      }else{
        asw3_div.style.display = 'none';
      }
    
    updateMarkButton();
    await fillMedia();
}

async function addVideo(video) {
      // Create a new video element
      const videoElement = document.createElement('video');
      
      // Set attributes for the video element
      videoElement.src = './assets/vid/' + video;
      videoElement.controls = true;
      video.muted = false;
      
      // Add the video element to the container div
      const container = document.querySelector('.video-container');
      container.appendChild(videoElement);
    }


async function fillMedia(){
    const image = document.getElementById("image");
    image.style.width = '0px';
    image.style.height = '0px';   
    const acontainer = document.querySelector('.asw-container'); 
    acontainer.style.marginLeft = '510px';


    if(current_question['type'] != 'number'){
      const toHide = document.querySelectorAll('.hideable')
      toHide.forEach(element => {
          element.style.display = 'flex';
        });
      
      const input = document.getElementById('iasw1');
      input.setAttribute('type', 'checkbox');
      input.removeAttribute('min');
      input.removeAttribute('max');
      input.removeAttribute('step');
  }        
  
  const videoElement = document.querySelector('.video-container video');
  if (videoElement) {
    // Remove the video element from the container if present
    const container = document.querySelector('.video-container');
    container.removeChild(videoElement);
  }

  if(current_question['type'] === 'number'){
    const toHide = document.querySelectorAll('.hideable')
    toHide.forEach(element => {
        element.style.display = 'none';
      });

    const input = document.getElementById('iasw1');
    input.setAttribute('type', 'number');
    input.setAttribute('min', '0');
    input.setAttribute('max', '1000');
    input.setAttribute('step', '1');

}

    if(current_question['type'] != 'video' && current_question['picture'] != ''){
      acontainer.style.marginLeft = '10px';
      image.style.width = '500px';
      image.style.height = '300px';     
      image.src = './assets/img/' + current_question['picture']; // Replace "new_image.jpg" with the desired image source
  
    }
    
    if(current_question['type'] === 'video'){
        video = current_question['picture']
        acontainer.style.marginLeft = '10px';

        await eel.get_video(video);
        await addVideo(video);
    }
}


function updateLeft(){

  left = 30;
  questionsArray.forEach(function(q) {
    if(q['done'])
      left--;
  });

  if(left > 0){
    const n = document.getElementById('qleft');
    n.innerHTML = left;
  }else{
    const warning = document.getElementById('warning');
    warning.style.display = 'none';
  }
}


function updateMarkButton(){
  const button = document.querySelector('button[onclick="markQuestion()"]');
  if(current_question['marked']){
    button.innerHTML = 'Unmark'
  }else{
    button.innerHTML = 'Mark'
  }
}


function markQuestion(){
  current_question['marked'] = !current_question['marked'];
  updateMarkButton();
  updateProgress();
  

}

function updateIndexIcon(){
    const qid = document.getElementById('qid');
    qid.innerHTML = 'Question ' + (current_index + 1);
    const indexIcons = document.querySelectorAll('.index-icon');
    indexIcons.forEach(function(icon, i) {
        if(i === current_index){
            icon.style.borderWidth = '2.7px';
            icon.style.margin = '0';
            icon.style.fontWeight = '700';
        }else{
            icon.style.borderWidth = '1px';
            icon.style.margin = '2.5px';
            icon.style.fontWeight = '600';
        }
      });
}


function fillAnswers(){
  for(let i=1; i<=3; i++){
    
    const asw = submitted ? current_question['asw_corr'+i] : current_question['state_asw'+i]
    var input = document.getElementById('iasw'+i);
    if(current_question['type'] === 'number'){
       input.value = asw;
       break;
    }else{
      input.checked = asw;
      
    }

    if(submitted){
      const checkbar = document.getElementById('checkbar'+i)
      if(current_question['asw_corr'+i] == current_question['state_asw'+i]){
        checkbar.style.border = 'solid green 4px';
      }else{
        checkbar.style.border = 'solid red 4px';
      }
    }

  }
}


async function goToQuestion(index){
    current_index = index;
    current_question = questionsArray[current_index];
    updateIndexIcon();
    console.log(current_question);
    await fillQuestion();
    fillAnswers();
}


function updateProgress(){
  eel.update_question(current_question);
}


function createIndexIcons() {
    var container = document.getElementById("panel1");
  
    for (let i = 0; i <= 19; i++) {
      const indexIcon = document.createElement("div");
      indexIcon.classList.add("index-icon");
      indexIcon.innerHTML = i+1;
      indexIcon.id = 'icon' + i
      indexIcon.onclick = function() {
        goToQuestion(i);
      };
      container.appendChild(indexIcon);
    }    

    container = document.getElementById("panel2");
  
    for (let i = 20; i <= 29; i++) {
      const indexIcon = document.createElement("div");
      indexIcon.classList.add("index-icon");
      indexIcon.innerHTML = i+1;
      indexIcon.id = 'icon' + i
      indexIcon.onclick = function() {
        goToQuestion(i);
      };
      container.appendChild(indexIcon);
    }
  }


function checkDone(){
  var done = false;
  if(current_question['type'] === 'number'){
    done = current_question['state_asw1'] != '';

  }else{    
    for(let i = 1; i<=3; i++){
      if(current_question['state_asw'+i]){
        done = true;
        break;
      }
    }
  }
  current_question['done'] = done;
  return done;
}


function updateDoneIcons(){
  const icon = document.getElementById('icon'+current_index);
  if(checkDone()){
    icon.style.color = 'white';
    icon.style.background = '#008000';
    icon.style.borderColor = 'white';
  }else{
    icon.style.color = 'black';
    icon.style.background = 'white';
    icon.style.borderColor = 'black';    
  }
}


function updateAnswers(){
  for(let i=1; i<=3; i++){
    var input = document.getElementById('iasw'+i);
    if(current_question['type'] === 'number'){
      current_question['state_asw1'] = input.value;
    }else{
      current_question['state_asw'+i] = input.checked;
    }
  }
}


function addChangeListeners(){
  const inputs = document.querySelectorAll('.asw');

inputs.forEach(function(input) {
  input.addEventListener('change', function() {
    updateAnswers();
    updateDoneIcons();
    updateLeft();
  });
});

  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(function(radio, i) {
    radio.addEventListener('change', function() {
      // go to question 0 or 19
      goToQuestion(i*20);   
    });
  });
}


function categorizeQuestions(){
  questionsArray.forEach((question) => {
    const { category_name, basic } = question;
    const pushin = categorizedQuestions[String(basic)];

    if (!pushin[category_name]) {
      // If the category does not exist as a key in the categorizedQuestions object, create a new array for it
      pushin[category_name] = [question];
    } else {
      // If the category already exists as a key, push the question into the corresponding array
      pushin[category_name].push(question);
    }
  });
  console.log('here')

}


function submitTest(){
  if(left > 0){
    const response = confirm("There are still " + left + " questions left!\n Are you sure you want to submit?");
      if (! response) 
        return;
  }

  submitted = true;

  categorizeQuestions();

  for(let i=1;i<=3;i++){
    const input = document.getElementById('iasw'+i);
    input.disabled = true;
  }

  const bdiv = document.querySelector('.buttons');
  bdiv.style.display = 'none'

  const infoa = document.querySelector('a[href="#popup1"]');
  infoa.style.display = 'block';

  for(let i=0; i<=29; i++){
    var correct = true;
    var question = questionsArray[i];
    if(question['type'] === 'number'){
      correct = (question['state_asw1'] == question['asw_corr1']);
    }else{
    for(let j=1;j<=3;j++){
      if(question['state_asw'+j] != question['asw_corr'+j]){
        correct = false;
        break;
      }
    }
  }
    question['correct'] = correct;
    const icon = document.getElementById('icon'+i);
    if(correct){
      icon.style.background = 'green';
    }else{
      icon.style.background = 'red';
    }
  }



}


window.onload = () => {
    createIndexIcons();
    addChangeListeners();
    load();
  };


/*
window.addEventListener('beforeunload', function (e) {
    // Cancel the event and show alert that
    // the unsaved changes would be lost
    e.preventDefault();
    e.returnValue = '';

});
*/