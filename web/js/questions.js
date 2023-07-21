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
current_question = await eel.get_next_question()();
current_index += 1;
questionsArray.push(current_question);
console.log(current_question);
await fillQuestion();
}


async function fillQuestion(){
    for (const key in dataIds) {
        const elements = document.querySelectorAll(`#${key}`);
          elements.forEach(element => {
            element.innerHTML = current_question[dataIds[key]];
          });
      }
    
    await fillMedia();
    const ease = document.getElementById('ease');
    ease.value = current_question['ease']


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

    if(current_question['type'] != 'video'){
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

            const input = document.querySelector('input[name="asw1"]');
            input.setAttribute('type', 'number');
            input.setAttribute('min', '0');
            input.setAttribute('max', '1000');
            input.setAttribute('step', '1');


        }else{
            const toHide = document.querySelectorAll('.hideable')
            toHide.forEach(element => {
                element.style.display = 'flex';
              });
            
            const input = document.querySelector('input[name="asw1"]');
            input.setAttribute('type', 'checkbox');
            input.removeAttribute('min');
            input.removeAttribute('max');
            input.removeAttribute('step');
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


function markQuestion(){
  current_question['marked'] = !current_question['marked']
  button = document.querySelector('button[]')
}


window.onload = () => {
    getNextPage()

  };