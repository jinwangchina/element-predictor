import ep, {PredictionResult} from "../src/element-predictor";

let resultSelector: string;
document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.position = "relative";
document.body.style.width = "1000px";
document.body.style.height = "500px";
document.body.innerHTML = `
    <button id="btnTopLeft"     style="position: absolute; width: 100px; height: 50px; left: 0px;   top: 0px;">TopLeft</button>
    <button id="btnTopRight"    style="position: absolute; width: 100px; height: 50px; left: 900px; top: 0px;">TopRight</button>
    <button id="btnBottomLeft"  style="position: absolute; width: 100px; height: 50px; left: 0px;   top: 450px;">BottomLeft</button>
    <button id="btnBottomRight" style="position: absolute; width: 100px; height: 50px; left: 900px; top: 450px;">BottomRight</button>
  `;

const moveMouse = ( fromX: number, fromY: number, toX: number, toY: number, numOfSteps: number = 20 ): void => {
  let stepX = ( toX - fromX ) / numOfSteps;
  let stepY = ( toY - fromY ) / numOfSteps;
  for ( let i = 1; i <= numOfSteps; i++ ) {
    let clientX = fromX + stepX * i;
    let clientY = fromY + stepY * i;
    document.dispatchEvent( new MouseEvent( "mousemove", { clientX, clientY } ) );
  }
};

const elementSelectors = [ "#btnTopLeft", "#btnTopRight", "#btnBottomLeft", "#btnBottomRight" ];
elementSelectors.forEach( selector => {
  let element: HTMLElement = document.querySelector( selector );
  element.getBoundingClientRect = () => {
    let width = Number( element.style.width.replace( "px", "" ) );
    let height = Number( element.style.height.replace( "px", "" ) );
    let top = Number( element.style.top.replace( "px", "" ) );
    let left = Number( element.style.left.replace( "px", "" )  );
    let right = left + width;
    let bottom = top + height;
    return { top, left, right, bottom, width, height } as ClientRect;
  };
} );

beforeEach( () => {
  resultSelector = undefined;
  ep.setup( {
    elementSelectors,
    handler: ( result: PredictionResult ): void => {
      resultSelector = result && result.selector;
    }
  } );
  ep.start();
} );

afterEach( () => {
  ep.stop();
  ep.destroy();
} );

test("Predict No Result - Mouse not moved", () => {
  expect( resultSelector ).toBeUndefined();
});

test("Predict Top Left Button", () => {
  moveMouse( 500, 250, 100, 50 );
  expect( resultSelector ).toBe( "#btnTopLeft" );
});

test("Predict Bottom Right Button", () => {
  moveMouse( 500, 250, 900, 450 );
  expect( resultSelector ).toBe( "#btnBottomRight" );
});

test("Predict Top Left Button and then nothing - Mouse move in and out", () => {
  moveMouse( 500, 250, 100, 50 );
  expect( resultSelector ).toBe( "#btnTopLeft" );
  moveMouse( 100, 50, 200, 150 );
  expect( resultSelector ).toBeUndefined();
});
