#! /usr/bin/env node

var fs = require('fs');
var mkdirp = require('mkdirp');
var recursive = require('recursive-readdir');
var colors = require('colors');
var html_minifier = require('html-minifier').minify;
var clean_css = require('clean-css');
var uglify_js = require("uglify-js");
var svgo = require('svgo');


// Get user passed arguments
var args = process.argv.slice(2);
// Display help message if requested
if (args[0] === "-h" || args[0] === "--help" || args[0] === "help") {
    console.log("Makes a copy of the " + "input folder ".green + "at the " + "output folder".magenta + " and minimizes all .html, .js, .css and .svg files in it.\n");
    console.log("Usage:\n    minimizall " + "[PATH TO INPUT FOLDER]".green + " [PATH TO OUTPUT FOLDER]".magenta + "\n");
    console.log("Arguments:\n");
    console.log("    [PATH TO INPUT FOLDER] ".green + ": Original folder to be minimized.");
    console.log("    [PATH TO OUTPUT FOLDER] ".magenta + ": Minimized copy of the original folder, if [PATH TO OUTPUT FOLDER] does not exist, it will be created.");
}
// Otherwise check validity arguments
else {
    // Make sure we have only two arguments
    if (args.length != 2) {
        console.log("Unexpected number of arguments");
        process.exit(1);
    } else {
        // Check the 1st argument is a valid path to directory
        if (!pathIsDirectory(args[0])) {
            console.log(args[0] + " is not a directory");
            process.exit(1);
        } else {
            // Create dir from 2nd argument if it doesn't exists
            // and then minimize
            mkdirp(args[1], function(err) {
                if (err) {
                    console.error(err)
                } else {
                    // Make sure dstFolder has an ending with "/"
                    var dstFolder = ((args[1].slice(-1) == "/") ? args[1] : args[1] + "/");
                    minimizeFolder(args[0], dstFolder);
                }
            });
        }
    }
}

/*
Checks the given path is a valid directory
*/
function pathIsDirectory(path) {
    try {
        if (fs.lstatSync(path).isDirectory()) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}


/*
Performs the recursive minimization of the given source folder and copy result to
the destination folder
*/
function minimizeFolder(srcFolder, dstFolder) {
    // Get list of files within given src directory
    recursive(srcFolder, function(err, files) {
        // Iterate over all files
        for (var file of files) {
            //console.log("src : " + file);
            var dstFile = dstFolder + file.slice(srcFolder.length);
            //console.log("dest : " + dstFile);
            switch (file.split('.').pop()) {
                case "html":
                    htmlMinimize(file, dstFile);
                    break;
                case "css":
                    cssMinimize(file, dstFile);
                    break;
                case "js":
                    jsMinimize(file, dstFile);
                    break;
                case "svg":
                    svgMinimize(file, dstFile);
                    break;
                default:
                    copyFile(file, dstFile);
            }
        }
    });
}

/*
Minimizes a srcFile .html file to dstFile
*/
function htmlMinimize(srcFile, dstFile) {
    var data = fs.readFileSync(srcFile, "utf-8");
    data = html_minifier(data, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true
    });
    writeFileAtPath(dstFile, data);
    console.log("HTML Minimize ".green + srcFile + " to ".green + dstFile);
}
/*
Minimizes a srcFile .css file to dstFile
*/
function cssMinimize(srcFile, dstFile) {
    var data = fs.readFileSync(srcFile, "utf-8");
    data = new clean_css({
        level: 2
    }).minify(data).styles;
    writeFileAtPath(dstFile, data);
    console.log("CSS Minimize ".green + srcFile + " to ".green + dstFile);
}
/*
Minimizes a srcFile .js file to dstFile
*/
function jsMinimize(srcFile, dstFile) {
    var data = uglify_js.minify(srcFile, {
        mangle: {
            toplevel: true
        }
    }).code;
    writeFileAtPath(dstFile, data);
    console.log("JS Minimize ".green + srcFile + " to ".green + dstFile);
}
/*
Minimizes a srcFile .css file to dstFile
*/
function svgMinimize(srcFile, dstFile) {
    var data = fs.readFileSync(srcFile, "utf-8");
    new svgo().optimize(data, function(result) {
        writeFileAtPath(dstFile, result.data);
        console.log("SVG Minimize ".green + srcFile + " to ".green + dstFile);
    });
}

/*
Copies srcFile to dstFile
*/
function copyFile(srcFile, dstFile) {
    writeFileAtPath(dstFile, fs.readFileSync(srcFile));
    console.log("Copy ".blue + srcFile + " to ".blue + dstFile);
}


/*
Writes the given data the a file at the given path, creates the parent dirs
if needed
*/
function writeFileAtPath(path, data) {
    pathWithoutFile = path.substring(0, path.lastIndexOf("/"));
    mkdirp(pathWithoutFile, function(err) {
        if (err) console.error(err)
        else fs.writeFileSync(path, data);
    });
}
