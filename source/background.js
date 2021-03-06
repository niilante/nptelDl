chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  	downloadCourse(request);
});

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function downloadCourse(courseCode){
	var courseLink = 'http://nptel.ac.in/courses/'+courseCode+'/';
		$.get( courseLink, 	
			function( data ) {

				var title = $(data).filter('title').text();
				console.log(title);
				alert('Downloadin Course: '+title);
				var scriptTag = $(data).filter('[type="application/ld+json"]').text();
				var courseDetails = JSON.parse(scriptTag);
				console.log(courseDetails);
				var lectures = courseDetails.partOfEducationalTrack;
				for(var i=0;i<lectures.length;i++)
				downloadVideo(courseCode,i+1,lectures[i]);
			}
		);
}


function downloadVideo(courseCode,lec,pageLink){
	$.get( pageLink,	
		function( data ) {
			
			var downloadLink = $(data).find('#download')[0].childNodes[5].childNodes[3].href;
			console.log(downloadLink);
			var videoName = getParameterByName('subjectName',downloadLink);
			nameOfFile = courseCode + '_lec_' + lec + '_'+ videoName;
			nameOfFile = nameOfFile.replace(/[^A-Z0-9]/ig, "_")+'.mp4';
			console.log(nameOfFile);
			chrome.downloads.download({
			  url: downloadLink,
			  filename: nameOfFile
			});				
		}
	);
}