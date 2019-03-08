export interface PredictionParam {
    elementSelectors: string[];
    handler: PredictionHandler;
    confidentDistance?: number;
    confidentResultCount?: number;
}
export interface PredictionResult {
    selector: string;
    element: Element;
    distance: number;
}
export interface PredictionHandler {
    (result: PredictionResult): void;
}
export interface ElementPredictor {
    setup(param: PredictionParam): ElementPredictor;
    start(): ElementPredictor;
    stop(): ElementPredictor;
    destroy(): ElementPredictor;
}
declare class ElementPredictorImpl implements ElementPredictor {
    private elementSelectors;
    private handler;
    private confidentDistance;
    private confidentResultCount;
    private documentListener;
    private previousResult;
    private sameResultCount;
    setup(param: PredictionParam): ElementPredictor;
    start(): ElementPredictor;
    stop(): ElementPredictor;
    destroy(): ElementPredictor;
    private createDocumentListener;
    private predictResult;
    private getClosest;
    private checkAndCount;
    private resetCounting;
    private count;
    private isResultToGo;
    private getElement;
    private isElementInTheViewPort;
    private calculateDistance;
    private registerDocumentListener;
    private deRegisterDocumentListener;
}
declare const _default: ElementPredictorImpl;
export default _default;
