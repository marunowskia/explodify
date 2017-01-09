var explodify_utils = require('./explodify-utils.js')
var xmlmapping = require('xml-mapping')

module.exports = function(wsdl) {
	var referenceRoot = explodify_utils.buildReferenceTree(wsdl)
	return function(dataRoot) {		
		
		var structured = explodify_utils.fitToStructure(dataRoot, referenceRoot)
		console.log(structured)

		// let namespaced = explodify_utils.expandNamespace(structured)
		// console.log(namespaced)

		// let result = xmlmapping.dump(namespaced)
		// console.log(result)

		// let result = xmlmapping.dump(structured)
		// console.log(result)
	}
}
