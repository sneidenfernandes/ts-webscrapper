import { URL } from 'url';
import {JSDOM} from 'jsdom';


export function normalizeURL(url:string): string{
    
    const parsedURL = new URL(url);

    // Extract the hostname and pathname from the parsed URL
    const hostname = parsedURL.hostname;
    const pathname = parsedURL.pathname;

    // Remove leading and trailing slashes from the pathname
    const normalizedPathname = pathname.replace(/^\/+|\/+$/g, '');
    // Return the normalized URL in the format "hostname/pathname"
    return `${hostname}/${normalizedPathname}`.replace(/\/+/g, '/');
}


export function getURLsFromHTML(html: string, baseUrl: string) {
    const dom = new JSDOM(html, {
        url: baseUrl,
        contentType: "text/html"
    });

    const hrefs = dom.window.document.querySelectorAll('a');

    const urls: string[] = [];
    for(let i=0; i < hrefs.length; i ++){
        const href = hrefs[i].href;

        if(href) {
            if(!href.includes(baseUrl)) {
                urls.push(baseUrl + href)
            }else{
                urls.push(href)
            }
        }
    }
    return urls;
}

export async function getHTML(url:string){

    try{
        const content = await fetch(url);
        
    
    if(content.status !== 200){
        console.error("Something went wrong witht the request.")
        return;
    }

    if(!content.headers.get("content-type")?.includes("text/html")){
        console.error("content-type is not text/html")
    }

    const html = await content.text()
     
    return html;

    }

    catch(e)
    {
        console.error("Something went wrong.")
    }
    
    
}


export async function crawlPage(
    baseURL: string,
    currentURL: string, 
    pages: Record<string, number> = {} 
){

    const baseUrlHostname = new URL(baseURL).hostname;
    const currentUrlHostname = new URL(currentURL).hostname;

    if(baseUrlHostname !== currentUrlHostname){
        return pages;
    }

    const normalisedCurrentUrl = normalizeURL(currentURL);

    if(pages[normalisedCurrentUrl] > 0) {
        pages[normalisedCurrentUrl]++
        return pages;
    }

    pages[normalisedCurrentUrl] = 1;

    console.log(`crawling ${currentURL}`);

        let html = "";
    try {
         html  = String(await getHTML(currentURL));
    } catch(err){
        console.log(`${(err as Error).message}`);
        return pages;
    }

    const nextURLs = getURLsFromHTML(String(html), baseURL);
    
    for(const nextURL of nextURLs){
        pages = await crawlPage(baseURL, nextURL, pages)
    }


    return pages;
}




const baseURl = "https://www.wagslane.dev"
const currentURL = "https://www.wagslane.dev"


await crawlPage(baseURl, currentURL);