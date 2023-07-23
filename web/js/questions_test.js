let current_question;
let questionsArray = [];
let current_index = -1;

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
    goToQuestion(current_index + 1);
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

function updateIndexIcon(){
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

async function goToQuestion(index){
    current_index = index;
    current_question = questionsArray[current_index];
    updateIndexIcon();
    console.log(current_question);
    await fillQuestion();
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


window.onload = () => {
    createIndexIcons();
    load();
  };