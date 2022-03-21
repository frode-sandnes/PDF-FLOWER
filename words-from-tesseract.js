// Text magnification without horizontal scroll, relying on reflow mechanisms 
// in the browser.
// Works by splitting up image file of text into individual words
// as separate images.
//
// Relying on tesseract.js library for word segmentation.
// Relying on fileSaver.js for downloading result in browser. 
//
// By Frode Eika Sandnes, March 2022 - Oslo Metropolitan University

// isolates the area to be analysed
async function tesseractAnalyser({canvasContext:canvasContext,x:x,y:y,w:w,h:h,params:params})
  {
  // extract the part to be analysed from input canvas
  const imageData = canvasContext.getImageData(x,y,w,h);    
  // set up blank canvas with same dimensions
  const subCanvas = document.createElement("canvas");
  subCanvas.width = canvasContext.canvas.width;
  subCanvas.height = canvasContext.canvas.height;
  // put the region onto the blank canvas in the same position
  const subContext = subCanvas.getContext("2d");
  subContext.putImageData(imageData,x,y);
  // analyse the resulting canvas
  return await analyseRegionWithTessereact(subCanvas);  
  }

async function analyseRegionWithTessereact(canvas)
  {
    const ctx = canvas.getContext("2d");
    // use tessaract to get the text
    // set up tesseract worker
    const worker = Tesseract.createWorker(
        {            
            logger: m => {setDetailedProgressMessage(progress.textContent = (100*m.progress).toFixed(0) + "% "+m.status);}
        }
      );
    await worker.load();
    await worker.loadLanguage("eng+nor");
    await worker.initialize("eng+nor");

    // recognize the text      
    const obj = await worker.recognize(canvas);

    // get the bounding boxes from the tesseract result
    return getWordBoundingBoxes(obj);
  }

// extacting image bounding boxes for words in the tesseract result
function getWordBoundingBoxes(obj)
    {
    const allWords = []; 
    // traverse lines
    for (var line of obj.data.lines)
        {
        // traverse words of a line
        // get vertical coordinates from the line to prevent letters to compensate for height signature
        const y = line.bbox.y0;
        const h = line.bbox.y1-line.bbox.y0;
        for (var word of line.words)
            {
            const bbox = word.bbox;
            // variables for ease of reading
            const x = bbox.x0;
            const extraBit = h/5;
            
            var w = bbox.x1-bbox.x0;
            // add extra "little-bit" to get puntuations also
            w += extraBit; // magic number based on "practical heuristic".
            allWords.push({x0:x,y0:y,x1:x+w,y1:y+h});
            }
        }  
    return allWords;
    }