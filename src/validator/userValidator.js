import Joi from 'joi'

const SignInValidator = Joi.object({
    userName:Joi.string().min(6).max(8).required(),
    pwd:Joi.string().min(6).max(15).required(),
    email:Joi.string().email().required()
})

export  {SignInValidator}