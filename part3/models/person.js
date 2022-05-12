const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{6,8}/.test(v)
      },
      message: props => `number ${props.value} doesn't follow the correct scheme [xx(x)-xxxxxxxx]!`
    },
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phoneSchema)