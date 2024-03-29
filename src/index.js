require('chromedriver');

const program = require("commander");
const Downloader = require('./downloader');
const ora = require('ora');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// let extensionPath = "../chrome_extensions/adblock/";

const spinner = ora('Downloading file...').start();
spinner.color = 'magenta';
spinner.text = 'Downloading...';
spinner.spinner = 'aesthetic';

var chromeOptions = new chrome.Options();
chromeOptions.addArguments("start-maximized");
// chromeOptions.addArguments("load-extension=" + extensionPath);
chromeOptions.addArguments("headless");

let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

driver.get("http://www.youtube.com")

program.version('0.0.1').description("A simple node-cli youtube downloader");

 
program.command('ytd')
    .requiredOption('-l, --link <link>', 'A youtube video link or id')
    .option('-n, --name [name]', 'Name of the downloaded file')
    .action((cmObj) => {
        let {link, name} = cmObj;
        Downloader.download(link, name)
            .then(finishedObj => {
                //tell the spinner everything is done loading
                spinner.succeed(`Finished downloading...${finishedObj.videoTitle}`);
            }).catch(err => {
             //tell the spinner something went wrong.
            spinner.fail("Could not download that file. An Error occurred.")
            console.error(err);
        });
            //recall that we exported the ‘downloader’ object alongside the promise function
        Downloader.downloader.on('progress', function (progressObj) {
            //every time the progress is updated, round off the percentage done to the nearest 2 d.p and set it to the spinner
            spinner.text = `${Number(progressObj.progress.percentage).toFixed(2)}% done`;
        })
    });

program.parse(process.argv);
