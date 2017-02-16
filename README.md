# Minimizall

A simple CLI tool to minimize static web sites in a single command.

It will walk over all files within the input folder, copy them to the output folder and minimize `.html`, `.js`, `.css` and `.svg` files.

- **HTML** minimization is performed with [html-minifier](https://github.com/kangax/html-minifier)
- **JS** minimization is performed with [UglifyJS](https://github.com/mishoo/UglifyJS2)
- **CSS** minimization is performed with [clean-css](https://github.com/jakubpawlowicz/clean-css)
- **SVG** minimization is performed with [svgo](https://github.com/svg/svgo)

## Install

Clone repo :

`git clone https://github.com/HugoSalt/minimizall.git`

Then install globally :

`cd minimizall`

`sudo npm link .`

## Usage

The first argument is the path to the folder of the website to minimize. The second argument is the path to the minimized output folder to be created.

`minimizall path/to/myWebsite path/to/myWebsiteMinimized`

## Note

There's no plan to add more features. The goal is to provide a dead simple one-line command to minimize simple static web site without having to add the complexity of a Gulp/Grunt/Brunch/etc... workflow. If any more feature is needed, one of such HTML Build system should be used instead.
