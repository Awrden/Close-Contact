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
		document.getElementById("contactAddResult").innerHTML = "Email cannot be left blank";
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

	let tmp = {FirstName:FirstName, LastName:LastName, email:email, phone:formatNumber(phone), userId:userId};
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
	let id = window.localStorage.getItem("ContactID");
	let contactFirstName = document.getElementById("contactFirst").value;
	let contactLastName = document.getElementById("contactLast").value;
	let email = document.getElementById("contactEmail").value;
	let phone = document.getElementById("contactPhone").value;
	document.getElementById("contactUpdateResult").innerHTML = "";

	if (contactFirstName.length < 1 || contactLastName.length < 1)
	{
		document.getElementById("contactUpdateResult").innerHTML = "First/Last name cannot be left blank";
		return;
	}
	if (email.length < 1)
	{
		document.getElementById("contactUpdateResult").innerHTML = "Email cannot be left blank";
		return;
	}
	if (!validEmail(email))
	{
		document.getElementById("contactUpdateResult").innerHTML = "Invalid email address";
		return;
	}
	if (!validPhone(phone)) 
	{
		document.getElementById("contactUpdateResult").innerHTML = "Invalid phone number";
		return;
	}

	let tmp = {FirstName:contactFirstName,LastName:contactLastName,email:email,phone:phone,id:id};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
				setTimeout(function(){updateContact();}, 1000);
				window.location.href = "contacts.html"
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
}

function deleteContact(id)
{
	if (confirm("Are you sure?"))
	{
		let tmp = {id:id};
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/DeleteContact.' + extension;
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					console.log("Nice");
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactDeleteResult").innerHTML = err.message;
		}
	}	
}


function searchContact()
{
	let srch = document.getElementById("search").value;

	// Clearing possible previous search results
	document.getElementById("contactList").innerHTML = "";

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
				let jsonObject = JSON.parse( xhr.responseText );				
				for (let i = 0; i < 8 && i < jsonObject.results.length; i++)
				{
            		displayContact(jsonObject.results[i]["FirstName"],
					jsonObject.results[i]["LastName"],
            		jsonObject.results[i]["Phone"],
            		jsonObject.results[i]["Email"],
					jsonObject.results[i]["ID"])
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function displayContact(FirstName, LastName, Phone, Email, ID)
{
	var cardDiv = document.createElement('div');
	var cardBody = document.createElement('div');
	var cardHead = document.createElement('h5');
	var cardList = document.createElement('ul');
	var cardFirstName = document.createElement('li');
	var cardLastName = document.createElement('li');
	var cardPhone = document.createElement('li');
	var cardEmail = document.createElement('li');
	var cardButtonDiv = document.createElement('div');
	var cardDeleteButton = document.createElement('button');
	var cardEditButton = document.createElement('a');
  
	//Card Div and Contact Information Heading
	cardDiv.setAttribute('class', 'card m-4');
  
	cardDiv.setAttribute('style', 'width: 18rem');
  
	cardBody.setAttribute('class', 'card-body');
	cardHead.setAttribute('class', 'card-title');
	cardHead.textContent = "Contact Information";
  
	// Card Content
	cardList.setAttribute('class', 'list-group list-group-flush');
	cardFirstName.setAttribute('class', 'list-group-item');
	cardLastName.setAttribute('class', 'list-group-item');
	cardPhone.setAttribute('class', 'list-group-item');
	cardEmail.setAttribute('class', 'list-group-item');
	cardFirstName.textContent = FirstName;
	cardLastName.textContent = LastName;
	cardPhone.textContent = Phone;
	cardEmail.textContent = Email;
  
	// Delete Button Setup
	cardButtonDiv.setAttribute('class','card-body text-center d-flex justify-content-around');
	cardDeleteButton.setAttribute('class','btn btn-primary justify-content-center d-flex');
	cardDeleteButton.addEventListener('click', function() {
		cardDiv.remove();
		deleteContact(ID);
	  });
	cardDeleteButton.textContent = 'Delete';  

	// Edit Button Setup
	cardEditButton.setAttribute('class', 'btn btn-primary');  
	cardEditButton.textContent = 'Update';
  	cardEditButton.setAttribute('class', 'btn btn-primary justify-content-center d-flex');
	cardEditButton.setAttribute('type', 'button');  
	var updateContactId = `saveContactId(${ID}); window.location.href="editcontact.html"`;  
	cardEditButton.setAttribute('onclick', updateContactId);
  
	// Getting Contact List div in contacts.html
	let section = document.getElementById('contactList');
  
	// Setting up the card
	section.appendChild(cardDiv);
	cardDiv.appendChild(cardBody);
	cardBody.appendChild(cardHead);
	cardDiv.appendChild(cardList);
	cardList.appendChild(cardFirstName);
	cardList.appendChild(cardLastName);
	cardList.appendChild(cardEmail);
	cardList.appendChild(cardPhone);
	cardDiv.appendChild(cardButtonDiv);	
	cardButtonDiv.appendChild(cardDeleteButton);
	cardButtonDiv.appendChild(cardEditButton);
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
	const ret = String(phone).toLowerCase().match(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/);

  	return Boolean(ret);
}

function saveContactId(id)
{
	window.localStorage.setItem('ContactID',id);
}

function formatNumber(phone)
{
	var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
	var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
	if (match) 
	{
    	var intlCode = (match[1] ? '+1 ' : '');
    	return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  	}
	return null;
}