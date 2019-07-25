import axios from 'axios';


export default class Search {
    constructor(query){
        this.query = query;
    }
    async getResults(){
    
        const key = 'a6011d8e4176a35c0ce0e7d221b1e0bf';  
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        }catch(error){
            alert(error);
        }
    }
}

