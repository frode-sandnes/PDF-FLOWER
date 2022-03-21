// Main document magnifier  js code. 
// Split pdf into images of words for responsive viewing in borwser
//
// By Frode Eika Sandnes, March 2022 - Oslo Metropolitan University


// globals
var mainProgressMessage = "";
var detailedProgressMessage = "";

// Bootstrapping: The following code is called on startup.        

// callback function from pdf routines - called when file is loaded
async function processPageCallback(canvas,pageNumber,totalPages)
        {        
        setMainProgressMessage(pageNumber,totalPages);              

        const fastEngine = document.getElementById("fast").checked;
        const enhanceContrast = document.getElementById("contrast").checked;
        const negateImage = document.getElementById("negative").checked;
        const smallSize = document.getElementById("smallSize").checked;

        var allWords = "";
        var background;
        if (fastEngine)
                {        
                ({allWords, background} = await analysePage({canvas:canvas,enhanceContrast:enhanceContrast,negateImage:negateImage,analysisEngine:analyseRegion}));
                }
        else    
                {
                ({allWords, background} = await analysePage({canvas:canvas,enhanceContrast:enhanceContrast,negateImage:negateImage,analysisEngine:tesseractAnalyser}));
                }
                
        addWords({canvas:canvas,allWords:allWords,pageNumber:pageNumber,totalPages:totalPages,background:background,smallSize:smallSize});
        }


//start("paper.pdf");   // for testing, remove/comment away otherwise

// called upon start
function start(fn)
        {
        console.time("duration");   
        progress.textContent = "Starting ...";                
        progress.style.visibility = "visible";    // show progress bar 
        loadPdfData(fn);  
        }
// called upon end
function end()
        {
        progress.style.visibility = "hidden";  // hide the progress bar
         // hide the form
        const form = document.querySelector("form");
        form.style.display = "none";   
        // show the download button
        const button = document.querySelector("button");
        button.style.visibility = "visible"; 
        // just checking processing time
        console.timeEnd("duration");
        }
// called if the save reflowable document button is pressed        
function onSave()
        {
        // hide the button so it can only be pressed once    
        const button = document.querySelector("button");                    
        button.style.display = "none";                  
        // save the file
        generateHtml();        
        }        
// update main progress message
function setMainProgressMessage(pageNumber,totalPages)
        {
        mainProgressMessage = "Processing page "+pageNumber+" of "+totalPages+". ";   
        updateProgressMessage();            
        }
// upldate detailed message of sybsystem
function setDetailedProgressMessage(message)
        {
        detailedProgressMessage = message;
        updateProgressMessage();
        }
// update all if one is changed
function updateProgressMessage()
        {
        progress.textContent = mainProgressMessage + detailedProgressMessage;    
        browserUpdate(); 
        }

// Utility function browser: sleep and give control back to browser.
function browserUpdate() 
	{
	const ms = 10; // number of millisecs to pause before returning
	return new Promise(resolve => setTimeout(resolve, ms));
	}	       