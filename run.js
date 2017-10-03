const FS        = require('fs')
const PARSE     = require('csv-parse')
const STRINGIFY = require('csv-stringify')
const JSON2CSV  = require('json2csv')



let emailAddressArray  = []
let emailAddressArray2 = []
let emailAddressArray3 = []


// Remove static characters
function removeStatic(string) {
	return string.replace(/[,;+='/\\\n]/g,' ')
}


// Remove static characters but keep @
function count(string) {
	console.log(string.replace(/[^@]/g,'').length)
	return
}


// Check if string has @ character
function validateEmailAddress(emailAddress) {

	let splitEmailAddress = emailAddress.split('')

	if(splitEmailAddress.indexOf('@') > -1) {
		emailAddressArray.push(emailAddress.toLowerCase())
	}

	return

}


function removeDuplicates(emailAddressArray) {

	for(let i in emailAddressArray) {

		// Check if Email Address is already in sanitized array, 
		// if not add
		if(emailAddressArray2.indexOf(emailAddressArray[i]) == -1) {
			emailAddressArray2.push(emailAddressArray[i])
		}

	}

}

// Add email to object
function prepareForCSV() {

	for(let i in emailAddressArray2) {
		let ob = {email: emailAddressArray2[i]}
		emailAddressArray3.push(ob)
	}
	
}



let parser = PARSE({ delimiter: ';', relax_column_count: true} , function(err, data){

	if(err) {
		console.log('error')
		console.log(err)
	}
    
    STRINGIFY(data, function(err, output) {

    	if(err) {
    		console.log('error')
    		console.log(err)
    	}


    	// Turn into array
    	let csvArray = removeStatic(output).split(' ')

    	// loop through array
    	for(let data in csvArray) {
    		validateEmailAddress(csvArray[data])
    	}


    	removeDuplicates(emailAddressArray)
    	prepareForCSV()

    	let csv = JSON2CSV({ data: emailAddressArray3 })

    	FS.writeFile('clean-emails.csv', csv, function(err) {

    		if(err) {
    			throw err
    		}

    		console.log('done! saved!')

    	})

    })
})

FS.createReadStream(__dirname+'/email.csv').pipe(parser)