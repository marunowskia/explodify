var explodify = require('explodify')
var exploder = explodify.fromWSDL('WebService.wsdl')

var payload = {
	kind: 'iccid',
	id: '12345'
}

print(exploder.explode(payload))
