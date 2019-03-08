import ep, {PredictionResult} from "@jinwangchina/element-predictor";

let elementSelectors = [ "#topLeft", "#topRight", "#center", "#bottomLeft", "#bottomRight" ];

ep.setup( {
    elementSelectors,
    handler: ( result: PredictionResult ) => {
        if ( result ) {
            let element = result.element as HTMLElement;
            element.style.border = "2px solid";
        } else {
            elementSelectors.filter( selector => {
                let element = document.querySelector( selector ) as HTMLElement;
                element.style.border = "none";
            } );
        }
    }
} );

ep.start();