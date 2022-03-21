// Extracting content from pdfs as canvas renderings. 
// Relying on the pdf.js library
//
// By Frode Eika Sandnes, March 2022 - Oslo Metropolitan University

// callback function - called when page is ready to be processed

// retrieving file contents 	
function loadBinaryFile()
	{
	const fileSelector = document.getElementById("file-selector");
	fileSelector.addEventListener('change', (event) => 
		{
		const files = event.target.files;	
		for (var i = 0, f; f = files[i]; i++) 
			{			
			var reader = new FileReader();
			
			reader.onload = (function(theFile) 
				{
				return function(e) 
					{
                    start({data: e.target.result});   // also send start message to main gui                       
					};
				})(f);		
			reader.readAsBinaryString(f);
			}
		});
	}

function loadPdfData(source)  
    {
    const loadingTask = pdfjsLib.getDocument(source);
    // setting up browser update
    loadingTask.onProgress = function(data)
            {
            updateProgressMessage();                
            }
    loadingTask.promise
            .then(function(pdf) 
                {
                const totalPages = pdf.numPages;                
                // Traverse the pages - and render + process each
                for (var pageNumber = 1; pageNumber<=totalPages;pageNumber++)
                    {
                    pdf.getPage(pageNumber)
                        .then(page =>  
                            {
                            const canvas = document.createElement('canvas');    
                            const scale = 2;  // affects the readability of the result
                            const viewport = page.getViewport({scale: scale});
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            const ctx = canvas.getContext('2d');
                            const renderContext = {
                                                canvasContext: ctx,
                                                viewport: viewport
                                                };
                            const renderTask = page.render(renderContext);
                            renderTask.promise.then(() => analyse(canvas,page.pageNumber,totalPages));                                    
                            });
                    }   // close for loop
                })
            .catch(err => console.log(err));
    }

// called when page is loaded    
async function analyse(canvas,pageNumber,totalPages)
    {
    await processPageCallback(canvas,pageNumber,totalPages);
    }