fetch(
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-1E70461D-B346-4378-A55A-DB337F9BD7C5"
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    pullAlldata(data);
    allData(data);
    findTempMin(data);
    findMountain(data);
    findRainTop(data);
  })
  .catch(function (err) {
    console.log(err);
  });

// fetch(
//   "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-1E70461D-B346-4378-A55A-DB337F9BD7C5&locationName=%E5%85%A7%E6%B9%96%E5%8D%80&elementName=MinCI&sort=time&startTime=&dataTime=&timeFrom=2021-12-16T09%3A24%3A37&timeTo=2021-12-23T09%3A24%3A43"
// )
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     expectMyLocationFuture(data);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

fetch(
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063?Authorization=CWB-1E70461D-B346-4378-A55A-DB337F9BD7C5&format=JSON&locationName=%E5%85%A7%E6%B9%96%E5%8D%80&elementName"
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    expectFutureMaxT(data);
  })
  .catch(function (err) {
    console.log(err);
  });

function pullAlldata(data) {
  let pullAlldataArray = [];
  for (i = 0; i < data.records.location.length; i++) {
    let res = data.records.location[i];
    pullAlldataArray.push(res);
  }
  return pullAlldataArray;
}

function allData(data) {
  const lowestWeather = data.records.location;
  const newArray = [];
  for (i = 0; i < lowestWeather.length; i++) {
    let temp = lowestWeather[i].weatherElement[0].elementValue;
    let res = Number(temp);
    newArray.push(res);
  }
  return newArray;
}

function findTempMin(data) {
  const lowestWeather = data.records.location;
  const newArray = allData(data);
  const min = Math.min(...newArray);
  let oneOfLocation = lowestWeather.find((record) => {
    let temp = record.weatherElement[0].elementValue;
    let res = Number(temp);
    return res === min;
  });
  const today = new Date();
  document.getElementById("examOne_answer").innerHTML = `
  <li><span class="title_answer">
  ???????????? 
  </span> 
<span class="title_answer">
  ${today}
</span>
</li><br>
<li>
<span class="title_answer">
    City  ${oneOfLocation.parameter[0].parameterValue}
</span>
</li>
<li>
    Town  ${oneOfLocation.parameter[2].parameterValue}
</li>
<li>
    Name  ${oneOfLocation.locationName}
</li>
<li>
    Temp  <span class="lowTemp">${oneOfLocation.weatherElement[0].elementValue}
</span>
</li><br>
<li><span class="title_answer">
    Location
</span></li>
<li>
    ?????? lat  ${oneOfLocation.lat}
</li>
<li>
    ?????? lon  ${oneOfLocation.lon}
</li>
  `;
}

function findMountain(data) {
  // All Elev
  const lowestWeather = data.records.location;
  // Put in array
  let newArray = allData(data);

  // 0-500 ElEV
  // sort lowest temp
  newArray.sort(function (a, b) {
    return a - b;
  });

  const max = Math.max(...newArray);
  const elevationSection = [
    "0-500",
    "500-1000",
    "1000-1500",
    "1500-2000",
    "2000-2500",
    "2500-3000",
    "3000-3500",
    "3500-3860",
  ];

  // Show
  document.getElementById("examTwo_answer").innerHTML = `
  <li>
    <span class="title_answer"> 
      ${elevationSection[0]} ?????? 
    </span>
  </li>
  <li>??????????????? ${lowestWeather[0].locationName} </li>
  <li>?????? <span class="lowTemp">${newArray[0]}</span> </li>
  `;
}

function findRainTop(data) {
  let pullAlldataArray = pullAlldata(data);
  let array = [];

  // Get the name and value become an object and put in array
  for (i = 0; i < pullAlldataArray.length; i++) {
    let res = pullAlldataArray[i].parameter[0];
    let rainValue = pullAlldataArray[i].weatherElement[6];
    let obj = Object.assign({}, res, rainValue);
    array.push(obj);
  }
  // Rank
  array.sort(function (a, b) {
    return b.elementValue - a.elementValue;
  });

  for (var i = 0; i < 20; i++) {
    array[i].rank = i + 1;
    document.getElementById("examThree_answer").innerHTML += `
    <li>
      <span class="rankList">
        ${array[i].rank} &ensp;
      </span>
        ${array[i].parameterName}
        ${array[i].parameterValue}
        ${array[i].elementName}
      <span class="lowTemp">
        ${array[i].elementValue}
      <span>
    </li>
    `;
  }
}

function expectFutureMaxT(data) {
  const weatherElement = data.records.locations[0].location[0].weatherElement;
  const maxDescription = weatherElement[12].description;
  const minDescription = weatherElement[8].description;
  const maxTempObject = weatherElement[12].time;
  const minTempObject = weatherElement[8].time;
  const maxTArray = [];
  const minTArray = [];
  const gapTArray = [];

  function findTheMaxT() {
    for (i = 0; i < maxTempObject.length; i++) {
      let maxTObjectValue = maxTempObject[i].elementValue[0].value;
      maxTArray.push(maxTObjectValue);
    }
    const max = Math.max(...maxTArray);
    return max;
  }

  function findTheMinT() {
    for (i = 0; i < minTempObject.length; i++) {
      let minTObjectValue = minTempObject[i].elementValue[0].value;
      minTArray.push(minTObjectValue);
    }
    const min = Math.min(...minTArray);
    return min;
  }
  const findTheMinTtemp = findTheMinT(data);
  const findTheMaxTtemp = findTheMaxT(data);

  function findTGap() {
    for (i = 0; i < maxTempObject.length; i++) {
      let maxTObjectValue = maxTempObject[i].elementValue[0].value;
      let minTObjectValue = minTempObject[i].elementValue[0].value;
      gapTArray.push(maxTObjectValue - minTObjectValue);
    }
    const max = Math.max(...gapTArray);
    return max;
  }
  let findTempGap = findTGap();

  document.getElementById("examFour_answer").innerHTML = `
  <li class="title_answer"> ?????????/????????? </li>
  <li class="title_answer"> ?????????????????? </li>
  <li>${minDescription} <span class="lowTemp"> ${findTheMinTtemp} </span></li>
  <li>${maxDescription} <span class="lowTemp"> ${findTheMaxTtemp} </span></li>
  <li class="title_answer"> ?????????????????? </li>
  <li>?????????<span class="lowTemp"> ${findTempGap} </span>???</li>
  `;
}
