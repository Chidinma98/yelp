import { LightningElement, api } from 'lwc';

export default class Pagination extends LightningElement {

totalRecords;
recordSize = 3;

get records(){
    return this.visibleRecords
}

    
@api 
set records(data){
    if(data){
        this.totalRecords = data;
        this.visibleRecords = data.slice(0, this.recordSize)
        this.totalPage = data.length/Math.ceil(this.recordSize);
        this.updateRecords()
    }


}

    nextHandler(){

    }

    previousHandler(){

    }

    updateRecords(){
        this.dispatchEvent(new CustomEvent('update',{
            detail:{
                records: this.visibleRecords
            }
        }))
    }


}