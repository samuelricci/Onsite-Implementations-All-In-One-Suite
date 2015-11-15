//Executed on pages by a call from popup.js in the Onsite All In One extension for Google Chrome.
findTaskInfoAndSend();

function findTaskInfoAndSend() {
	var taskType, siteURL, customerID; 
	var googleAccountURL, googleAccountUser, googleAccountPassword;
	var googleWebmastersURL, googleWebmastersUser, googleWebmastersPassword;
	var googleAnalyticsURL, googleAnalyticsUser, googleAnalyticsPassword;
	var ftpURL, ftpUser, ftpPassword;
	var cmsURL, cmsUser, cmsPassword;
	var hostingURL, hostingUser, hostingPassword;
	var taskFileURL;
			
	var listGroupItems = document.getElementsByClassName("list-group-item");
	if (listGroupItems[0] === undefined){
		console.log("No list group items were found. Exiting.");
		return;
	}
	for (i = 0; i < listGroupItems.length; i++) { //Loop through every element in the array and check for our key phrases. If found, save the information that we need.
		if (listGroupItems[i].innerHTML.indexOf("Task Type") > -1)
			taskType = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
		else if (listGroupItems[i].innerHTML.indexOf("Customer URL") > -1)
			siteURL = listGroupItems[i].getElementsByClassName("pull-right")[0].getAttribute('href');
		else if (listGroupItems[i].innerHTML.indexOf("Customer ID") > -1 || listGroupItems[i].innerHTML.indexOf("Customer Id") > -1) 
			customerID = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
		
		if (taskType === "Onsite Blogging - Post Content") {
			if (listGroupItems[i].innerHTML.indexOf("Blog Login URL") > -1) {
				cmsURL = listGroupItems[i].getElementsByClassName("externalLink")[0].innerHTML;
			}
			else if (listGroupItems[i].innerHTML.indexOf("Blog Admin User") > -1) {
				cmsUser = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}
			else if (listGroupItems[i].innerHTML.indexOf("Blog Admin Password") > -1) {
				cmsPassword = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}
			else if (listGroupItems[i].innerHTML.indexOf("Blog Editor User") > -1 && cmsUser === undefined) {
				cmsUser = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}
			else if (listGroupItems[i].innerHTML.indexOf("Blog Editor Password") > -1 && cmsPassword === undefined) {
				cmsPassword = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}
			
		}
		else if (taskType === "Onsite Content Change") {
			if (listGroupItems[i].innerHTML.indexOf("CMS Login Url") > -1) {
				cmsURL = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}
			else if (listGroupItems[i].innerHTML.indexOf("CMS Login Username") > -1) {
				cmsUser = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}
			else if (listGroupItems[i].innerHTML.indexOf("CMS Login Password") > -1) {
				cmsPassword = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}	
		}
		else if (taskType === "Onsite Copy - Publish Copy") {
			if (listGroupItems[i].innerHTML.indexOf("CMS Login URL") > -1) {
				cmsURL = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}
			else if (listGroupItems[i].innerHTML.indexOf("CMS Username") > -1) {
				cmsUser = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}
			else if (listGroupItems[i].innerHTML.indexOf("CMS Password") > -1) {
				cmsPassword = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
			}	
		}
	}

	if (taskType !== undefined && taskType !== "Onsite Content Change" && taskType !== "Onsite Blogging - Post Content" && taskType !== "Onsite Copy - Publish Copy") { //If the task is not an Onsite Content Change.
		var tableRows = document.getElementsByTagName("tr");
		for (i = 0; i < tableRows.length; i++) { //Loop through every element in the array and check for our key phrases. If found, save the information that we need.
			if (tableRows[i].innerHTML.indexOf("externalLink") > -1 && tableRows[i].innerHTML.indexOf("dateText") > -1) {
				var c = tableRows[i].children;
				taskFileURL = c[0].children[0].getAttribute('href');
			}
		}
		
		var primaryButtons = document.getElementsByClassName("btn btn-primary");
		var viewURLButtons = new Array();
		for (i = 0; i < primaryButtons.length; i++) {
			if (primaryButtons[i].innerHTML.indexOf('<span class="externalLink">View</span>') > -1 || primaryButtons[i].outerHTML.indexOf("externalLink: { url: Url, text: 'View' }") > -1)
				viewURLButtons.push(primaryButtons[i]);
		}

		for (i = 0; i < viewURLButtons.length; i++) { //Loop through every element in the array and check for our key phrases. If found, save the information that we need.
			if (viewURLButtons[i].outerHTML.indexOf("href") > -1 && viewURLButtons[i].getAttribute("href").length > 0) {
				if (i == 1)
					cmsURL = viewURLButtons[i].getAttribute("href");
				else if (i == 2)
					hostingURL = viewURLButtons[i].getAttribute("href");
			}
				/*var c = primaryButtons[i].children;
				hostingURL = c[1].innerHTML;
				hostingUser = c[2].innerHTML;
				hostingPassword = c[3].innerHTML;
				ftpURL = c[1].innerHTML;
				ftpUser = c[2].innerHTML;
				ftpPassword = c[3].innerHTML;
				cmsUser = c[2].innerHTML;
				cmsPassword = c[3].innerHTML;*/	
		}
		
		if (customerID !== undefined)
			chrome.runtime.sendMessage( { messageType: "openCustomerAccount", cid: customerID } ); //Send message to open customer's account.
		
		if (cmsURL !== undefined && cmsURL.length > 0) {//If there is a CMS URL...
			if (cmsUser !== undefined && cmsPassword !== undefined)//If there is a CMS username and password, send a message to open the CMS page with the username and password info.
				chrome.runtime.sendMessage( { messageType: "openCMS", url: cmsURL, user: cmsUser, password: cmsPassword } );
			else if (hostingUser === undefined && hostingPassword === undefined) //If the hosting username and password are blank, send a message to open the CMS page.
				chrome.runtime.sendMessage( { messageType: "openCMS", url: cmsURL } );
		}
		else if (hostingURL !== undefined && hostingURL.length > 0) {
			if (hostingUser !== undefined && hostingPassword !== undefined)
				chrome.runtime.sendMessage( { messageType: "openHosting", url: hostingURL, user: hostingUser, password: hostingPassword } );
			else
				chrome.runtime.sendMessage( { messageType: "openHosting", url: hostingURL } );	
		}
		
		if (siteURL !== undefined)
			chrome.runtime.sendMessage( { messageType: "openCustomerSite", url: siteURL } ); //Send message to open customer's site.
		
		if (taskFileURL !== undefined)
			chrome.runtime.sendMessage( { messageType: "openTaskFile", url: taskFileURL } ); //Send message to open task file site.
		
		if (taskType === "Google Webmaster Tools Tag Integration")
			chrome.runtime.sendMessage( { messageType: "openGoogleWMT" } );
		else if (taskType === "Analytics Integration") {
			chrome.runtime.sendMessage( { messageType: "openGoogleAnalytics" } );
		}	
	}
	else if (taskType === "Onsite Blogging - Post Content" || taskType === "Onsite Content Change" || taskType === "Onsite Copy - Publish Copy") {
		if (customerID !== undefined)
			chrome.runtime.sendMessage( { messageType: "openCustomerAccount", cid: customerID } ); //Send message to open customer's account.
			
		if (cmsURL !== undefined) {//If there is a CMS URL...
			if (cmsUser !== undefined && cmsPassword !== undefined)//If there is a CMS username and password, send a message to open the CMS page with the username and password info.
				chrome.runtime.sendMessage( { messageType: "openCMS", url: cmsURL, user: cmsUser, password: cmsPassword } );
			else if (hostingUser === undefined && hostingPassword === undefined) //If the hosting username and password are blank, send a message to open the CMS page.
				chrome.runtime.sendMessage( { messageType: "openCMS", url: cmsURL } );
		}	
			
		if (siteURL !== undefined)
			chrome.runtime.sendMessage( { messageType: "openCustomerSite", url: siteURL } ); //Send message to open customer's site.
		
		if (taskType === "Onsite Content Change") {
			var aElements = document.getElementsByTagName("a");
			for (i = 0; i < aElements.length; i++) {
				if (aElements[i].innerHTML.indexOf("View Onsite Changes File") > -1)
					taskFileURL = aElements[i].getAttribute('href');
			}
				
			if (taskFileURL !== undefined)
				chrome.runtime.sendMessage( { messageType: "openTaskFile", url: taskFileURL } ); //Send message to open task file site.
		}
	}

}
