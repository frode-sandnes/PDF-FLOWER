// Js-code for creating stand-alone relfowable html based on canvas with image and list of words. 
//
// By Frode Eika Sandnes, March 2022 - Oslo Metropolitan University

// constants
// minimized with https://www.toptal.com/developers/javascript-minifier/    
const preOpen = "<html><head><style>*{background:"; // so we can insert colour here
const preClose = ";border-style:solid;border-color:transparent;border-width:5px}</style><script>";
const scrpt = String.raw`function decode(e){var d=0,n=e.length,t=[];for(var a of e){var o=new Image;o.src=a.img,t.push(o),o.onload=function(a,o,r){++d>=n&&drawImages(e,t)}}}function drawImages(e,d){for(var n of e)if(1==n.width){var t=document.createElement("br");document.body.appendChild(t);var a=document.createElement("br");document.body.appendChild(a)}else{var o=d[e.indexOf(n)],r=n.width,c=n.height,i=document.createElement("canvas");i.width=r,i.height=c,i.getContext("2d").drawImage(o,0,0),document.body.appendChild(i)}}`;
const variable = "images=";
const post = ";decode(images);</script></head><body></body></html>";

// full version of the minimized js in the generated html file.
// BEGIN to be minimized in scrpt variable
function decode(images)
    {
    // first load in the images
    var loaded = 0;
    var noImages = images.length;
    var imgs = [];
    for (var r of images)
      {
      var img = new Image();
      img.src = r.img;
      imgs.push(img);
      img.onload = function(img,w,h) 
            {
            loaded++;
            if (loaded >= noImages)
                {
                drawImages(images,imgs);  // draw the images when they are all loaded
                }
            };
      }
    }
function drawImages(images,imgs)    
    {
    for (var r of images)
      {    
      if (r.width == 1) // we got a spacing image, spacing with br-element
            {
            var br1 = document.createElement('br');
            document.body.appendChild(br1);
            var br2 = document.createElement('br');
            document.body.appendChild(br2);            
            }
    else
            {
            // otherwise insert the image
            var idx = images.indexOf(r);
            var img = imgs[idx];   
            var w = r.width;
            var h = r.height;   
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            document.body.appendChild(canvas);
            }   
     }
  }
// END to be minimized in scrpt variable

// Globals
// Since the pages can arrive in arbitrary order due to different processing times, we need to keep track of these.
var images = new Map();
    
// Initialise global variables if called multiple times.
function init()
    {
    images = new Map();        
    }

// Add words from page to the "mix"
function addWords({canvas:canvas,allWords:allWords,pageNumber:pageNumber,totalPages:totalPages,background:background,smallSize:smallSize})
    {
    const ctx = canvas.getContext("2d");        
    // traverese all the words and store the contents
    var wordImages = [];
    for (var word of allWords)
        {
        const x = word.x0;
        const y = word.y0;
        const w = word.x1 - word.x0;
        const h = word.y1 - word.y0;
        // get the image of the current word
        const wordImage = ctx.getImageData(x,y,w,h);    
        // create temporary canvas for word
        const wordCanvas = document.createElement("canvas");
        wordCanvas.width = w;   // set the canvas equal to the word dimensions.
        wordCanvas.height = h;
        // draw the word on the new canvas
        const wordCtx = wordCanvas.getContext("2d");
        wordCtx.putImageData(wordImage, 0, 0);
        // set the desired image quality
        const imageQuality = (smallSize)? 0.5: 1.0;
        // save the data structure
        const imageData = {
                        img: wordCanvas.toDataURL("image/jpeg", imageQuality), 
                        width: w, 
                        height: h
                        };     
        wordImages.push(imageData);  
// possible memory leak - check - do we need to remove wordImage explicitly?        
        }
    // associate the word images on the page with the page number
    images.set(pageNumber,wordImages);  

    // check if we have processed all the pages
    if (images.size >= totalPages)
        {     
        // sort into page number order
        const imageArray = [];
        for (var i=1;i<=totalPages;i++)
            {
            // get word images for the page
            var wordImages = images.get(i);                      
            imageArray.push(...wordImages);
            }
        // store the results for later
        images = imageArray;
        // draw the words in the browser   
        decode(images);    
        // set the background color        
        document.body.style = "background:"+"rgb("+background.r+","+background.g+","+background.b+")";    
        // indicate finish to main gui
        end(); 
        }
    }


// Save the low-vision accessible html version of the document. - called at the end.
function generateHtml()
    {
    var str = preOpen 
              + document.body.style.background
              + preClose + scrpt + variable;
    str += JSON.stringify(images);
    str += post;
    const blob = new Blob([str], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "accessible.html");
    }
