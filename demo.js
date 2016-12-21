var explodify = require('explodify')
var exploder = explodify.fromWSDL('WebService.wsdl')

var jsonPayload = {
	// Todo: Make explodify work correctly even if the attributes of Header are attributes of payload instead
	header: {
		kind: 'iccid',
		id: '12345',
	},
	objPayload: {
		kind: 'imei',
		id: 'abcde'
	},
	
	arrayPayload:[
		{Number:1},
		{Number:2},
		{Number:3},
		{String:'a'},
		{String:'b'},
		{String:'c'}
	],

	
}

print(exploder.explode(jsonPayload)) // Produces valid Soap message in accordance with WebService.wsdl

jsonPayload.invalidArrayPayload = [
	{Number:1, Oops:'a'},
	{Number:2, Oops:'b'},
	{Number:3},
	{String:'a'},
	{String:'b'},
	{String:'c'}
]

print(exploder.explode(jsonPayload)) // Produces error, invalidArrayPayload cannot be represented using XML


/*
Expected Output:
<soapenv:Envelope 
	xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
	xmlns:tns="nonsense_target" 
	xmlns:oth="nonsense_other">
	<soapenv:Header>
		<tns:Kind>iccid</tns:Kind>
		<tns:Id>12345</tns:Id>
	</soapenv:Header>
	<soapenv:Body>
		<tns:UselessLevel>
			<tns:ObjPayload>
				<tns:UselessLevel2>
					<tns:Kind>imei</tns:Kind>
					<tns:Id>abcde</tns:Id>
				</tns:UselessLevel2>
			</tns:ObjPayload>
		</tns:UselessLevel>
		<oth:ArrayPayload>
			<oth:Number>1</oth:Number>
			<oth:Number>2</oth:Number>
			<oth:Number>3</oth:Number>
			<oth:String>a</oth:String>
			<oth:String>b</oth:String>
			<oth:String>c</oth:String>
		</oth:ArrayPayload>
	</soapenv:Body>
</soapenv:Envelope>




/*
