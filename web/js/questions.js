let current_question;
let questionsArray = [];
let current_index = -1;

const dataIds = {
    qct: 'total',
    qc: 'current',
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
    qid: 'number',
    stvo: 'stvo',
    asw_hint: 'asw_hint',
    mq: 'mq_flag',
    marked: 'marked'
  };

async function getNextPage(){
  if((current_index != -1) && current_index === (current_question['total'] - 1)){
    return;
  }

  if(current_index === (questionsArray.length - 1)){
current_question = await eel.get_next_question()();
current_index += 1;
questionsArray.push(current_question);
}else{
  current_index += 1;
  current_question = questionsArray[current_index];
}

console.log(current_question);
await fillQuestion();
}


async function fillQuestion(){
  const inputs = document.querySelectorAll('.asw input');
  inputs.forEach(i => {
    i.disabled = false;
    i.value = '';
    i.checked = false;
  }); 
    const checkbars = document.querySelectorAll('.left-checkbar');
  checkbars.forEach(i => {
    i.style.border = 'none';
  }); 
  const sbutton = document.getElementById('submitButton');
  sbutton.innerHTML = 'Submit';
  sbutton.setAttribute('onclick', 'submitQuestion()');
  const input1 = document.getElementById('iasw1');
  input1.style.color = 'black';

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
    const ease = document.getElementById('ease');
    ease.value = current_question['ease'];


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

    if(current_question['type'] != 'video'){
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

        if(current_question['picture'] != ''){
            image.style.width = '500px';
            image.style.height = '300px';     
            image.src = './assets/img/' + current_question['picture']; // Replace "new_image.jpg" with the desired image source

            
        }
    }else{
        video = current_question['picture']
        await eel.get_video(video);
        await addVideo(video);
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

function updateProgress(){
  eel.update_question(current_question);
}

function nextQuestion(){
  if(current_question['current'] === current_question['total']){
    return;
  }
  getNextPage();
}

async function previousQuestion(){
if(current_index > 0){
  current_index -= 1;
  current_question = questionsArray[current_index];
  console.log(current_question);
  await fillQuestion();
}
}

function submitQuestion(){
  if(current_question['type'] === 'number' && document.getElementById('iasw1').value === ''){
  alert('Please input an answer first');
  return;
}
  
var correct;
  const inputs = document.querySelectorAll('.asw input');

  if(current_question['type'] === 'number'){
    var input = document.getElementById('iasw1');

    if(input.value == current_question['asw_corr1']){
      input.style.color = 'green';
      correct = true;
    }else{
      input.style.color = 'red';
      correct = false;
      const hint = document.getElementById('asw_hint');
      hint.innerHTML = ` [${current_question['asw_corr1']}]  ` + hint.innerHTML
    }

  }else{
    var all_empty = true;
    inputs.forEach(i => {
      if(i.checked)
      all_empty = false;
    }); 
    
      if(all_empty){
        alert('Please check at least one answer first');
        return;
      } 
      var checkbar;
      var should_be_checked;
      correct = true;
      for (let i = 1; i <= 3; i++) {
        input = document.getElementById(`iasw${i}`);
        checkbar = document.getElementById(`checkbar${i}`);
        should_be_checked = current_question[`asw_corr${i}`] === 1 ? true : false;
        if(input.checked != should_be_checked){
          correct = false;
          checkbar.style.border = 'solid red 4px';
          input.checked = ! input.checked;
        }else{
          checkbar.style.border = 'solid green 4px';
        }
      }

       
  }

  inputs.forEach(i => {
    i.disabled = true;
  }); 

  const button = document.getElementById('submitButton');
  button.innerHTML = 'Next';
  button.setAttribute('onclick', 'nextQuestion()');
  eel.submitted_question(current_question, correct);
  if(current_question['current'] === current_question['total']){
    button.innerHTML = 'Exit';
    button.setAttribute('onclick', 'redirect("/index.html")');
  }
}

window.onload = () => {
    getNextPage();

  };