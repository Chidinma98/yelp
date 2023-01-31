import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = ['Account.BillingStreet', 'Account.BillingPostalCode'];

export default class YelpAPIResults extends LightningElement {
    @api recordId;
    account;
    street;
    postalCode;
    searchAddress;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading data',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {
            this.account = data;
            this.street = this.account.fields.BillingStreet.value;
            this.postalCode = this.account.fields.BillingPostalCode.value;
            this.searchAddress = this.street + ' ' + this.postalCode;
            this.searchAddress = this.searchAddress.replace(/ /g, '+');
            console.log(this.searchAddress);
        }
    }
    
    @track results = [];
    @track tableData = [];
    //@track filteredTableData = [];
    queryTerm;
    searchURLbase = "https://grewis-yelp.herokuapp.com/search?address=";
    searchURL;

    boolShowImage = false;
    boolShowSpinner = false;
    strUrl;


    connectedCallback(){
        //this.fetchData(); added to the search button icon
    }

    async fetchData(){
        let response = await fetch(this.searchURL); // if we don't mention method then default is get
        let data = await response.json(); // await because of async
        
        this.formatData(data);
    }

    formatData(result){
        let myObject={};
        // loop handles all of the total data collection to separate it out
        // "bizArray":[
        
        result.bizArray.forEach(data => { // bizArray is the group from the api
            let item = data; // data["name"];  // this way cherry picked the group if grouped
            let obj={ // the information I want to use
                Id: item.id, // used as the unique identifier for the object
                Name:item.name,
                Address: item.address,
                City: item.city,
                State: item.state,
                Distance: item.distance,
                Phone: item.phone,
                RatingImg: item.ratingImg,
                ReviewCount: item.reviewCount,
                Url: item.url
            };
            //console.log(JSON.stringify(obj.Address));
            // save the information into Object array
            myObject[item.id] = obj;
            // console.log(JSON.stringify(item.city));
        });
        
        //console.log(JSON.stringify(myObject));
        

        // make the data an array for looping through in LWC
        //console.log(JSON.stringify(result));
        let finalData = Object.keys(myObject).map(data => {
            let item = myObject[data];
            
            //console.log(item.Distance);
            let formattedDistance = 'Distance: ' + (item.Distance).toFixed(2) + ' miles';
            //console.log(formattedDistance);
            let formattedReviewCount = 'Review Count: ' + item.ReviewCount;
            return {...item, // adding special information
                "FormattedDistance":formattedDistance, 
                "FormattedReviewCount":formattedReviewCount
            }; //"..." spreads out the data then we are adding in new parts to the data
        })
        //console.log(JSON.stringify(finalData));
        this.tableData = [...finalData]; // all of the original data
        //this.filteredTableData = [...finalData]; // used for looping on LWC
        

        // Sort the data by distance
        // https://stackoverflow.com/questions/8175093/simple-function-to-sort-an-array-of-objects
        this.tableData = this.sort_by_key(this.tableData, 'Distance');
        
    }

    sort_by_key(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; 
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    handleKeyUp(event) {
        const isEnterKey = event.keyCode === 13;
        if (isEnterKey) {
            this.queryTerm = event.target.value;
            this.queryTerm = this.queryTerm.replace(/ /g, '+');
            this.searchURL = this.searchURLbase + this.searchAddress + '&term=' + this.queryTerm;
            console.log(this.searchURL);
            this.fetchData();
        }
    }
}

