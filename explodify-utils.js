// explodify helper functions

var fs = require('fs')
// var xmlmapping = require('xml-mapping')

function buildReferenceTree(wsdlUri) {
	// Todo: verify that we got a file, and not a URL

	
	// fileHandle -> fileContents
	var contents = file.readFileSync(wsdlUri)

	// fileContents -> object representing valid xml hierarchy
	


	// OH MY GOD MAGIC GOES HERE
	// We'll start with only wsdls that don't allow recursion in the message body.
	// XXX

	// json of wsdl -> reference tree

	buildLookupTables(referenceTreeRoot)
	return referenceTreeRoot
}

function buildLookupTables(referenceTreeRoot) {
	// ===========================================================================================================================
	// For each json element in the data tree, we need to find all possible assignments of that node to an element in the reference tree
	// Therefore, for a given node in the reference tree we need to be able to accept an element name and give back all possible places that node can get matched to.
	// ===========================================================================================================================

	// Any element that matches this reference tree node's name can be mapped to this reference tree node.
	var lookupTable = {[referenceTreeRoot.name]:[referenceTreeRoot]} // lol, javascript is silly
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
			dest[key] = dest[key].concat(source[key])
		}
		else {
			dest[key] = source[key].concat([])
		}
	}
}

function produceSimpleVersion(xmlObj) {
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

function convertXmlToJson(req, res, next) {
	try {
		if(!req.internal) {
			req.internal = {}
		}
		req.internal.xmlWithNoNamespace = req.body.replace(/<(\/*)([^:]+:)/g, "<$1").replace(/\n/g, "") // remove namespace abbreviations
		console.log(typeof xmlmapping.load(req.internal.xmlWithNoNamespace))
		req.internal.jsonFromXml = produceSimpleVersion(xmlmapping.load(req.internal.xmlWithNoNamespace))
	} catch (err) {
		console.log(err)
	}
	next()
}


module.exports = [
	buildReferenceTree,
	buildLookupTables,
	mergeLookupTables
	]

