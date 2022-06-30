const form = document.getElementById("lift__simulator__form");
const building = document.getElementById("lift__simulator__building");
const floorArray = [];

//button click event listener
let addingPixels = 0;
let currentLift;
building.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("btn")) {
    const liftArray = document.querySelectorAll("#lift");
    const { lift, sameFloor } = getLift(
      getAttribute("floor", target),
      liftArray
    );
    console.log(lift, sameFloor);
    const absoluteValue = Math.abs(
      parseInt(getAttribute("index", target)) -
        parseInt(getAttribute("floor", lift))
    );
    const nonAbsoluteValue =
      parseInt(getAttribute("index", target)) -
      parseInt(getAttribute("floor", lift));

    lift.classList.add("busy");
    setTimeout(() => {
      lift.classList.remove("busy");
    }, absoluteValue * 2 * 1000);

    if (!sameFloor) {
      addingPixels = getLiftsDistanceFromBottom(lift) + nonAbsoluteValue * 160;
      console.log(
        "absolutevalue:",
        nonAbsoluteValue,
        "adding pxls after addn:",
        addingPixels
      );
      lift.style.transition = `transform ${
        Math.abs(absoluteValue) * 2
      }s linear`;
      lift.style.transform = `translateY(${`-${addingPixels}px`})`;
      setAttribute("floor", lift, getAttribute("index", target));
    }
  }
});

//form submit handler
form.addEventListener("submit", function (event) {
  event.preventDefault();
  buildTheBuilding();
});

function buildTheBuilding() {
  //clean the previous building
  building.innerHTML = "";
  //start
  //get count of lifts and floors from the form
  const floorsCount = parseInt(document.getElementById("floor__number").value);
  const liftsCount = parseInt(document.getElementById("lift__number").value);

  // get innerHTML for floors and lifts
  const floors = buildFloors(floorsCount);
  const lifts = buildLifts(liftsCount);

  //ppend floors and lifts
  building.appendChild(floors);
  building.appendChild(lifts);

  //disable buttons for 1st and last floor
  document.getElementById("btn__down__1").style.display = "none";
  document.getElementById(`btn__up__${floorsCount}`).style.display = "none";
}

//add floors to building
function buildFloors(count) {
  let container = document.createElement("div");
  let floors = "";

  for (let i = 1; i <= count; i++) {
    floors += ` <div class="floor position-relative" id="floor-${
      count - i + 1
    }" >
    <button class="btn btn-success" index="${count - i + 1}" floor="${
      count - i + 1
    }" id="btn__up__${count - i + 1}">up</button>
     <br />
            <button class="btn btn-warning" floor="${count - i + 1}" index="${
      count - i + 1
    }" id="btn__down__${count - i + 1}">down</button>
    <p class="position-absolute" style="bottom: 0; right: 0">floor - ${
      count - i + 1
    }</p>
  </div>`;
  }
  container.innerHTML = floors;

  return container;
}

//add lifts to the buiding's ground floor
function buildLifts(count) {
  let container = document.createElement("div");
  let lifts = "";

  for (let i = 1; i <= count; i++) {
    lifts += `
    <div class="lift lift_${i}" index="${i}" id="lift" floor="1" style="left:${
      120 * i
    }px"></div>
  `;
  }
  container.innerHTML = lifts;

  return container;
}
//get lift

function getLift(floor, liftArr) {
  // console.log(floor, typeof floor);
  const arr = [...liftArr];

  const liftOne = arr.find(
    (element) => floor === parseInt(element.attributes.floor.nodeValue)
  );

  const liftTwo = arr.find((element) => !element.classList.contains("busy"));

  let lift = liftOne === undefined ? liftTwo : liftOne;
  // console.log(lift);

  return {
    lift,
    sameFloor: floor === parseInt(lift.attributes.floor.nodeValue),
  };
}

//getLiftsDistanceFromBottom
function getLiftsDistanceFromBottom(liftElement) {
  return (parseInt(liftElement.attributes.floor.nodeValue) - 1) * 160;
}
//get attribute
function getAttribute(attr, element) {
  if (attr === "index") return parseInt(element.attributes.index.nodeValue);
  if (attr === "floor") return parseInt(element.attributes.floor.nodeValue);
}

//set attribute
function setAttribute(attr, element, value) {
  if (attr === "floor") {
    element.attributes.floor.nodeValue = value;
  }
}
