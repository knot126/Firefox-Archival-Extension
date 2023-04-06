var downloadedBefore = [];
var loggingOnly = true;

function clear_seen_list() {
	downloadedBefore = [];
}

function make_file_path_valid(fp) {
	fp = fp.replace("?", "_").replace("&", "_").replace("=", "_").replace("#", "_");
	
	// if it's a domain we need to create its folder instead
	// we also need to ignore any slashes at the start or end... my solution is not great :P
	if (fp.slice(1, -1).indexOf("/") < 0) {
		fp += "/__index__.html";
	}
	
	return fp;
}

var handle_request = function (details) {
	let url = details.url;
	let filename = "Web Archive/" + make_file_path_valid( url.split("/").slice(2).join("/") );
	
	console.log("Try to download file: " + url);
	
	if (loggingOnly) {
		console.log("Considering URL: " + url);
		console.log("Considering filename: " + filename);
		console.log("Origin URL: " + details.originUrl);
	}
	
	// I really have no clue what causes it, but firefox seems to try to parse any
	// html that we download so we need to keep a list of seen sites.
	if (downloadedBefore.indexOf(url) < 0) {
		downloadedBefore.push(url);
	}
	else {
		console.log("Already seen this url before.");
		return undefined;
	}
	
	if (url !== undefined) {
		browser.downloads.download({
			url: url,
			filename: filename,
			allowHttpErrors: false,
			conflictAction: "overwrite",
			saveAs: false
		});
	}
	
	return undefined;
}

function main() {
	// Let's declare ourselves as recieving requests!
	let filter = {urls: ["<all_urls>"]};
	browser.webRequest.onBeforeRequest.addListener(handle_request, filter, []);
	
	console.log("Initted!");
}

main();
