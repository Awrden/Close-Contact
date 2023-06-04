const urlBase = 'http://close-contact.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doRegister()
{	
	let firstName = document.getElementById("FirstName").value;
	let lastName = document.getElementById("LastName").value;
	let login = document.getElementById("login").value;
	let password = document.getElementById("password").value;
	let passwordConfirmation = document.getElementById("passwordConfirmation").value;

	if (firstName.length < 1 || lastName.length < 1)
	{
		document.getElementById("registerResult").innerHTML = "First/Last name cannot be left blank";
		return;
	}
	if (login.length < 1)
	{
		document.getElementById("registerResult").innerHTML = "Login cannot be left blank";
		return;
	}
	if (!validPassword(password))
	{
		document.getElementById("registerResult").innerHTML = "Invalid Password<br> The Requirements:<br> At Least 8 Characters<br>At Least One Lowercase Letter<br>At Least One Upper Case Letter<br>One Number<br>";
		return;
	}
	if (password!==passwordConfirmation) 
	{
		document.getElementById("registerResult").innerHTML = "Passwords must match";
		return;
	}

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {FirstName:firstName, LastName:lastName, login:login, password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{	
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				window.location.href = "login.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function addContact()
{
	let FirstName = document.getElementById("FirstName").value;
	let LastName = document.getElementById("LastName").value;
	let email = document.getElementById("Email").value;
	let phone = document.getElementById("Phone").value;

	if (FirstName.length < 1 || LastName.length < 1)
	{
		document.getElementById("contactAddResult").innerHTML = "First/Last name cannot be left blank";
		return;
	}
	if (email.length < 1)
	{
		document.getElementById("contactAddResult").innerHTML = "email cannot be left blank";
		return;
	}
	if (!validEmail(email))
	{
		document.getElementById("contactAddResult").innerHTML = "Invalid email address";
		return;
	}
	if (!validPhone(phone)) 
	{
		document.getElementById("contactAddResult").innerHTML = "Invalid phone number";
		return;
	}

	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {FirstName:FirstName, LastName:LastName, email:email, phone:phone, userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function updateContact()
{

}

function deleteContact()
{

}


function searchContact()
{
	let srch = document.getElementById("search").value;
	document.getElementById("contactSearchResults").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResults").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for (let i = 0; i <= 10; i++)
				{
            		/*jsonObject.results[i]["FirstNme"];
					jsonObject.results[i]["LastName"];
            		jsonObject.results[i]["Phone"];
            		jsonObject.results[i]["Email"];
					jsonObject.results[i][ID];*/

					/*contactList += jsonObject.results[i]
					contactList += "<br />\r\n";*/
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function validPassword(password)
{ 
	if (password.length < 8 ||
		password.search(/[a-z]/) < 0 ||
		password.search(/[A-Z]/) < 0 ||
		password.search(/[0-9]/) < 0) 
	  {
		return false;
	  } 

	  else 
	  {
		return true;
	  }
}

function validEmail(email) 
{
	const ret = String(email)
	  .toLowerCase()
	  .match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	  );
	return Boolean(ret);
}

function validPhone(phone)
{
	const ret = String(phone).toLowerCase().match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/);

  	return Boolean(ret);
}
