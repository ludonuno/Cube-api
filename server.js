const express = require("express")
const bodyParser = require("body-parser")
const sizeOf = require("object-sizeof")

const api = require("./api/api.js")

const errorList = {
  route: { error: "Rota não encontrada" },
  parameters: { error: "Parametros errados ou em falta" }
}

const routeList = {
	company: 'Company',
	engine: 'Engine',
	parentAdvisoryGame: 'ParentAdvisoryGame'
  
}


const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/API/:tabela", (req, res, next) => { //Search
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.company.GetCompany( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.id || req.query.name || !sizeOf(req.query)) 
			? api.engine.GetEngine( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryGame:
			(req.query.id || !sizeOf(req.query)) 
			? api.parentAdvisoryGame.GetParentAdvisoryGame( req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
		}
}).post("/API/:tabela", (req, res, next) => { //Create
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.name) 
			? api.company.CreateCompany( req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.name) 
			? api.engine.CreateEngine( req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryGame:
			(req.query.rate && req.query.description) 
			? api.parentAdvisoryGame.CreateParentAdvisoryGame( req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
	}
}).put("/API/:tabela", (req, res, next) => { //Update
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.id && req.query.name) 
			? api.company.UpdateCompany( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.id && req.query.name) 
			? api.engine.UpdateEngine( req.query.id, req.query.name, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryGame:
			(req.query.id && (req.query.rate || req.query.description)) 
			? api.parentAdvisoryGame.UpdateParentAdvisoryGame( req.query.id,  req.query.rate, req.query.description, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
	}
}).delete("/API/:tabela", (req, res, next) => { //Delete
	switch (req.params.tabela) {
		case routeList.company:
			(req.query.id) 
			? api.company.DeleteCompany( req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.engine:
			(req.query.id) 
			? api.engine.DeleteEngine( req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		case routeList.parentAdvisoryGame:
			(req.query.id) 
			? api.parentAdvisoryGame.DeleteParentAdvisoryGame( req.query.id, (error, result) => res.json( error ? { error } : { result } ) ) 
			: res.json(errorList.parameters)
			break
		default:
			res.json(errorList.route)
			break
	}
})

app.get("*", (req, res, next) => {
  res.json(errorList.route)
})

app.listen(port, () => {
  console.log(`App listen on port ${port}.`)
})
