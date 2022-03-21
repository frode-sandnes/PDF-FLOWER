# PDF-FLOWER
1. document-magnifier.html holds the main gui.
2. document-magnifier.js is the control logic for the main gui.
3. extract-pdf.js reads pdf files using the pdf.js library
4. words-from-pixels.js perform word segmentation at the canvas pixel level.
5. words-from-tesseract.js uses the tesseract.jw library to sement words
6. canvas-pixel-manipulation.js is for low-level pixel manipulations, especially simple projections
7. generate-reflowable-html.js creates the stand alone reflowable html file. This makes use of the FileSaver.js library.

Run PDF-flower at https://frode-sandnes.github.io/PDF-FLOWER/
