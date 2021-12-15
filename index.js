fetch(
  "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-1E70461D-B346-4378-A55A-DB337F9BD7C5"
)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // console.log(data);
    pullAlldata(data);
    allData(data);
    findTempMin(data);
    findMountain(data);
    findRainTop(data);
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
  <li><span class="title_answer">現在時間</span> ${today}</li>  <br>
  <li>City  ${oneOfLocation.parameter[0].parameterValue}</li>
  <li>Town  ${oneOfLocation.parameter[2].parameterValue}</li>
  <li>Name  ${oneOfLocation.locationName}</li>
  <li>Temp  <span class="lowTemp">${oneOfLocation.weatherElement[0].elementValue}</span></li>  <br>
  <li>Location</li>
  <li>緯度 lat  ${oneOfLocation.lat}</li>
  <li>經度 lon  ${oneOfLocation.lon}</li>
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
  // console.log(elevationSection[0]);
  document.getElementById("examTwo_answer").innerHTML = `
  <li>
    <span class="title_answer"> 
    ${elevationSection[0]} 公尺 
    </span>
  </li>
  <li>最低溫測站 ${lowestWeather[0].locationName} </li>
  <li>氣溫 <span class="lowTemp">${newArray[0]}</span> </li>
  `;
}

// function findRainTop(data) {
//   let pullAlldataArray = pullAlldata(data);
//   // pullAlldataArray.forEach((element) => console.log(element.weatherElement[6].elementValue));
//   let rainArrayValue = [];
//   for (i = 0; i < pullAlldataArray.length; i++) {
//     let rainValue = pullAlldataArray[i].weatherElement[6];
//     rainArrayValue.push(rainValue);
//   }
//   console.log(rainArrayValue);

//   // sort
//   rainArrayValue.sort(function (a, b) {
//     return a - b;
//   });

//   for (i = 0; i < 20; i++) {
//     // https://ithelp.ithome.com.tw/articles/10220462
//     console.log(rainArrayValue[i]);
//   }
// }

function findRainTop(data) {
  let pullAlldataArray = pullAlldata(data);
  // console.log(pullAlldataArray);
  let rainObj = [];

  for (i = 0; i < pullAlldataArray.length; i++) {
    let res = pullAlldataArray[i].parameter[0];
    let rainValue = pullAlldataArray[i].weatherElement[6];

    if (rainValue.elementValue !== "-99") {
      let obj = Object.assign({}, res, rainValue);
    }
    console.log(obj);
  }

  // function f() {
  //   return Array.from(obj3);
  // }
  // console.log(f(obj3));

  // // sort by value
  // obj3.sort(function (a, b) {
  //   return a.value - b.value;
  // });

  // obj印值出來
  // for (const {
  //   name: n,
  //   parameter: { parameterName: f },
  // } of obj3) {
  //   console.log("Name: " + n + ", Father: " + f);
  // }
}