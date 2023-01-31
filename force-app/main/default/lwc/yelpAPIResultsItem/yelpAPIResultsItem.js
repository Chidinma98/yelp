import { LightningElement, api } from 'lwc';



export default class YelpAPIResultsItem extends LightningElement {
    
    @api resultId;
    @api resultName;
    @api resultAddress;
    @api resultCity;
    @api resultState;
    @api resultPhone;
    @api resultFormattedDistance;
    @api resultFormattedReviewCount;
    @api resultRatingImg;
    @api resultUrl;
    
    
}

