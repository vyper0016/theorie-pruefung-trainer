
async function fillStats(){
    const response = await eel.get_category_stats()();
    const stats = response['category_stats']
    const total_stats = response['total']
    const last_hour = response['last_hour']
    const last_days = response['days']
    const {seen_today, goal} = response;
    console.log(seen_today);
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

    const total = total_stats['total'];
    for(const key in total_stats){
      if(key==='total')
        continue;
      const percentage = ((total_stats[key]/total)*100).toFixed(2);
      const c = document.getElementById(key);
      c.setAttribute('data-percent', percentage);
      c.title = total_stats[key];
      const percentageSpan = c.querySelector('.percentage');
      percentageSpan.textContent = percentage + '%';
    }
    initializeCharts();

    document.getElementById('last_hour').textContent = last_hour;
    document.getElementById('seen_today').textContent = seen_today;
    document.getElementById('goal').textContent = goal;
    document.getElementById('goal_percent').textContent = (100 * seen_today / goal).toFixed(2);
    document.getElementById('min_average').textContent = (last_hour/60).toFixed(2);

    initializeGraph(last_days, total);

}


function initializeGraph(data, total){
  
  const labels = Object.keys(data);
  const datasets = [
    {
        label: 'Mastered',
        data: labels.map(date => data[date]['mastered']),
        backgroundColor: 'rgba(0, 128, 0)', // Green with 50% opacity
        borderColor: 'rgba(0, 128, 0, 0.4)', // Lighter green with 20% opacity
        fill: false
    },
    {
        label: 'Wrong',
        data: labels.map(date => data[date]['wrong']),
        backgroundColor: 'rgba(255, 0, 0)', // Red with 50% opacity
        borderColor: 'rgba(255, 0, 0, 0.4)', // Lighter red with 20% opacity
        fill: false
    },
    {
        label: 'Not Seen',
        data: labels.map(date => data[date]['not_seen']),
        backgroundColor: 'rgba(200, 200, 200)', // Gray with 50% opacity
        borderColor: 'rgba(200, 200, 200, 0.4)', // Lighter gray with 20% opacity
        fill: false
    },
    {
        label: 'Practiced',
        data: labels.map(date => data[date]['practiced']),
        backgroundColor: 'rgba(255, 165, 0)', // Orange with 50% opacity
        borderColor: 'rgba(255, 165, 0, 0.4)', // Lighter orange with 20% opacity
        fill: false
    }
];

  const ctx = document.getElementById('myChart').getContext('2d');

  const chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: datasets
      },
      options: {
          scales: {
            yAxes: [{
              ticks:{
                fontSize: 15,
              },
              gridLines: {
                color: 'rgba(171,171,171,0.2)',
                lineWidth: 1
              }
            }],
            xAxes: [{
              ticks:{
                fontSize: 15,
              },
              gridLines: {
                color: 'rgba(171,171,171,0.2)',
                lineWidth: 1
              }
            }],
              x: {
                  display: true,
                  title: {
                      display: true,
                      text: 'Date',
                      fontSize: 16
                  }
              },
              y: {
                  display: true,
                  title: {
                      display: true,
                      text: 'Value',
                      fontSize: 16
                  },
                  suggestedMin: 0,
                  suggestedMax: total, // Replace 'total' with your variable
              }
          },
          legend: {
              display: true,
              position: 'bottom', // Set the position to 'bottom'
              labels: {
                fontSize: 18, // Set the desired font size for the legend labels
              },
          }
          
      }
  });
}


function initializeCharts() {
  $('.chart').each(function() {
    const chartId = $(this).attr('id');
    let barColor = "#17d3e6"; // Default bar color

    switch (chartId) {
      case 'mastered':
        barColor = "#42B883"; // Set a different bar color for 'mastered'
        break;
      case 'wrong':
        barColor = "#E64B31"; // Set a different bar color for 'wrong'
        break;
      case 'practiced':
        barColor = "#FFC300"; // Set a different bar color for 'practiced'
        break;
      case 'not_seen':
        barColor = "#a5a8a7"; // Set a different bar color for 'not_seen'
        break;
      // Add more cases for other chart IDs if needed
    }

    $(this).easyPieChart({
      size: 160,
      barColor: barColor,
      scaleLength: 0,
      lineWidth: 20,
      trackColor: "#373737",
      lineCap: "circle",
      animate: 1500,
    });
  });
}

window.onload = () => {
    fillStats();

  };