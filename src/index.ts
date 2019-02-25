export interface PredictionParam {
  elementSelectors: string[];
  handler: PredictionHandler;
  confidentDistance?: number;
  confidentResultCount?: number;
}

export interface PredictionResult {
  // the selector of the closest element
  selector: string;
  // the closest element object
  element: Element;
  // the distance (px) to the closest element
  distance: number;
}

export interface PredictionHandler {
  ( result: PredictionResult ): void;
}

export interface ElementPredictor {
  setup( param: PredictionParam ): ElementPredictor;
  start(): ElementPredictor;
  stop(): ElementPredictor;
  destroy(): ElementPredictor;
}

class ElementPredictorImpl implements ElementPredictor {

  private elementSelectors: string[];
  private handler: PredictionHandler;
  private confidentDistance: number = 200;
  private confidentResultCount: number = 10;

  private documentListener: EventListenerOrEventListenerObject;

  private previousResult: PredictionResult;
  private sameResultCount: number = 0;

  public setup( param: PredictionParam ): ElementPredictor {
    this.destroy();
    this.elementSelectors = param.elementSelectors;
    this.handler = param.handler;
    if ( param.confidentDistance ) {
      this.confidentDistance = param.confidentDistance;
    }
    if ( param.confidentResultCount ) {
      this.confidentResultCount = param.confidentResultCount;
    }
    this.documentListener = this.createDocumentListener();
    return this;
  }

  public start(): ElementPredictor {
    this.registerDocumentListener();
    return this;
  }

  public stop(): ElementPredictor {
    this.deRegisterDocumentListener();
    return this;
  }

  public destroy(): ElementPredictor {
    this.stop();
    this.elementSelectors = null;
    this.handler = null;
    this.documentListener = null;
    return this;
  }

  private createDocumentListener(): EventListenerOrEventListenerObject {
    return ( event: MouseEvent ): void => {
      if ( this.elementSelectors == null
        || this.elementSelectors.length === 0
        || !this.handler ) {
        return;
      }

      let result = this.predictResult( event );
      this.handler( result );
    };
  }

  private predictResult( event: MouseEvent ): PredictionResult | undefined {
    let currentResult = this.getClosest( event );
    this.checkAndCount( currentResult );
    if ( this.isResultToGo( currentResult ) ) {
      return currentResult;
    }
  }

  private getClosest( event: MouseEvent ): PredictionResult | undefined {
    let closestSelector: string | undefined;
    let closestElement: Element | undefined;
    let closestDistance;

    this.elementSelectors.forEach( selector => {
      let element = this.getElement( selector );
      if ( !element || !this.isElementInTheViewPort( element ) ) {
        return;
      }
      let distance = this.calculateDistance( event, element );
      if ( closestDistance !== undefined && distance > closestDistance ) {
        return;
      }
      closestSelector = selector;
      closestElement = element;
      closestDistance = distance;
    } );

    return closestElement && {
      selector: closestSelector,
      element: closestElement,
      distance: closestDistance
    };
  }

  private checkAndCount( currentResult: PredictionResult ): void {
      // reset if the current result is not valid
    if ( !currentResult
      // reset if the closest element is changed
      || (this.previousResult && this.previousResult.element !== currentResult.element)
      // reset if mouse is moving away from the current element
      || (this.previousResult && this.previousResult.distance < currentResult.distance) ) {
      this.resetCounting();
      return;
    }

    this.count( currentResult );
  }

  private resetCounting(): void {
    this.previousResult = undefined;
    this.sameResultCount = 0;
  }

  private count( currentResult: PredictionResult ): void {
    this.previousResult = currentResult;
    this.sameResultCount++;
  }

  private isResultToGo( currentResult: PredictionResult ) {
    return this.sameResultCount > this.confidentResultCount
        && currentResult.distance < this.confidentDistance;
  }

  private getElement( selector: string ): Element | null {
    return document.querySelector( selector );
  }

  private isElementInTheViewPort( element: Element ): boolean {
    let elementRect = element.getBoundingClientRect();
    return elementRect.top >= 0
        && elementRect.left >= 0
        && elementRect.bottom <= ( window.innerHeight || document.documentElement.clientHeight )
        && elementRect.right <= ( window.innerWidth || document.documentElement.clientWidth );
  }

  private calculateDistance( event: MouseEvent, element: Element ): number {
    let elementRect = element.getBoundingClientRect();
    let elementX = elementRect.left + ( elementRect.width / 2 );
    let elementY = elementRect.top + ( elementRect.height / 2 );
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    return Math.floor( Math.sqrt(Math.pow(mouseX - elementX, 2) + Math.pow(mouseY - elementY, 2) ) );
  }

  private registerDocumentListener(): void {
    document.addEventListener( "mousemove", this.documentListener );
  }

  private deRegisterDocumentListener(): void {
    document.removeEventListener( "mousemove", this.documentListener )
  }
}

export default new ElementPredictorImpl();
