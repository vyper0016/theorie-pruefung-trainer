
async function fillSets(){
    const sets = await eel.get_sets()();
    const container = document.querySelector('.sets-container')
    for(let i = 0; i<99; i++){
        const setDiv = document.createElement('div');
        setDiv.classList.add('set');
        setDiv.onclick = () => handlePage(`set${i}`);
    
        const setText = document.createElement('p');
        setText.textContent = `Set ${i+1}`;
        setDiv.appendChild(setText);
    
        for (let j = 0; j < 3; j++) {
          const boxDiv = document.createElement('div');
          boxDiv.classList.add('box');
          switch(sets[i]['last_sessions'][j]){
            case 0:
                boxDiv.style.backgroundColor = 'gray';
                break;
            case 1:
                boxDiv.style.backgroundColor = 'green';
                break;
            case 2:
                boxDiv.style.backgroundColor = 'red';
                break;                
          }
          setDiv.appendChild(boxDiv);
        }
    
        container.appendChild(setDiv);
    }
}

window.onload = () => {
    fillSets();

  };