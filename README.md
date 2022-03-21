# PDF-FLOWER
document-magnifier.html holds the main gui.
document-magnifier.js is the control logic for the main gui.
extract-pdf.js reads pdf files using the pdf.js library
words-from-pixels.js perform word segmentation at the canvas pixel level.
words-from-tesseract.js uses the tesseract.jw library to sement words
canvas-pixel-manipulation.js is for low-level pixel manipulations, especially simple projections
generate-reflowable-html.js creates the stand alone reflowable html file. This makes use of the FileSaver.js library.
