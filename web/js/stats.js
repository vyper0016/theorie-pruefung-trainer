
async function fillCats(){
    const response = await eel.get_category_stats()();
    const stats = response[1]
    console.log(stats);
    const total_stats = response[0]
    stats.forEach(element => {
        const {cid, mastered, not_seen, wrong, practiced, total} = element;
        const container = document.getElementById('categories'+cid[0]);
        const catDiv = document.createElement('div');
        catDiv.classList.add('category');
        container.appendChild(catDiv);
        const text = document.createElement('span');
        text.classList.add('category-text');
        text.innerHTML = element['category_name'];
        catDiv.appendChild(text);
        const catBar = document.createElement('div');
        catBar.classList.add('cat-bar');
        catDiv.appendChild(catBar);

        var g = document.createElement('div');
        g.classList.add('bar');
        g.setAttribute('title', mastered);
        g.style.background = 'green';
        g.style.width = `${(mastered/total)*100}%`;
        catBar.appendChild(g);
        
        var g = document.createElement('div');
        g.classList.add('bar');
        g.setAttribute('title', practiced);
        g.style.background = 'orange';
        g.style.width = `${(practiced/total)*100}%`;
        catBar.appendChild(g);

        var g = document.createElement('div');
        g.classList.add('bar');
        g.setAttribute('title', wrong);
        g.style.background = 'red';
        g.style.width = `${(wrong/total)*100}%`;
        catBar.appendChild(g);

        var g = document.createElement('div');
        g.classList.add('bar');
        g.setAttribute('title', not_seen);
        g.style.background = 'gray';
        g.style.width = `${(not_seen/total)*100}%`;
        catBar.appendChild(g);
    });
}

window.onload = () => {
    fillCats();
  };