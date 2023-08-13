let current_question;
let questionsArray = [];
let current_index = -1;
let left = 30;
let submitted = false;
const categorizedQuestions = {'0':[], '1':[]};
const categoriesCorrection = {'0':{}, '1':{}};

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
    addVideoIcons();
    addMarkedChamfers();
}


async function nextQuestion(){
  if(current_index === 19){
    const radio = document.getElementById('two');
    radio.checked = true;
  }
  goToQuestion(current_index + 1);
}

async function previousQuestion(){
  if(current_index === 20){
    const radio = document.getElementById('one');
    radio.checked = true;
  }
  goToQuestion(current_index - 1);
}


async function fillQuestion(){

    for (const key in dataIds) {
        const elements = document.querySelectorAll(`#${key}`);
          elements.forEach(element => {
            element.innerHTML = current_question[dataIds[key]];
          });
      }
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
      
      if(! current_question.hasOwnProperty('asw_3'))
        document.getElementById('asw3h').style.display = 'none';
      
        const mutterSpan = document.querySelectorAll('.mutterfrage');
        mutterSpan.forEach(element => {
          element.innerHTML += '&nbsp';
          element.innerHTML = '&nbsp' + element.innerHTML;
        });

      const input = document.getElementById('iasw1');
      input.setAttribute('type', 'checkbox');
      input.removeAttribute('min');
      input.removeAttribute('max');
      input.removeAttribute('step');
  }else{
    document.getElementById('iasw1').focus();
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
      image.src = './assets/img/' + current_question['picture'];
      image.addEventListener('click', function() {
        const url = './assets/img/' + current_question['picture'];
        window.open(url, '_blank');
      });
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


function updateMark(){
  const button = document.querySelector('button[onclick="markQuestion()"]');
  const chamfer = document.getElementById('chamfer'+current_index);
  if(current_question['marked']){
    button.innerHTML = 'Unmark';
    chamfer.style.display = 'block';
  }else{
    button.innerHTML = 'Mark';
    chamfer.style.display = 'none';
  }
}


function markQuestion(){
  current_question['marked'] = !current_question['marked'];
  updateMarkButton();
  updateMark();
  eel.mark_question(current_question['number'], current_question['marked']);
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
    if(! 'state_asw'+i in current_question)
      break;
    
    const asw = submitted ? current_question['asw_corr'+i] : current_question['state_asw'+i]
    var input = document.getElementById('iasw'+i);
    if(current_question['type'] === 'number'){
       input.value = asw;
       if(current_question.asw_corr1 == current_question['state_asw'+i]){
        checkbar.style.border = 'solid green 4px';
      }else{
        checkbar.style.border = 'solid red 4px';
      }
       break;
    }else{
      input.checked = asw;      
    }

    if(submitted){

      if(current_question['asw_corr'+i] == current_question['state_asw'+i]){
        checkbar.style.border = 'solid green 4px';
      }else{
        checkbar.style.border = 'solid red 4px';
      }
    }

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

const asw3_div = document.getElementById('asw3h');
async function goToQuestion(index){
    if(current_index === index || index > 29 || index < 0)
      return;
  
    current_index = index;
    current_question = questionsArray[current_index];
    updateIndexIcon();
    console.log(current_question);
    await fillQuestion();
    updateMark();
    fillAnswers();
    if('asw_3' in current_question){
      asw3_div.style.display = 'flex';
    }else{
      asw3_div.style.display = 'none';
    }
  
}


function createIndexIcons() {
    var container = document.getElementById("panel1");
  
    for (let i = 0; i <= 19; i++) {
      const indexIcon = document.createElement("div");
      indexIcon.classList.add("index-icon");
      indexIcon.innerHTML = i+1;
      indexIcon.id = 'icon' + i;
      indexIcon.style.position = 'relative';
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
      indexIcon.style.position = 'relative';
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
      if(! 'state_asw'+i in current_question)
      break;
    
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
    icon.style.background = 'green';
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
      console.log('here ' + input.value, i, current_question['state_asw1']);
      break;
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

    if (!categorizedQuestions[String(basic)][category_name]) {
      // If the category does not exist as a key in the categorizedQuestions object, create a new array for it
      categorizedQuestions[String(basic)][category_name] = [question];
      categoriesCorrection[String(basic)][category_name] =  {'total_points':0, 'correct_points':0, 'questions':[]};
    } else {
      // If the category already exists as a key, push the question into the corresponding array
      categorizedQuestions[String(basic)][category_name].push(question);
    }
  });

}


function fillTable(){
  const total_mistakes_span = document.getElementById('mistakes');
  var total_mistakes = 0;
  var five_point_mistakes = 0;

  for(let t=0;t<=1;t++){
    var mistakes = 0;
    const table = document.getElementById('table'+t);
    const mistakes_span = document.getElementById('mistakes'+t);

    const d =categoriesCorrection[String(t)];
    for (const category in d) {
      if (d.hasOwnProperty(category)) {
        const cdata = d[category];
        const {total_points, correct_points, questions} = cdata;
        const row = table.insertRow();
        const name_cell = row.insertCell(0);
        name_cell.textContent = category;
        name_cell.classList.add('category-title');
        const points_cell = row.insertCell(1);
        points_cell.classList.add('category-m');
        points_cell.textContent = `${correct_points}/${total_points}`;
        mistakes += (total_points - correct_points);

        questions.forEach((q, index) => {
          const q_points = q[0]
          const cell = row.insertCell(index+2);
          const div_block = document.createElement('div');
          div_block.classList.add('correction-block');
          div_block.setAttribute('title', q_points + ' Points');
          cell.appendChild(div_block);
          if(q[1])
            div_block.style.background = 'green';
          else{
            div_block.style.background = 'red';
            if(q_points === 5)
              five_point_mistakes ++;
          }

        });
      }
    }

    mistakes_span.innerHTML = mistakes;
    total_mistakes += mistakes;
  }


  total_mistakes_span.innerHTML = total_mistakes;
  // success test
  if(total_mistakes > 10 || five_point_mistakes >= 2)
    return false;
  else
    return true;
}


function submitTest(){
  if(left > 0){
    const response = confirm("There are still " + left + " questions left!\n Are you sure you want to submit?");
      if (! response) 
        return;
  }

  submitted = true;

  categorizeQuestions();
  fillAnswers();

  for(let i=1;i<=3;i++){
    const input = document.getElementById('iasw'+i);
    input.disabled = true;
  }

  const bdiv = document.querySelector('.buttons');
  bdiv.style.display = 'none'

  var infoa = document.querySelector('a[href="#popup1"]');
  infoa.style.display = 'block';

  
  var infoa = document.querySelector('a[href="#popup2"]');
  infoa.style.display = 'block';

  for(let i=0; i<=29; i++){
    var correct = true;
    var question = questionsArray[i];
    const { category_name, basic, points } = question;
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
    categoriesCorrection[String(basic)][category_name]['total_points'] += points;
    categoriesCorrection[String(basic)][category_name]['questions'].push([points, correct]);
    if(correct){
      categoriesCorrection[String(basic)][category_name]['correct_points'] += points;
      icon.style.background = 'green';
    }else{
      icon.style.background = 'red';
    }
  }

  var success = fillTable();
  const success_block = document.getElementById('resultb');
  const success_text = document.getElementById('result_text');

  if(success){
    success_block.style.background = 'green';
    success_text.innerHTML = 'Success';
  }else{
    success_block.style.background = 'red';
    success_text.innerHTML = 'Failed';
  }

  
  redirect('#popup2');

  eel.update_set_progress(success);
  questionsArray.forEach(q => {
    eel.submitted_question(q, q['correct']);
  });


}


function addVideoIcons(){
  for(let i=0;i<=29;i++){
    if(questionsArray[i]['type'] === 'video'){
      const indexIcon = document.getElementById('icon'+i)
      const videoIcon = document.createElement('img');
      videoIcon.src = './img/video.png';
      videoIcon.classList.add('video-icon');
      indexIcon.appendChild(videoIcon);}
  }
}


function addMarkedChamfers(){
  for(let i=0;i<=29;i++){
      const indexIcon = document.getElementById('icon'+i)
      const cham = document.createElement('div');
      cham.classList.add('chamfer');
      cham.id = 'chamfer'+i;
      cham.style.display = 'none';
      indexIcon.appendChild(cham);
      if(questionsArray[i]['marked'])
      cham.style.display = 'block';
  }
}


window.onload = () => {
    createIndexIcons();
    addChangeListeners();
    load();
  };



window.addEventListener('beforeunload', function (e) {
    // Cancel the event and show alert that
    // the unsaved changes would be lost
    if(!submitted){
      e.preventDefault();
      e.returnValue = '';}

});


document.addEventListener("keydown", function(event) {
  switch (event.key) {
  
    case "1":
    case "2":
    case "3":
      if(current_question.type === 'number')
        break;
      const checkbox = document.getElementById('iasw'+event.key);
      if(checkbox)
        checkbox.click();
      break;   
    case "m":
      markQuestion();
      break;
    case "s":
      submitTest();
      break;
    case "ArrowRight":
        nextQuestion();
        break;
    case "ArrowLeft":
        previousQuestion();
        break;
    case "Enter":
      nextQuestion();
      break;    
    case "*":
        if(window.location.href.endsWith('#popup3'))
          redirect('#');
        else
          redirect('#popup3');
      break;
    case "i":
      if(!submitted)
        break;
      if(window.location.href.endsWith('#popup1'))
        redirect('#');
      else
        redirect('#popup1');
    break;
    default:
      break; // No action for other keys
  }
});

