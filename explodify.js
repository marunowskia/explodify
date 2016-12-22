function fitToStructure(dataVal, dataLabel, referenceRoot) {
	
	if(dataRoot == null || dataLabel == null) {
		return null
	}

	// Super naive implementation.
	// Lacks ability to conditionalize the validity of an assignment on the existence of other children.

	var possibleAssignments = referenceRoot.findSubnodesByLabel(dataLabel)
	var result = [/* what should this actually return? */]

	var dataChildren = []
	
	if(dataRoot[Symbol.iterator]) {
		dataChildren = dataRoot
	}

	for(dataChild in dataChildren) {
		var foundPossibleSubstructure = false
		for(referenceChild in possibleAssignments) {
			
			// A substructure is a mapping of each node in the tree of dataChild to a corresponding element in the tree of referenceChild
			possibleSubstructure = fitToStructure(dataChild, referenceChild)
			if(possibleSubstructure) {
				possibleSubstructure.push({dataNode: dataRoot, referenceNode: referenceChild})
				result.push(referenceChild * possibleSubstructure)
				foundPossibleSubstructure = true
			}
		}

		if(!foundPossibleSubstructure) {
			return null
		}
	}
}
