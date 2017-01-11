var xmlmapping = require('xml-mapping')

function formatJsonLiteralsForXmlMapping(sourceObject) {
	var result = {}
	var openlist = []
	var closelist = []
	var replacements = [] // {object: (the object that holds the literal), label: the value that needs to be replaced}


	openlist.push(sourceObject)


	while( openlist.length ) {
		var explore = openlist.shift()
		if(closelist.indexOf(explore) >= 0) {
			continue // if already visited, move along
		}
		closelist.push(explore)
		if(typeof explore == 'object') {
			for(idx in explore) {
				var maybeExplore = explore[idx]
				if(typeof maybeExplore == 'object') {
					if(closelist.indexOf(maybeExplore) < 0) {
						openlist.push(maybeExplore)
					}
				}
				else {
					replacements.push({object:explore, label:idx, literal:maybeExplore}) // mark this literal for later expansion
				}
			}
		}
	}

	// perform in-place formatting of the json object
	for( idx in replacements ) {
		var replacement = replacements[idx]
		var literal = replacement.object[replacement.label]
		replacement.object[replacement.label] = {$t:replacement.literal}
	}
	
	return sourceObject
}



console.log(formatJsonLiteralsForXmlMapping({a:{b:5},c:3}))
console.log(xmlmapping.dump({a:{b:5},c:3}))
console.log(xmlmapping.dump(formatJsonLiteralsForXmlMapping({a:{b:5},c:3})))

