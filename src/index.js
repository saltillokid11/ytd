require('chromedriver');

const program = require("commander");
const Downloader = require('./downloader');
const ora = require('ora');
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
const chrome = require('selenium-webdriver/chrome');

// let extensionPath = "../chrome_extensions/adblock/";

const spinner = ora('Downloading file...').start();
spinner.color = 'magenta';
spinner.text = 'Downloading...';
spinner.spinner = 'aesthetic';

const chromeOptions = new chrome.Options();
chromeOptions.addArguments("start-maximized");
chromeOptions.addArguments("--start-fullscreen");
// chromeOptions.addArguments("load-extension=" + extensionPath);
// chromeOptions.addArguments("headless");

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();


// driver.wait(function() {
//     return driver.executeScript('return document.readyState').then(function(readyState) {
//       return readyState === 'complete';
//     });
//   });

program.version('0.0.1').description("A simple node-cli youtube downloader");
 
program.command('ytd')
    .requiredOption('-l, --link <link>', 'A youtube video link or id')
    .option('-n, --name [name]', 'Name of the downloaded file')
    .action((cmObj) => {
        let {link, name} = cmObj;
        driver.get(link);
        if(link.includes("&list=")){
            console.log("YESSSSSSS");
            let listSubString = link.substring(
                link.lastIndexOf("&list=") + 6, 
                link.lastIndexOf("&index=")
            );
            console.log("\n" + "listSubString= " + listSubString );

            let items = driver.findElement(By.xpath("//ytd-playlist-panel-renderer[@id = 'playlist']"));
            driver.wait(until.elementIsVisible(items), 10000);
            
            //////PENDING/////////////////
            var vidList = driver.findElements(By.xpath("//ytd-playlist-panel-renderer[@id = 'playlist']/descendant::div[@id = 'items']/descendant::ytd-playlist-panel-video-renderer/descendant::h4/descendant::span")).then((elem) => {
                elem.getAttribute("title").then((text) => {
                    console.log("\n" + "text" + text);
                });
                return elem;
            }, (err) =>{
                console.log("\n" + "err" + err);
                return err;
            });
            
            // map(vidList, e => e.getAttribute("value"))
            //     .then((values) => {
            //         console.log("\n" + ">>>>>>" + values);
            //     });

            // vidList.then((elem) => {
            //     console.log("\n" + "444444" + JSON.stringify(elem))
            // });

            // var mainelement = driver.findElement(By.xpath("//ytd-playlist-panel-renderer[@id = 'playlist']/descendant::div[@id = 'items']"))
            //     .findElements(webdriver.By.xpath("//ytd-playlist-panel-renderer[@id = 'playlist']/descendant::div[@id = 'items']/descendant::ytd-playlist-panel-video-renderer"))
            //     .then((element) => { 
            //         console.log("\n" + "element +++++++++++" + JSON.stringify(element));
            //     });
            //     console.log("\n" + "============" + mainelement);
            
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
            });
            // driver.quit();
        } else {
            console.log("NOOOOOOOO");
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
            });
            // driver.quit();
        }
        
    });

program.parse(process.argv);
