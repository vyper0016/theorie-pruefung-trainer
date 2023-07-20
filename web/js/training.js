let selectedKeys = [];

async function addFilter() {
  filters1 = await eel.get_filter_keys_json()();
  const filterKeys = JSON.parse(filters1) || [];
  const filtersTable = document.getElementById('filters-table');

  // Check if all keys are already selected
  if (selectedKeys.length === filterKeys.length) {
    alert('You cannot add more filters.');
    return;
  }

  // Create a new row
  const newRow = filtersTable.insertRow();

  // Create the dropdown for filter key selection
  const dropdownCell = newRow.insertCell();
  const dropdown = document.createElement('select');
  dropdownCell.appendChild(dropdown);

  // Add an empty initial option to the dropdown
  const emptyOption = document.createElement('option');
  dropdown.appendChild(emptyOption);

  // Populate the dropdown with filter keys and their visible text
  for (const key of filterKeys) {
    if (!selectedKeys.includes(key)) {
      const option = document.createElement('option');
      option.value = key;
      option.text = getFilterVisibleText(key); // Function to get the visible text based on the key
      dropdown.appendChild(option);
    }
  }

  dropdown.addEventListener('change', () => {
    const selectedKey = dropdown.value;
    if (selectedKeys.includes(selectedKey)) {
    alert('You cannot add the same filter key twice.');
    dropdown.value = emptyOption;
    return;
}

    // Remove the empty initial option from the dropdown
    dropdown.removeChild(emptyOption);

    // Disable the dropdown after selecting a key
    dropdown.disabled = true;

    // Add the selected key to the list of selected keys
    selectedKeys.push(selectedKey);

    // Create an empty cell for the input element
    const inputCell = newRow.insertCell();

    // Create the input based on the selected filter key
    const input = createFilterInput(selectedKey);
    inputCell.appendChild(input);

    // Create a delete button in the next cell
    const deleteCell = newRow.insertCell();
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteCell.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
      // Remove the current row when delete button is clicked
      filtersTable.deleteRow(newRow.rowIndex);
      // Remove the selected key from the list of selected keys
      selectedKeys = selectedKeys.filter((key) => key !== selectedKey);
    });
  });
}
  function getFilterVisibleText(key) {
    // Function to return visible text based on filter key
    switch (key) {
      case 'type':
        return 'Type';
      case 'points':
        return 'Points';
      case 'category':
        return 'Category';
      case 'mq_flag':
        return 'Mother Questions';
      case 'times_seen':
        return 'Times Seen';
      case 'times_wrong':
        return 'Times Wrong';
      case 'times_right':
        return 'Times Right';
      case 'times_right_iar':
        return 'Times Right in a Row';
      case 'last_was_right':
        return 'Last Time Was Right';
      case 'last_seen':
        return 'Last Seen (Date)';
      case 'ease':
        return 'Ease';
      case 'marked':
        return 'Marked';
      default:
        return key;
    }
  }

  function createFilterInput(key) {
    const input = document.createElement('input');
    input.type = 'text'; // Default input type is text
  
    switch (key) {
      case 'type':
        const select = document.createElement('select');
        const optionValues = ['number', 'video', 'text_only', 'text_image'];
        const optionTexts = ['Number', 'Video', 'Text Only', 'Text & Image'];
        for (let i = 0; i < optionValues.length; i++) {
          const option = document.createElement('option');
          option.value = optionValues[i];
          option.text = optionTexts[i];
          select.appendChild(option);
        }
        return select;
      case 'category':
        input.type = 'text';
        break;
      case 'points':
        input.type = 'number';
        input.min = 2;
        input.max = 5;
        break;
      case 'mq_flag':
      case 'last_was_right':
      case 'marked':
        input.type = 'checkbox';
        break;
      case 'times_seen':
      case 'times_wrong':
      case 'times_right':
      case 'times_right_iar':
      case 'ease':
        input.min = 0;
        input.type = 'number';
        break;
      case 'last_seen':
        input.type = 'text';
        break;
      default:
        break;
    }
  
    return input;
  }
   
  eel.expose(getCurrentFilters);
  function getCurrentFilters() {
    const filtersTable = document.getElementById('filters-table');
    const filters = {};
  
    // Iterate through each row and get the filter key and value
    for (const row of filtersTable.rows) {
      const [keyCell, valueCell] = row.cells;
      const key = keyCell.querySelector('select').value;
      let value;
  
      switch (key) {
        case 'type':
            value = valueCell.querySelector('select').value;
            break;
        case 'category':
          value = valueCell.querySelector('input').value;
          break;
        case 'points':
        case 'times_seen':
        case 'times_wrong':
        case 'times_right':
        case 'times_right_iar':
        case 'ease':
          value = parseInt(valueCell.querySelector('input').value, 10);
          break;
        case 'mq_flag':
        case 'last_was_right':
        case 'marked':
          value = valueCell.querySelector('input').checked;
          break;
        case 'last_seen':
          value = valueCell.querySelector('input').value;
          break;
        default:
          break;
      }

      if(!(value === "" || Number.isNaN(value) || key === ''))
        filters[key] = value;
    }
    
    console.log(filters)
    return filters;
  }
  
  