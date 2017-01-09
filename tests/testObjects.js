var dataRoot = {
	nodeA: {
		nodeAAAA: "A AA AAA AAAA",
		nodeAB: {
			nodeABAA: {
				nodeABAAA: "A AB ABAA ABAAA"
			}
		}
	},
	
	nodeBBB:{
		nodeXXXX: "B BB BBB XXXX"
	}
}

var referenceRoot= {
	node:{
		nodeA: {
			nodeAA: {
				nodeAAA: {
					nodeAAAA: {},
					nodeAAAB: {}
				},
				nodeAAB: {
					nodeAABA: {},
					nodeAABB: {}
				}

			},
			nodeAB: {
				nodeABA: {
					nodeABAA: {},
					nodeABAB: {}
				},
				nodeABB: {
					nodeABBA: {},
					nodeABBB: {},
					nodeXXXX: {}
				}

			}
		},
		nodeB: {
			nodeBA: {
				nodeBAA: {
					nodeBAAA: {},
					nodeBAAB: {}
				},
				nodeBAB: {
					nodeBABA: {},
					nodeBABB: {}
				}

			},
			nodeBB: {
				nodeBBA: {
					nodeBBAA: {},
					nodeBBAB: {},
					nodeXXXX: {}
				},
				nodeBBB: {
					nodeBBBA: {},
					nodeBBBB: {},
					nodeXXXX: {}
					
				}

			}
		}
	}
}

module.exports = {
	dataRoot: dataRoot,
	referenceRoot: referenceRoot
}