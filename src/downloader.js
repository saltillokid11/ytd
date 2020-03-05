const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const {isURL} = require("./helpers");

let url = require('url');


const downloader = new YoutubeMp3Downloader({
   ffmpegPath: "/usr/local/bin/ffmpeg",
   outputPath: "/Users/tanner/Downloads",
   youtubeVideoQuality: 'highest',
   queueParallelism: 3,
   progressTimeout: 2000
});


module.exports = {
   download: function (videoIdOrLink, fileName) {
       return new Promise(((resolve, reject) => {
           let videoId = videoIdOrLink;
           
           if (!videoIdOrLink) {
               throw new Error("Please enter a valid video id or link")
           }
           
           if (isURL(videoIdOrLink)) {
               let urlQueryObj = url.parse(videoIdOrLink, true).query
               videoId = urlQueryObj.v;
           }

           downloader.download(videoId, fileName);
           
           downloader.on('finished', function (err, data) {
               resolve(data);
           });
           
           downloader.on('error', function (err) {
               reject(err);
           });
       }))
   },
   downloader
};

