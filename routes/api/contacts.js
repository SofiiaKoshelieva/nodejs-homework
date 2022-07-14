const express = require('express')
const contacts = require("../../models/contacts")
const Joi = require("joi")


const router = express.Router()
const contactsAddScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required()
})
router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
 res.json(result)
  } catch (error) {
    next(error)
  }
  
})

router.get('/:contactId', async (req, res, next) => { 
  try {
    const {contactId}= req.params
    const result = await contacts.getContactById(contactId)
    if (!result) {
      const error = new Error("Not found")
      error.status = 404
      throw error
   
    }
  res.json(result)
  } catch (error) {
    next(error)
    
  }

})

router.post('/', async (req, res, next) => {
  try {
    const {error }= contactsAddScheme.validate(req.body)
    if (error) {
        const error = new Error("missing required name field")
      error.status = 400
      throw error
    }
    const result = await contacts.addContact(req.body)
  res.status(201).json(result)
  } catch (error) {
    next(error)
  }
  
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const {contactId}= req.params
    const result = await contacts.removeContact(contactId)
    if (!result) {
       const error = new Error("Not found")
      error.status = 400
      throw error
    }

    res.json(result)
  } catch (error) {
    next(error)
  }
 
})

router.put('/:contactId', async (req, res, next) => {
  try {
     const {error }= contactsAddScheme.validate(req.body)
      if (error) {
        const error = new Error("missing fields")
      error.status = 400
      throw error
      }
    const {contactId}= req.params
    const result = await contacts.updateContact(contactId, req.body)
    if (!result) {
       const error = new Error("Not found")
      error.status = 404
      throw error
    }
res.json(result)
  } catch (error) {
    next(error)
  }
 
})

module.exports = router
