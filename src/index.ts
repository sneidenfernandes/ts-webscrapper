import {argv} from "process";

import { getHTML } from "./crawl";


function isValidURl(url: string){
    try {
        new URL(url);
        return true;
    }catch(err){
        return false;
    }
}


 async function main(){
    
    const args = argv.slice(2);

    if(args.length < 1){
        console.error("1 argument expected. Less than 1 argument provided");
        process.exit(1);
    }

    if(args.length > 1){
        console.error("1 argument expected. More than 1 argument provided");
        process.exit(1);
    }

    if(args.length === 1 ){

        if(!isValidURl(args[0])){
           console.error("INVALID URL. Please provide a valid url.")
           process.exit(1);
        }

        console.log(`Crawler starting at ${args[0]}`);

        const html = await getHTML(args[0]);

        console.log(html);
        
    }


}

main();