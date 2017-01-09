// explodify helper functions

var fs = require('fs')
var xmlmapping = require('xml-mapping')

function fitToStructure(dataVal, dataLabel, referenceRoot) {
	
	console.log(dataVal)
	if(dataVal == null || dataLabel == null) {
		return null
	}

	// Super naive implementation.
	// Lacks ability to conditionalize the validity of an assignment on the existence of other children.

	var possibleAssignments = referenceRoot.lookupTable[dataLabel]
	var result = [/* what should this actually return? */]

	var dataChildren = []
	
	// if(dataVal[Symbol.iterator]) {
	// 	dataChildren = dataVal
	// }
	// for(dataChildLabel in dataChildren) {
	for(dataChildLabel in dataVal) {
		console.log(dataChildLabel)
		var foundPossibleSubstructure = false
		for(referenceChild in possibleAssignments) {
			
            // A substructure is a single valid mapping from every child element of dataChild to a corresponding element in the tree of referenceChild
			possibleSubstructure = fitToStructure(dataChild, referenceChild)
			if(possibleSubstructure) {
				possibleSubstructure.push({dataNode: dataVal, referenceNode: referenceChild})
				result.push(referenceChild * possibleSubstructure)
				foundPossibleSubstructure = true             
			}
        }
		if(!foundPossibleSubstructure) {
			return null
		}
	}
}

function buildReferenceTree(wsdlUri) {
	// Todo: verify that we got a file, and not a URL

	// fileHandle -> fileContents
	var contents = fs.readFileSync(wsdlUri, 'utf8');
	
	// fileContents -> object representing valid xml hierarchy
	var simpleWsdl = convertXmlToJson(contents)

	console.log(simpleWsdl)


	// OH MY GOD MAGIC GOES HERE
	// We'll start with only wsdls that don't allow recursion in the message body.
	// XXX

	// json of wsdl -> reference tree

	// buildLookupTables(referenceTreeRoot)
	// return referenceTreeRoot
}

function buildLookupTables(referenceTreeRoot) {
	// ===========================================================================================================================
	// For each json element in the data tree, we need to find all possible assignments of that node to an element in the reference tree
	// Therefore, for a given node in the reference tree we need to be able to accept an element name and give back all possible places that node can get matched to.
	// ===========================================================================================================================

	// Any element that matches this reference tree node's name can be mapped to this reference tree node.
	var lookupTable = {}
	lookupTable[referenceTreeRoot.name] = referenceTreeRoot
	//var lookupTable = {[referenceTreeRoot.name]:[referenceTreeRoot]} // lol, javascript is silly
	referenceTreeRoot.lookupTable = lookupTable
	
	var children = referenceTreeRoot.children
	if(children) {
		console.log(children)
		for(var idx in children) {
			var child = children[idx]
			buildLookupTables(child)
			mergeLookupTables(lookupTable, child.lookupTable)
		}
	}
}

function mergeLookupTables(dest, source) {

	for(key in source) {
		if(dest[key]) {
			dest[key] = [].concat(dest[key]).concat(source[key])
		}
		else {
			dest[key] = [].concat(source[key])
		}
	}
}

function produceSimpleVersion(xmlObj) {
	console.log(typeof xmlObj)
	if(typeof xmlObj === 'object') {
		console.log(Object.keys(xmlObj))
		var result = {}
		for(key in xmlObj) {
			console.log('key: ' + key)
			if(key=='$t') { // simplification step
				return xmlObj[key] 
			}
			result[key] = produceSimpleVersion(xmlObj[key])
		}
		console.log(JSON.stringify(xmlObj) + ' is returning object' +JSON.stringify( result))
		return result
	}
	else return xmlObj
}

function convertXmlToJson(body) {
	try {
		// body = "<xs:schema>5 \
		// </xs:schema>"
		// remove namespace abbreviations
		var xmlWithNoNamespace = body.replace(/<(\/*)([^:]+:)/g, "<$1")//.replace(/\n/g, "") 
		return produceSimpleVersion(xmlmapping.load(xmlWithNoNamespace))
	} catch (err) {
		console.log(err)
	}
}


module.exports = {
	buildReferenceTree:buildReferenceTree,
	buildLookupTables:buildLookupTables,
	mergeLookupTables:mergeLookupTables,
	convertXmlToJson:convertXmlToJson,
	fitToStructure: fitToStructure
}
