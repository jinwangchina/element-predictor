element-predictor
==============
[![npm Version](https://img.shields.io/npm/v/@jinwangchina/element-predictor.svg)](https://www.npmjs.com/package/@jinwangchina/element-predictor)
[![npm Version](https://img.shields.io/npm/l/@jinwangchina/element-predictor.svg)](https://www.npmjs.com/package/@jinwangchina/element-predictor)
[![npm Version](https://img.shields.io/bundlephobia/minzip/@jinwangchina/element-predictor.svg)](https://www.npmjs.com/package/@jinwangchina/element-predictor)
[![npm Version](https://img.shields.io/npm/dm/@jinwangchina/element-predictor.svg)](https://www.npmjs.com/package/@jinwangchina/element-predictor)
[![npm Version](https://img.shields.io/travis/jinwangchina/element-predictor.svg)](https://www.npmjs.com/package/@jinwangchina/element-predictor)

Predict which element (DOM) the user wants to interact with so that your web app can react faster!

## Installation
```
npm install --save @jinwangchina/element-predictor
```

## Usage
##### Generic - html
```html
<script src="https://unpkg.com/@jinwangchina/element-predictor"></script>
<script>
    var ep = elementPredictor.default;
    
    // setup
    ep.setup( {
        elementSelectors: [ "#buttonId1", "#buttonId2", "#buttonId3", "#buttonId4", "#buttonId5" ],
        handler: result => {
            if ( result ) {
                console.log( result.selector );  // the predicted element selector
                console.log( result.element );   // the predicted element object
                console.log( result.distance );  // the distance from cursor to the predicted element
            } else {
                console.log( "nothing predicted" );
            }
        }
    } );
    
    // start predicting
    ep.start();
    
    // stop predicting
    ep.stop();
    
    // destroy the setup
    ep.destroy();
</script>
```

##### Webpack
```js
import ep from "@jinwangchina/element-predictor";

// setup
ep.setup( {
    elementSelectors: [ "#buttonId1", "#buttonId2", "#buttonId3", "#buttonId4", "#buttonId5" ],
    handler: result => {
        if ( result ) {
            console.log( result.selector );  // the predicted element selector
            console.log( result.element );   // the predicted element object
            console.log( result.distance );  // the distance from cursor to the predicted element
        } else {
            console.log( "nothing predicted" );
        }
    }
} );

// start predicting
ep.start();

// stop predicting
ep.stop();

// destroy the setup
ep.destroy();
```

## Example
Check out "example" directory for the source code.  
![Example Animated GIF](example/ep-example.gif)


## License
Apache-2.0
