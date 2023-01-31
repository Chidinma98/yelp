import { LightningElement, api } from 'lwc';

export default class Pagination extends LightningElement {
currentPage = 1
totalRecords;
recordSize = 3;
totalPage = 0

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
        if(this.currentPage < this.totalPage ){
            this.currentPage = this.currentPage+1
            this.updateRecords()


        }

    }

    previousHandler(){
        if(this.currentPage > 1){
            this.currentPage = this.currentPage -1
            this.updateRecords();

        }

    }

    updateRecords(){
        const start = (this.currentPage-1)*this.recordSize
        const end = this.recordSize*this.currentPage
        this.visibleRecords = this.totalRecords.slice(start, end)
        this.dispatchEvent(new CustomEvent('update',{
            detail:{
                records: this.visibleRecords
            }
        }))
    }


}